package cn.vlife.generator;

import cn.vlife.common.IField;
import cn.vlife.common.IForm;
import com.querydsl.core.types.PathMetadata;
import com.querydsl.core.types.PathMetadataFactory;
import com.querydsl.core.types.dsl.*;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.Generated;
import javax.lang.model.element.Modifier;
import java.io.File;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class DslEntityGenerator extends ICrudCodeCreate {

    public DslEntityGenerator(String packageName, IForm entityModel, String targetDirectory) {
        super(packageName, entityModel,targetDirectory);
    }

    @Override
    public File create() {

        List<FieldSpec> fieldSpecs = new ArrayList<>();
        List<? extends IField> allField=entityModel.getFields();
        allField.forEach(f->{
            fieldSpecs.add( createField(f.getFieldName(),f.getJavaType()));
        });
        List<String> fieldNames=allField.stream().map(f->f.getFieldName()).collect(Collectors.toList());
        if(!fieldNames.contains("id")){
            fieldSpecs.add( createField("id","java.lang.String"));
        }
        if(!fieldNames.contains("createDate")){
            fieldSpecs.add( createField("createDate","java.util.Date"));
        }
        if(!fieldNames.contains("modifyDate")){
            fieldSpecs.add( createField("modifyDate","java.util.Date"));
        }
        if(!fieldNames.contains("createId")){
            fieldSpecs.add( createField("createId","java.lang.String"));
        }
        if(!fieldNames.contains("modifyId")){
            fieldSpecs.add( createField("modifyId","java.lang.String"));
        }
        if(!fieldNames.contains("status")){
            fieldSpecs.add( createField("status","java.lang.String"));
        }
        if(!fieldNames.contains("createDeptcode")){
            fieldSpecs.add( createField("createDeptcode","java.lang.String"));
        }
        AnnotationSpec.Builder generated = AnnotationSpec.builder(Generated.class);
        generated.addMember("value","\"com.querydsl.codegen.EntitySerializer\"");
        String entityName= StringUtils.capitalize(entityModel.getType());

        String thisClassName="Q"+entityName;
        List<MethodSpec> methodSpecs=new ArrayList<>();
        methodSpecs.add(methodSpec1());
        methodSpecs.add(methodSpec2());
        methodSpecs.add(methodSpec3());
        ClassName entity = ClassName.bestGuess(entityModel.getTypeClass());
        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(ClassName.get(EntityPathBase.class),entity);
        ClassName qEntityClassName = ClassName.get(entityModel.getTypeClass().replace("."+entityName,""), thisClassName); // Q类的名称
        ClassName dbEntityClassName = ClassName.bestGuess("cn.wwwlike.vlife.bean.QDbEntity");
        // 创建静态字段
        FieldSpec entityField = FieldSpec.builder(qEntityClassName,StringUtils.uncapitalize( entityName), Modifier.PUBLIC, Modifier.STATIC, Modifier.FINAL)
                .initializer("new $T(\""+StringUtils.uncapitalize( entityName)+"\")", qEntityClassName)
                .build();
        // 添加固定字段 _super
        FieldSpec superField = FieldSpec.builder(dbEntityClassName, "_super", Modifier.PUBLIC, Modifier.FINAL)
                .initializer("new QDbEntity(this)")
                .build();
        // 随机生成一个正的 serialVersionUID，限制在0到10^10之间
        long serialVersionUID = Math.abs(new SecureRandom().nextLong() % 10000000000L); // 保留合理范围

        // 添加固定的 serialVersionUID 字段
        FieldSpec serialVersionUIDField = FieldSpec.builder(long.class, "serialVersionUID", Modifier.PRIVATE, Modifier.STATIC, Modifier.FINAL)
                .initializer("$L", serialVersionUID + "L") // 确保加上 L 后缀
                .build();


        TypeSpec dls = TypeSpec.classBuilder(thisClassName)
                .addModifiers(Modifier.PUBLIC)
                .addAnnotation(generated.build())
                .addField(serialVersionUIDField)
                .addField(entityField)
                .addField(superField)
                .addFields(fieldSpecs)
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)
                .build();
        JavaFile javaFile = JavaFile.builder(getPackageName()+".entity", dls)
                .addStaticImport(PathMetadataFactory.class, "forVariable").addFileComment(fileComment()).build();


        try {
           return generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }


    // 创建字符串类型的 FieldSpec
    private static FieldSpec createField(String name,String javaType) {
        Class javaClazz=getJavaTypeClass(javaType);
       if("text".equals(javaType)||javaClazz==String.class){
           return FieldSpec.builder(StringPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createString($S)", name)
                   .build();
       }else  if(javaClazz==int.class||javaClazz==Integer.class||javaType.equals("int")||javaType.equals("integer")){
           return FieldSpec.builder(NumberPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createNumber($S, $T.class)", name, Integer.class)
                   .build();
       }else  if(javaClazz==double.class||javaClazz==Double.class||javaType.equals("double")){
           return FieldSpec.builder(NumberPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createNumber($S, $T.class)", name, Double.class)
                   .build();
       }else  if(javaClazz==long.class||javaClazz==Long.class||javaType.equals("long")){
           return FieldSpec.builder(NumberPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createNumber($S, $T.class)", name, Long.class)
                   .build();
       } else  if(javaClazz== Date.class||javaType.equals("date")){
           return FieldSpec.builder(DateTimePath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createDateTime($S, $T.class)", name, Date.class)
                   .build();
       }else  if(javaClazz==Boolean.class||javaClazz==boolean.class||javaType.equals("boolean")){
           return FieldSpec.builder(BooleanPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createBoolean($S)", name)
                   .build();
       }
        return null;
    }


    //构造方法1
    private MethodSpec methodSpec1() {
        String variableName = "variable"; // 您可以根据实际需要修改这个参数名
        ClassName entityClassName = ClassName.bestGuess(entityModel.getTypeClass());
        MethodSpec constructor = MethodSpec.constructorBuilder()
                .addModifiers(Modifier.PUBLIC)
                .addParameter(String.class, variableName)
                .addStatement("super($T.class, forVariable($L))", entityClassName, variableName)
                .build();
        return constructor;
    }

    //构造方法2
    private MethodSpec methodSpec2() {
        String variableName = "metadata"; // 您可以根据实际需要修改这个参数名
        ClassName entityClassName =ClassName.bestGuess(entityModel.getTypeClass());
        MethodSpec constructor = MethodSpec.constructorBuilder()
                .addModifiers(Modifier.PUBLIC)
                .addParameter(PathMetadata.class, variableName)
               .addStatement("super($T.class, $L)", entityClassName, variableName)
                .build();
        return constructor;
    }

    //构造方法3
    private MethodSpec methodSpec3() {
        String variableName = "path";
        ClassName entityClassName = ClassName.bestGuess(entityModel.getTypeClass());
        ClassName pathClassName = ClassName.get("com.querydsl.core.types", "Path");
        // 创建构造方法
        MethodSpec constructor = MethodSpec.constructorBuilder()
                .addModifiers(Modifier.PUBLIC)
                .addParameter(ParameterSpec.builder(
                                ParameterizedTypeName.get(pathClassName, WildcardTypeName.subtypeOf(entityClassName)),
                                variableName)
                        .build())
                .addStatement("super($L.getType(), $L.getMetadata())", variableName, variableName)
                .build();

        return constructor;
    }
}


