package cn.vlife.generator;

import cn.vlife.common.IForm;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.element.Modifier;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class ApiGenerator extends ICrudCodeCreate {


    public ApiGenerator(String packageName, IForm entity, String targetDirectory) {
        super(packageName, entity,targetDirectory);
    }

    @Override
    public File create() {
        String entityName= StringUtils.capitalize(entityModel.getType());
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        AnnotationSpec.Builder anBuilder = AnnotationSpec.builder(RequestMapping.class)
                .addMember("value", "\"/" + StringUtils.uncapitalize(entityName) + "\"");
        ClassName entityClz = ClassName.get(packageName+".entity", entityName);
        ClassName serviceName = ClassName.get(packageName+".service", entityName + "Service");
        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(ClassName.get("cn.wwwlike.common", "VLifeApi"),entityClz,serviceName);
        List<MethodSpec> methodSpecs = new ArrayList<>();
        TypeSpec apiClazz = TypeSpec.classBuilder(entityName + "Api")
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(entityModel.getTitle()+"接口")
                .addAnnotation(RestController.class)
                .addAnnotation(anBuilder.build())
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)
                .build();
        JavaFile javaFile = JavaFile.builder(packageName+".api", apiClazz).addFileComment(
                        "Entity和DTO模型均对应生成一个接口类,研发可以在该类上进行二次开发"+
                fileComment()).build();
        try {
            return generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }


    /**
     * 实体类查询
     */
    private MethodSpec page(IForm  result,String entityName) {
        String methodName = "page";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.add("列表");
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(PostMapping.class);
        methodAnnotation.addMember("value", "\"/" + methodName + "\"");
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        ParameterizedTypeName returnGenic = ParameterizedTypeName.get(ClassName.get(PageVo.class), entity);
        ParameterizedTypeName reqGenic = ParameterizedTypeName.get(ClassName.get(PageQuery.class), entity);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(reqGenic, "req");
        AnnotationSpec.Builder requestBody = AnnotationSpec.builder(RequestBody.class);
        inSpec.addAnnotation(requestBody.build());
        methodSpec.addStatement("return service.findPage(req)");
        methodSpec.returns(returnGenic)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }


    /**
     * 批量删除
     */
    public MethodSpec remove(IForm result,String entityName) {
        String methodName = "remove";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.add("删除");
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(DeleteMapping.class);
        methodAnnotation.addMember("value", "\"/remove\"");
        TypeName returnType = TypeName.get(Long.class);
        methodSpec.addStatement("return service.remove(ids)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(RequestBody.class);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(String[].class, "ids");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnType)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }

    /**
     * 根据条件查询详情
     */
    public MethodSpec list(IForm result,String entityName) {
        String methodName = "list";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.addStatement(result.getTitle()+"数据");
        methodComment.addStatement("用于与前端组件数据绑定");
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(PostMapping.class);
        methodAnnotation.addMember("value", "\"/list\"");
        AnnotationSpec vMethodAnnotation = AnnotationSpec.builder(VMethod.class)
                .addMember("permission", "$T.noAuth", PermissionEnum.class) // 设置权限
                .build();
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        ParameterizedTypeName returnGenic = ParameterizedTypeName.get(ClassName.get(List.class), entity);
        methodSpec.addStatement("return service.find(req)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(RequestBody.class);
        ParameterizedTypeName reqGenic = ParameterizedTypeName.get(ClassName.get(VlifeQuery.class), entity);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(reqGenic, "req");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnGenic)
                .addParameter(inSpec.build())
                .addJavadoc(result.getTitle()+"数据\n")
                .addJavadoc("用于与前端组件数据绑定\n")
                .addAnnotation(methodAnnotation.build())
                .addAnnotation(vMethodAnnotation);
        return methodSpec.build();
    }

    /**
     * 根据Id查询关联详情
     */
    public MethodSpec detail(IForm result,String entityName) {
        String methodName = "detail";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.add("详情");
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(GetMapping.class);
        methodAnnotation.addMember("value", "\"/detail\"");
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        ParameterizedTypeName returnGenic = ParameterizedTypeName.get(ClassName.get(List.class), entity);
        methodSpec.addStatement("return service.findByIds(ids)");
        AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(RequestParam.class);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(String[].class, "ids");
        inSpec.addAnnotation(pathAnnotation.build());
        methodSpec.returns(returnGenic)
                .addParameter(inSpec.build())
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }

    /**
     * 数据保存
     */
    public MethodSpec save(IForm result,String entityName) {
        String methodName = "save";
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.add("保存");
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(PostMapping.class);
        methodAnnotation.addMember("value", "\"/save\"");
        ClassName entityClz = ClassName.get(packageName+".entity", entityName);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(entityClz, "entity");
        AnnotationSpec.Builder requestBody = AnnotationSpec.builder(RequestBody.class);
        inSpec.addAnnotation(requestBody.build());
        methodSpec.addStatement("return service.save(entity)");
        methodSpec.addParameter(inSpec.build())
                .returns(entityClz)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }


    /**
     * dto数据保存
     */
    public MethodSpec saveDto(IForm result,String dtoName) {
        String methodName = "save"+dtoName;
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.add(result.getTitle()+"保存");
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(PostMapping.class);
        methodAnnotation.addMember("value", "\"/save/"+result.getType()+"\"");
        ClassName dtoClz = ClassName.get(packageName+".dto", dtoName);
        ParameterSpec.Builder inSpec = ParameterSpec.builder(dtoClz, "dto");
        AnnotationSpec.Builder requestBody = AnnotationSpec.builder(RequestBody.class);
        inSpec.addAnnotation(requestBody.build());
        methodSpec.addStatement("return service.save(dto)");
        methodSpec.addParameter(inSpec.build())
                .returns(dtoClz)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());
        return methodSpec.build();
    }


}
