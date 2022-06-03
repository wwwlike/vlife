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
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.IPage;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.objship.dto.*;
import cn.wwwlike.vlife.query.req.PageQuery;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.element.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * API生成器
 */
public class GeneratorApi {

    /**
     * api生成
     *
     * @param itemDto
     * @param vos
     * @param reqs
     * @param saves
     */
    public void apiGenerator(EntityDto itemDto, List<VoDto> vos, List<ReqDto> reqs, List<SaveDto> saves) {

        Class item = itemDto.getClz();
        List<VoDto> voDtos = vos.stream().filter(vo -> {
            return vo.getEntityClz() == item;
        }).collect(Collectors.toList());


        List<ReqDto> pageReqDtos = reqs.stream().filter(req -> {
            return req.getEntityClz() == item && PageQuery.class.isAssignableFrom(req.getClz());
        }).collect(Collectors.toList());


        List<ReqDto> listReqDtos = reqs.stream().filter(req -> {
            return req.getEntityClz() == item && !PageQuery.class.isAssignableFrom(req.getClz());
        }).collect(Collectors.toList());


        List<SaveDto> saveDtos = saves.stream().filter(save -> {
            return save.getEntityClz() == item;
        }).collect(Collectors.toList());

        String packageName = item.getPackage().getName();
        int index = packageName.lastIndexOf("entity");
        String servicePackageName = packageName.substring(0, index) + "service";
        String apiPackageName = packageName.substring(0, index) + "api";
        ClassName superClazz = ClassName.get(VLifeApi.class);
        TypeName itemName = TypeName.get(item);

        ClassName serviceName = ClassName.get(servicePackageName, item.getSimpleName() + "Service");

        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(superClazz, itemName, serviceName);

        AnnotationSpec.Builder anBuilder = AnnotationSpec.builder(RequestMapping.class)
                .addMember("value", "\"/" + StringUtils.uncapitalize(item.getSimpleName()) + "\"");

        CodeBlock.Builder classComment = CodeBlock.builder();
        classComment.addStatement(itemDto.getTitle() + "接口");

        List<MethodSpec> methodSpecs = new ArrayList<>();

        voDtos.stream().filter(reqDto -> {
            return reqDto.getType().indexOf("Page") != -1 || reqDto.getType().indexOf("page") != -1;
        }).forEach(dto -> {
            methodSpecs.add(page(dto, pageReqDtos));
        });

        if (methodSpecs.size() == 0) {
            methodSpecs.add(page(itemDto, pageReqDtos));
        }

        List<VoDto> dtos = voDtos.stream().filter(reqDto -> {
            return reqDto.getType().indexOf("Detail") != -1 || reqDto.getType().indexOf("detail") != -1;
        }).collect(Collectors.toList());
        if (dtos.size() > 0) {
            dtos.stream().forEach(dto -> {
                methodSpecs.add(detail(dto));
            });
        } else {
            methodSpecs.add(detail(itemDto));
        }

        voDtos.stream().filter(voDto -> {
            return voDto.getType().indexOf("List") != -1;
        }).forEach(dto -> {
            methodSpecs.add(list(dto, listReqDtos));
        });

        if (saveDtos == null || saveDtos.size() == 0) {
            methodSpecs.add(save(itemDto));
        } else {
            saveDtos.stream().forEach(saveDto -> {
                methodSpecs.add(save(saveDto));
            });
        }

        methodSpecs.add(delete(itemDto));


        TypeSpec apiClazz = TypeSpec.classBuilder(item.getSimpleName() + "Api")
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(classComment.build())
                .addAnnotation(RestController.class)
                .addAnnotation(anBuilder.build())
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)

                .build();
        JavaFile javaFile = JavaFile.builder(apiPackageName, apiClazz).build();
        try {
            FileUtil.generateJavaFIle(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * 实体类分页查询
     * 方法名称以Page结尾
     */
    public MethodSpec page(VoDto result, List<ReqDto> req) {

        String methodName = calcMethodName(result, result.getEntityClz(), "Page");
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(result.getTitle() + "分页查询");
        methodComment.addStatement("@param req 查询条件");
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"" + path(methodName) + "\"");
        TypeName returnTypeName = TypeName.get(result.getClz());
        ParameterizedTypeName returnGenic = ParameterizedTypeName.get(ClassName.get(PageVo.class), returnTypeName);
        if (req.size() > 0) {
            Class<? extends BaseRequest> queryReq = req.get(0).getClz();
            ParameterSpec.Builder inSpec = ParameterSpec.builder(queryReq, "req");
            methodSpec.addParameter(inSpec.build());
        } else {
            TypeName methodReq = TypeName.get(result.getEntityClz());
            ParameterizedTypeName reqGenic = ParameterizedTypeName.get(ClassName.get(PageQuery.class), methodReq);
            methodSpec.addStatement("$T req= new $T(" + result.getEntityClz().getSimpleName() + ".class)", reqGenic, reqGenic);

        }
        methodSpec.addStatement("return service.queryPage(" + result.getClz().getSimpleName() + ".class,req)");
        methodSpec.returns(returnGenic)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());

        return methodSpec.build();

    }

    ;

    /**
     * 实体类查询
     */
    public MethodSpec page(EntityDto result, List<ReqDto> req) {

        String methodName = "page";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(result.getTitle() + "分页查询");
        if (req != null && req.size() > 0)
            methodComment.addStatement("@param req 查询条件");
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"/" + methodName + "\"");
        TypeName returnTypeName = TypeName.get(result.getClz());
        ParameterizedTypeName returnGenic = ParameterizedTypeName.get(ClassName.get(PageVo.class), returnTypeName);
        if (req.size() > 0) {
            Class<? extends BaseRequest> queryReq = req.get(0).getClz();
            ParameterSpec.Builder inSpec = ParameterSpec.builder(queryReq, "req");
            methodSpec.addParameter(inSpec.build());
        } else {

            TypeName methodReq = TypeName.get(result.getClz());
            ParameterizedTypeName reqGenic = ParameterizedTypeName.get(ClassName.get(PageQuery.class), methodReq);
            methodSpec.addStatement("$T req= new $T(" + result.getClz().getSimpleName() + ".class)", reqGenic, reqGenic);
        }
        methodSpec.addStatement("return service.findPage(req)");
        methodSpec.returns(returnGenic)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());

        return methodSpec.build();
    }


    /**
     * 实体类查询 根据ID查询
     */
    public MethodSpec detail(VoDto itemDto) {

        String methodName = calcMethodName(itemDto, itemDto.getEntityClz(), "Detail");
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(itemDto.getTitle() + "明细查询");
        methodComment.addStatement("@param id 查询id");
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"" + path(methodName) + "/{id}\"");
        TypeName returnType = TypeName.get(itemDto.getClz());

        methodSpec.addStatement("return service.queryOne(" + itemDto.getClz().getSimpleName() + ".class,id)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(PathVariable.class);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(String.class, "id");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnType)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();

    }

    ;

    /**
     * 实体类查询 根据ID查询
     */
    public MethodSpec detail(EntityDto itemDto) {

        String methodName = "detail";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(itemDto.getTitle() + "明细查询");
        methodComment.addStatement("@param id 查询id");
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"" + path(methodName) + "/{id}\"");
        TypeName returnType = TypeName.get(itemDto.getClz());
        methodSpec.addStatement("return service.findOne(id)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(PathVariable.class);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(String.class, "id");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnType)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();

    }

    ;


    /**
     * 实体类查询 根据ID查询
     */
    public MethodSpec report(EntityDto itemDto) {

        String methodName = "detail";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(itemDto.getTitle() + "明细查询");
        methodComment.addStatement("@param id 查询id");
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"" + path(methodName) + "/{id}\"");
        TypeName returnType = TypeName.get(itemDto.getClz());
        methodSpec.addStatement("return service.findOne(id)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(PathVariable.class);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(String.class, "id");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnType)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();

    }

    ;


    /**
     * list查询
     * vo名称包含才用list方法
     */
    public MethodSpec list(VoDto result, List<ReqDto> reqs) {

        List<ReqDto> notPageReq = reqs.stream().filter(req -> !IPage.class.isAssignableFrom(req.getClz())).collect(Collectors.toList());

        String methodName = calcMethodName(result, result.getEntityClz(), "List");
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(result.getTitle() + "列表查询");
        if (notPageReq != null && notPageReq.size() > 0) {
            methodComment.addStatement("@param req 查询条件");
        }
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"" + path(methodName) + "\"");
        TypeName returnTypeName = TypeName.get(result.getClz());
        ParameterizedTypeName returnGenic = ParameterizedTypeName.get(ClassName.get(List.class), returnTypeName);
        if (notPageReq.size() > 0) {
            Class<? extends BaseRequest> queryReq = notPageReq.get(0).getClz();
            ParameterSpec.Builder inSpec = ParameterSpec.builder(queryReq, "req");
            methodSpec.addParameter(inSpec.build());
        } else {
            TypeName methodReq = TypeName.get(result.getEntityClz());
            ParameterizedTypeName reqGenic = ParameterizedTypeName.get(ClassName.get(PageQuery.class), methodReq);
            methodSpec.addStatement("$T req= new $T()", reqGenic, reqGenic);

        }
        methodSpec.addStatement("return service.query(" + result.getClz().getSimpleName() + ".class,req)");
        methodSpec.returns(returnGenic)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }

    ;

    /**
     * 数据保存
     */
    public MethodSpec save(SaveDto saveDto) {

        String methodName = calcMethodName(saveDto, saveDto.getEntityClz(), "Save");
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(saveDto.getTitle() + "保存");
        methodComment.addStatement("@param dto " + saveDto.getTitle());
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(PostMapping.class);
        methodAnnotation.addMember("value", "\"" + path(methodName) + "\"");
        TypeName returnTypeName = TypeName.get(saveDto.getClz());


        ParameterSpec.Builder inSpec = ParameterSpec.builder(returnTypeName, "dto");
        AnnotationSpec.Builder requestBody = AnnotationSpec.builder(RequestBody.class);
        inSpec.addAnnotation(requestBody.build());
        methodSpec.addStatement("return service.save(dto)")
                .returns(returnTypeName)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }

    /**
     * 数据保存
     */
    public MethodSpec save(EntityDto itemDto) {

        String methodName = "save";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(itemDto.getTitle() + "保存");
        methodComment.addStatement("@param entity " + itemDto.getTitle());
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(PostMapping.class);
        methodAnnotation.addMember("value", "\"/save\"");
        TypeName returnTypeName = TypeName.get(itemDto.getClz());
        ParameterSpec.Builder inSpec = ParameterSpec.builder(returnTypeName, "entity");
        AnnotationSpec.Builder requestBody = AnnotationSpec.builder(RequestBody.class);
        inSpec.addAnnotation(requestBody.build());
        methodSpec.addStatement("return service.save(entity)");
        methodSpec.addParameter(inSpec.build())
                .returns(returnTypeName)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }

    ;

    /**
     * 数据删除
     */
    public MethodSpec delete(EntityDto itemDto) {

        String methodName = "delete";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);

        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(itemDto.getTitle() + "删除");
        methodComment.addStatement("@param id 主键id");
        methodComment.addStatement("@return");

        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(DeleteMapping.class);
        methodAnnotation.addMember("value", "\"/delete/{id}\"");
        TypeName returnType = TypeName.get(Long.class);
        methodSpec.addStatement("return service.remove(id)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(PathVariable.class);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(String.class, "id");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnType)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }

    ;

    /**
     * 计算【规则和约定】API的方法名称
     *
     * @param dto     计算name的dto
     * @param itemClz
     * @param type
     * @return
     */
    private String calcMethodName(BeanDto dto, Class itemClz, String type) {
        String beanClzName = dto.getClz().getSimpleName();
        beanClzName = beanClzName.replaceFirst("Vo", "");
        beanClzName = beanClzName.replaceFirst("Dto", "");
        beanClzName = beanClzName.replaceFirst(itemClz.getSimpleName(), "");
        if (beanClzName.endsWith(type) || beanClzName.endsWith(StringUtils.uncapitalize(type))) {
            beanClzName = beanClzName.substring(0, beanClzName.length() - type.length());
        }
        return StringUtils.uncapitalize(type) + beanClzName;
    }

    /**
     * annotation上的接口路径处理
     *
     * @param methodName
     * @return
     */
    private String path(String methodName) {
        if (methodName.startsWith("page") && !methodName.equals("page")) {
            return "/page/" + StringUtils.uncapitalize(methodName.substring(4));
        }
        if (methodName.startsWith("list") && !methodName.equals("list")) {
            return "/list/" + StringUtils.uncapitalize(methodName.substring(4));
        }
        if (methodName.startsWith("detail") && !methodName.equals("detail")) {
            return "/detail/" + StringUtils.uncapitalize(methodName.substring(6));
        }
        if (methodName.startsWith("save") && !methodName.equals("save")) {
            return "/save/" + StringUtils.uncapitalize(methodName.substring(4));
        }

        return "/" + methodName;
    }


}
