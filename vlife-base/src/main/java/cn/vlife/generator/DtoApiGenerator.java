package cn.vlife.generator;

import cn.vlife.common.IForm;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.lang.model.element.Modifier;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class DtoApiGenerator extends ICrudCodeCreate {
    public DtoApiGenerator(String packageName, IForm publihModel, IForm entity, String targetDirectory) {
        super(packageName, publihModel,entity,targetDirectory);
    }
    @Override
    public File create() {
        String typeName= StringUtils.capitalize(publihModel.getType());
        String entityName= StringUtils.capitalize(publihModel.getEntityType());
        AnnotationSpec.Builder anBuilder = AnnotationSpec.builder(RequestMapping.class)
                .addMember("value", "\"/" + StringUtils.uncapitalize(typeName) + "\"");
        ClassName typeClz = ClassName.get(packageName+".dto", typeName);
        ClassName serviceName = ClassName.get(packageName+".service", entityName + "Service");
        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(ClassName.get("cn.wwwlike.common", "VLifeApi"),typeClz,serviceName);
        List<MethodSpec> methodSpecs = new ArrayList<>();
        TypeSpec apiClazz = TypeSpec.classBuilder(typeName + "Api")
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(publihModel.getTitle()+"接口")
                .addAnnotation(RestController.class)
                .addAnnotation(anBuilder.build())
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)
                .build();
        JavaFile javaFile = JavaFile.builder(packageName+".api", apiClazz).addFileComment(fileComment()).build();
        try {
            return generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

}
