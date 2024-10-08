package cn.wwwlike.generator;

import cn.wwwlike.form.IForm;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import javax.lang.model.element.Modifier;

public class DaoGenerator extends ICrudCodeCreate {

    public DaoGenerator(String packageName, IForm formVo) {
        super(packageName, formVo);
    }

    public DaoGenerator(String packageName, IForm formVo,String targetDirectory) {
        super(packageName, formVo,targetDirectory);
    }
    @Override
    public void create() {
        String entityName= StringUtils.capitalize(formVo.getType());
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
            generateJavaFIle(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}