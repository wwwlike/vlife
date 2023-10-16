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

import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.IPage;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.core.dsl.DslDao;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.utils.GenericsUtils;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.lang.model.element.Modifier;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 类关系字典,避免重复嵌套
 */
public class GeneratorClzPath {

    /**
     * 生成到当前module的源文件目录下
     *
     * @param javaFile
     * @throws IOException
     */
    private static void generateToCurrentAndroidStudioModule(JavaFile javaFile) throws IOException {
        String targetDirectory = "src/main/java";
        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        javaFile.writeTo(dir);
    }

    public void generator(List<EntityDto> entitys, List<VoDto> vos, List<ReqDto> res) {
        List<Class<? extends Item>> entityList = entitys.stream().map(entityDto -> {
            return entityDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends VoBean>> voList = vos.stream().map(voDto -> {
            return voDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends BaseRequest>> reqList = res.stream().map(resDto -> {
            return resDto.getClz();
        }).collect(Collectors.toList());

        daoGenerator(entityList);
        serviceGenerator(entityList);
        apiGenerator(entityList, voList, reqList);


    }

    /**
     * service生成
     *
     * @param items
     */
    public void apiGenerator(List<Class<? extends Item>> items, List<Class<? extends VoBean>> vos, List<Class<? extends BaseRequest>> reqs) {
        for (Class item : items) {
            List<Class<? extends VoBean>> item_vos = vos.stream().filter(vo -> {
                if (GenericsUtils.getGenericType(vo) == item || GenericsUtils.getSuperClassGenricType(vo) == item) {
                    return true;
                }
                return false;
            }).collect(Collectors.toList());

            List<Class<? extends BaseRequest>> item_reqs = reqs.stream().filter(req -> {
                if (GenericsUtils.getGenericType(req) == item || GenericsUtils.getSuperClassGenricType(req) == item) {
                    return true;
                }
                return false;
            }).collect(Collectors.toList());

            if (item_vos.size() == 0) {
                item_vos.add(item);
            }


            String packageName = item.getPackage().getName();
            int index = packageName.lastIndexOf("entity");
            String servicePackageName = packageName.substring(0, index) + "service";
            String apiPackageName = packageName.substring(0, index) + "api";
            try {
                ClassName superClazz = ClassName.get(VLifeApi.class);
                TypeName itemName = TypeName.get(item);

                ClassName serviceName = ClassName.get(servicePackageName, item.getSimpleName() + "Service");

                ParameterizedTypeName clzAndGenic = ParameterizedTypeName.get(superClazz, itemName, serviceName);

                AnnotationSpec.Builder anBuilder = AnnotationSpec.builder(RequestMapping.class)
                        .addMember("value", "\"/" + StringUtils.uncapitalize(item.getSimpleName()) + "\"");

                List<MethodSpec> methodSpecs = new ArrayList<>();


                for (Class vo : item_vos) {
                    String methodPath = vo.getSimpleName();
                    int i = methodPath.indexOf(item.getSimpleName());
                    if (i != -1) {
                        methodPath = methodPath.substring(item.getSimpleName().length());
                    }

                    MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(vo.getSimpleName())
                            .addModifiers(Modifier.PUBLIC);

                    TypeName rrName = TypeName.get(vo);
                    ParameterizedTypeName returnGenic = null;
                    ParameterSpec.Builder inSpec = null;
                    AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
                    if (vo.getSimpleName().endsWith("List")) {
                        methodAnnotation.addMember("value", "\"/" + StringUtils.uncapitalize(methodPath) + "\"");
                        returnGenic = ParameterizedTypeName.get(ClassName.get(List.class), rrName);
                        Class<? extends BaseRequest> queryReq = null;

                        for (Class<? extends BaseRequest> req : item_reqs) {
                            queryReq = req;
                            if (!IPage.class.isAssignableFrom(req)) {
                                break;
                            }
                        }
                        if (queryReq != null) {
                            inSpec = ParameterSpec.builder(queryReq, "req");
                        }
                        methodSpec.addStatement("return service.query($T.class,req)", vo);
                    } else if (vo.getSimpleName().endsWith("Page")) {
                        methodAnnotation.addMember("value", "\"/" + StringUtils.uncapitalize(methodPath) + "\"");
                        returnGenic = ParameterizedTypeName.get(ClassName.get(PageVo.class), rrName);
                        Class<? extends BaseRequest> queryReq = null;
                        for (Class<? extends BaseRequest> req : item_reqs) {
                            if (IPage.class.isAssignableFrom(req)) {
                                queryReq = req;
                                break;
                            }
                        }
                        if (queryReq != null) {
                            inSpec = ParameterSpec.builder(queryReq, "req");
                        }
                        methodSpec.addStatement("return null");
                    } else {
                        methodAnnotation.addMember("value", "\"/" + StringUtils.uncapitalize(methodPath) + "/{id}\"");
                        inSpec = ParameterSpec.builder(TypeName.get(String.class), "id");
                        inSpec.addAnnotation(PathVariable.class);
                        methodSpec.addStatement("return null");
                    }


                    methodSpec.returns(returnGenic != null ? returnGenic : rrName)
                            .addAnnotation(methodAnnotation.build());
                    if (inSpec != null) {
                        methodSpec.addParameter(inSpec.build());
                    }

                    methodSpecs.add(methodSpec.build());
                }


                TypeSpec apiClazz = TypeSpec.classBuilder(item.getSimpleName() + "Api")
                        .addModifiers(Modifier.PUBLIC)
                        .addAnnotation(RestController.class)
                        .addAnnotation(anBuilder.build())
                        .superclass(clzAndGenic)
                        .addMethods(methodSpecs)

                        .build();

                JavaFile javaFile = JavaFile.builder(apiPackageName, apiClazz)
                        .build();


                generateToCurrentAndroidStudioModule(javaFile);

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * service生成
     *
     * @param items
     */
    public void serviceGenerator(List<Class<? extends Item>> items) {
        for (Class item : items) {
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
                generateToCurrentAndroidStudioModule(javaFile);

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
    public void daoGenerator(List<Class<? extends Item>> items) {
        for (Class item : items) {
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

                generateToCurrentAndroidStudioModule(javaFile);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
