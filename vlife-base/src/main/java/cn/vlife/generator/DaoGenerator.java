package cn.vlife.generator;

import cn.vlife.common.IForm;
import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.ParameterizedTypeName;
import com.squareup.javapoet.TypeSpec;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import javax.lang.model.element.Modifier;
import java.io.File;

public class DaoGenerator extends ICrudCodeCreate {


    public DaoGenerator(String packageName, IForm entityModel, String targetDirectory) {
        super(packageName, entityModel,targetDirectory);
    }
    @Override
    public File create() {
        String entityName= StringUtils.capitalize(entityModel.getType());
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        ParameterizedTypeName clzAndGenic = ParameterizedTypeName.get(ClassName.get("cn.wwwlike.vlife.core.dsl", "DslDao"),entity);
        TypeSpec user = TypeSpec.classBuilder(entityName + "Dao")
                .addModifiers(Modifier.PUBLIC)
                .addAnnotation(Repository.class)
//                                .addAnnotation(Service.class)
                .superclass(clzAndGenic)
                .build();

        JavaFile javaFile= JavaFile.builder(packageName+".dao", user).addFileComment(fileComment())
                .build();
        try {
           return generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}