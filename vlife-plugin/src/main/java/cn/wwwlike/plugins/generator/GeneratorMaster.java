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

import cn.wwwlike.plugins.utils.FileUtil;
import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.core.dsl.DslDao;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.*;
import cn.wwwlike.vlife.objship.read.*;
import com.squareup.javapoet.*;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.lang.model.element.Modifier;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * MVC层代码生成器
 */
public class GeneratorMaster extends GeneratorUtils {
    List<String> error = new ArrayList<>();

    /**
     * 插件进行调用生成代码
     *
     * @param loader
     * @param rootPackage
     */
    public void pluginInit(ClassLoader loader, String rootPackage) {
        List<String> list = ItemReadTemplate.readPackage(loader, rootPackage);
        try {


            EntityRead read = EntityRead.getPluginInstance();
            List<EntityDto> itemDtos = read.read(loader, list);
            GlobalData.save(itemDtos);

            VoRead voRead = VoRead.getInstance(itemDtos);
            List<VoDto> voDtos = voRead.read(loader, list);
            GlobalData.save(voDtos);

            ReqRead reqRead = ReqRead.getInstance(itemDtos);
            List<ReqDto> reqDtos = reqRead.read(loader, list);
            GlobalData.save(reqDtos);

            SaveRead saveRead = SaveRead.getInstance(itemDtos);
            List<SaveDto> saveDtos = saveRead.read(loader, list);
            GlobalData.save(saveDtos);

            errInfo(itemDtos, voDtos, reqDtos, saveDtos);
            GeneratorMaster generatorMaster = new GeneratorMaster();

            generatorMaster.generator(loader, itemDtos, voDtos, reqDtos, saveDtos);
            GeneratorTableDict tableDict = new GeneratorTableDict();

            tableDict.generator(itemDtos, voDtos, reqDtos);

            for (String str : error) {
                System.out.println(str);
            }
            if (error.size() == 0) {

            }
            System.out.println(error.size());
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public void generator(ClassLoader loader, List<EntityDto> entitys, List<VoDto> vos, List<ReqDto> res, List<SaveDto> saves) {
        List<Class<? extends Item>> entityList = entitys.stream().map(entityDto -> {
            return entityDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends VoBean>> voList = vos.stream().map(voDto -> {
            return voDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends BaseRequest>> reqList = res.stream().map(resDto -> {
            return resDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends SaveBean>> saveList = saves.stream().map(saveBean -> {
            return saveBean.getClz();
        }).collect(Collectors.toList());
        daoGenerator(loader, entityList);
        serviceGenerator(loader, entityList);

        apiGenerator(loader, entitys, vos, res, saves);

    }

    public void apiGenerator(ClassLoader loader, List<EntityDto> entitys, List<VoDto> vos, List<ReqDto> reqs, List<SaveDto> saves) {
        GeneratorApi generatorApi = new GeneratorApi();
        entitys.forEach(entityDto -> {
            if (!clzExist(loader, entityDto.getClz(), CLZ_TYPE.API)) {
                generatorApi.apiGenerator(entityDto, vos, reqs, saves);
            }
        });
    }

    /**
     * service生成
     * ？？？ 实体类信息读取可以生成在这里
     *
     * @param items
     */
    public void serviceGenerator(ClassLoader loader, List<Class<? extends Item>> items) {
        for (Class item : items) {
            if (clzExist(loader, item, CLZ_TYPE.SERVICE)) {
                continue;
            }
            String packageName = item.getPackage().getName();
            int index = packageName.lastIndexOf("entity");
            String daoPackageName = packageName.substring(0, index) + "dao";
            String servicePackageName = packageName.substring(0, index) + "service";
            String daoClzName = daoPackageName + "." + item.getSimpleName() + "Dao";
            try {


                ClassName superClazz = ClassName.get(VLifeService.class);

                TypeName itemName = TypeName.get(item);
                ClassName daoName = ClassName.get(daoPackageName, item.getSimpleName() + "Dao");

                ParameterizedTypeName clzAndGenic = ParameterizedTypeName.get(superClazz, itemName, daoName);
                TypeSpec user = TypeSpec.classBuilder(item.getSimpleName() + "Service")
                        .addModifiers(Modifier.PUBLIC)
                        .addAnnotation(Service.class)
                        .superclass(clzAndGenic)

                        .build();
                JavaFile javaFile = JavaFile.builder(servicePackageName, user)
                        .build();
                FileUtil.generateJavaFIle(javaFile);

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * dao生成
     *
     * @param items
     */
    public void daoGenerator(ClassLoader loader, List<Class<? extends Item>> items) {
        for (Class item : items) {
            if (clzExist(loader, item, CLZ_TYPE.DAO)) {
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
            JavaFile javaFile = JavaFile.builder(daoPackageName, user)
                    .build();
            try {

                FileUtil.generateJavaFIle(javaFile);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
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
