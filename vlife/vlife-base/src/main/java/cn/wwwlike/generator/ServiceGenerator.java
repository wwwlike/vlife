package cn.wwwlike.generator;

import cn.wwwlike.form.IForm;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.lang.model.element.Modifier;

public class ServiceGenerator extends ICrudCodeCreate {

    public ServiceGenerator(String packageName, IForm formVo) {
        super(packageName, formVo);
    }
    public ServiceGenerator(String packageName, IForm formVo,String targetDirectory) {
        super(packageName, formVo,targetDirectory);
    }

    @Override
    public void create() {
        String entityName= StringUtils.capitalize(formVo.getType());
        String daoPackageName = packageName+ ".dao";
        String servicePackageName =  packageName+ ".service";
        String entityPackageName =  packageName+ ".entity";
//        String daoClzName = daoPackageName + "." + entityName + "Dao";
//        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        ClassName entityClz = ClassName.get(entityPackageName, entityName);
        ClassName daoName = ClassName.get(daoPackageName, entityName + "Dao");
        ParameterizedTypeName superClazz = ParameterizedTypeName.get(ClassName.get("cn.wwwlike.common", "BaseService"),entityClz,daoName);
        TypeSpec service = TypeSpec.classBuilder(entityName+ "Service")
                .addModifiers(Modifier.PUBLIC)
                .addAnnotation(Service.class)
                .superclass(superClazz)
                .build();
        JavaFile javaFile= JavaFile.builder(servicePackageName, service).addFileComment(fileComment())
                .build();
        try {
            generateJavaFIle(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}