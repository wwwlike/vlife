/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.plugins.generator;

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.core.dsl.DslDao;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.*;
import com.squareup.javapoet.*;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.lang.model.element.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * MVC层代码生成器
 */
public class GeneratorMaster extends GeneratorUtils {
    List<String> error = new ArrayList<>();

    public  boolean doesClassExist(ClassLoader classLoader, String className) {
        try {
            Class<?> clazz = classLoader.loadClass(className);
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }

    public List<JavaFile> generator(String basePath, ClassLoader loader, List<EntityDto> entitys, List<VoDto> vos, List<ReqDto> res, List<SaveDto> saves) {
        List<JavaFile> waitCreateFiles = new ArrayList();
        try {
            //fitler的目的是只过滤出当前项目里的实体
            List<EntityDto> projectEntitys = entitys.stream().filter(f->doesClassExist(loader,f.getClz().getName())).collect(Collectors.toList());

            List<Class<? extends Item>> entityList = entitys.stream().map(entityDto -> {
                return entityDto.getClz();
            }).filter(f->doesClassExist(loader,f.getName())).collect(Collectors.toList());

            List<Class<? extends VoBean>> voList = vos.stream().map(voDto -> {
                return voDto.getClz();
            }).collect(Collectors.toList());
            List<Class<? extends BaseRequest>> reqList = res.stream().map(resDto -> {
                return resDto.getClz();
            }).collect(Collectors.toList());
            List<Class<? extends SaveBean>> saveList = saves.stream().map(saveBean -> {
                return saveBean.getClz();
            }).collect(Collectors.toList());
            waitCreateFiles.addAll(apiGenerator(basePath, projectEntitys, vos, res, saves));
            waitCreateFiles.addAll(daoGenerator(basePath, entityList));
            waitCreateFiles.addAll(serviceGenerator(basePath, entityList));
            return waitCreateFiles;
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return waitCreateFiles;
    }



    public static String convertToTargetClass(Class<?> entityClass, String targetType) {
        String entityPackage = entityClass.getPackage().getName();
        String entityClassName = entityClass.getSimpleName();
        String targetPackage = entityPackage.replace("entity", targetType);
        String targetClassName = entityClassName + targetType.substring(0, 1).toUpperCase() + targetType.substring(1);
        return targetPackage + "." + targetClassName;
    }
    /**
     * api自动创建;
     * 随着需求变化增量的方法也要能够进入到api里,待实现
     */
    public List<JavaFile> apiGenerator(String basePath, List<EntityDto> entitys, List<VoDto> vos, List<ReqDto> reqs, List<SaveDto> saves) {
        GeneratorAutoApi generatorApi = new GeneratorAutoApi();
        List<JavaFile> files = new ArrayList<>();
        entitys.forEach(entityDto -> {
            String packagePath = entityDto.getClz().getPackage().getName();
            if (!sourceClzExist(entityDto.getClz(), basePath, CLZ_TYPE.API)) {
                files.add(generatorApi.apiGenerator(entityDto, vos, reqs, saves));
            } else {/*增量方法*/
            }
        });
        return files;
    }


    /**
     * 模板service生成
     */
    public List<JavaFile> serviceGenerator(String basePath, List<Class<? extends Item>> items) {
        List<JavaFile> files = new ArrayList<>();
        for (Class item : items) {
            if (sourceClzExist(item, basePath, CLZ_TYPE.SERVICE)) {
                continue;
            }
            String packageName = item.getPackage().getName();
            int index = packageName.lastIndexOf("entity");
            String daoPackageName = packageName.substring(0, index) + "dao";
            String servicePackageName = packageName.substring(0, index) + "service";
            String daoClzName = daoPackageName + "." + item.getSimpleName() + "Dao";
            ClassName superClazz = ClassName.get(VLifeService.class);
            TypeName itemName = TypeName.get(item);
            ClassName daoName = ClassName.get(daoPackageName, item.getSimpleName() + "Dao");
            ParameterizedTypeName clzAndGenic = ParameterizedTypeName.get(superClazz, itemName, daoName);
            TypeSpec user = TypeSpec.classBuilder(item.getSimpleName() + "Service")
                    .addModifiers(Modifier.PUBLIC)
                    .addAnnotation(Service.class)
                    .superclass(clzAndGenic)
                    .build();
            files.add(JavaFile.builder(servicePackageName, user)
                    .build());
        }
        return files;
    }

    /**
     * dao生成
     */
    public List<JavaFile> daoGenerator(String basePath, List<Class<? extends Item>> items) {
        List<JavaFile> files = new ArrayList<>();
        for (Class item : items) {
            if (sourceClzExist(item, basePath, CLZ_TYPE.DAO)) {
                continue;
            }
            ParameterizedTypeName clzAndGenic = ParameterizedTypeName.get(DslDao.class, item);
            TypeSpec user = TypeSpec.classBuilder(item.getSimpleName() + "Dao")
                    .addModifiers(Modifier.PUBLIC)
                    .addAnnotation(Repository.class)
                    .superclass(clzAndGenic)
                    .build();
            String packageName = item.getPackage().getName();
            int index = packageName.lastIndexOf("entity");
            String daoPackageName = packageName.substring(0, index) + "dao";
            files.add(JavaFile.builder(daoPackageName, user)
                    .build());
        }
        return files;
    }

    /**
     * 检查类
     *
     * @param reqDto
     */
    private void check(ReqVoDto reqDto) {
        if (reqDto.getEntityClz() == null) {
            error.add(reqDto.getClz().getSimpleName());
        }
    }

    /**
     * 检查字段
     *
     * @param fieldDto
     */
    private void check(BeanDto table, FieldDto fieldDto) {
        String tableName = table.getClass().getSimpleName() + "__";
        if (fieldDto.getFieldType() == null || fieldDto.getEntityClz() == null) {
            error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "__" + fieldDto.getFieldName() + "找不到实体类和字段");
            return;
        }
        if (fieldDto.getFieldType().equals(VCT.ITEM_TYPE.BASIC)) {
            if (fieldDto.getEntityFieldName() == null || fieldDto.getQueryPath() == null) {
                error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "__" + fieldDto.getFieldName() + "没有找到匹配的字段");
                return;
            }
        } else {
            if (fieldDto.getQueryPath() == null || fieldDto.queryPathName() == null) {
                error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "__" + fieldDto.getFieldName() + "的查询路径没有找到，请先检查类型设置是否准确");
                return;
            }
            if (IdBean.class.isAssignableFrom(fieldDto.getClz()) && fieldDto.queryPathName().indexOf("_") != -1) {
                String queryName = fieldDto.queryPathName();
                int _size = queryName.split("_").length - 1;
                int __length = queryName.split("__").length - 1;
                String fieldType = fieldDto.getFieldType();
                if (_size == __length * 2) {
                    if (VCT.ITEM_TYPE.LIST.equals(fieldType)) {
                        error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段应该为object");
                    }
                } else if (!VCT.ITEM_TYPE.LIST.equals(fieldType)) {
                    error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段应该为list");
                }
            }
        }
    }

    private void errInfo(List<? extends BeanDto>... beanDtos) {
        for (List<? extends BeanDto> list : beanDtos) {
            for (BeanDto entityDto : list) {
                if (entityDto instanceof ReqVoDto) {
                    check((ReqVoDto) entityDto);
                }
                List<FieldDto> list2 = entityDto.getFields();
                if (list2 != null) {
                    for (FieldDto dto1 : list2) {
                        check(entityDto, dto1);
                    }
                }
            }
        }
    }
}
