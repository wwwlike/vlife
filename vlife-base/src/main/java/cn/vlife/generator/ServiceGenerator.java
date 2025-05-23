package cn.vlife.generator;

import cn.vlife.common.IForm;
import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.ParameterizedTypeName;
import com.squareup.javapoet.TypeSpec;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.lang.model.element.Modifier;
import java.io.File;

public class ServiceGenerator extends ICrudCodeCreate {

    public ServiceGenerator(String packageName, IForm entityModel, String targetDirectory) {
        super(packageName, entityModel,targetDirectory);
    }

    @Override
    public File create() {
        String entityName= StringUtils.capitalize(entityModel.getType());
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
            return generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}