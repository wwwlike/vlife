package cn.wwwlike.generator;

import cn.wwwlike.form.IForm;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.query.req.PageQuery;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.element.Modifier;
import java.util.ArrayList;
import java.util.List;

public class ApiGenerator extends ICrudCodeCreate {

    public ApiGenerator(String packageName, IForm formVo) {
        super(packageName, formVo);
    }

    public ApiGenerator(String packageName, IForm formVo,String targetDirectory) {
        super(packageName, formVo,targetDirectory);
    }



    @Override
    public void create() {
        String entityName= StringUtils.capitalize(formVo.getType());
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        AnnotationSpec.Builder anBuilder = AnnotationSpec.builder(RequestMapping.class)
                .addMember("value", "\"/" + StringUtils.uncapitalize(entityName) + "\"");

        ClassName entityClz = ClassName.get(packageName+".entity", entityName);
        ClassName serviceName = ClassName.get(packageName+".service", entityName + "Service");
        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(ClassName.get("cn.wwwlike.vlife.core", "VLifeApi"),entityClz,serviceName);

        //page
        //remove
        //save
        List<MethodSpec> methodSpecs = new ArrayList<>();
        methodSpecs.add(page(formVo,entityName));
        methodSpecs.add(remove(formVo,entityName));
        methodSpecs.add(detail(formVo,entityName));
        methodSpecs.add(save(formVo,entityName));
        //list是其他表外键就要增加此方法（方便select）

        TypeSpec apiClazz = TypeSpec.classBuilder(entityName + "Api")
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(formVo.getTitle()+"接口")
                .addAnnotation(RestController.class)
                .addAnnotation(anBuilder.build())
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)
                .build();
        JavaFile javaFile = JavaFile.builder(packageName+".api", apiClazz).build();
        try {
            generateJavaFIle(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
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
        methodComment.add("查询");
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
     * 详情
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



}
