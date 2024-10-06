package cn.wwwlike.generator;

import cn.wwwlike.form.IField;
import cn.wwwlike.form.IForm;
import com.squareup.javapoet.*;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import javax.lang.model.element.Modifier;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;


public class EntityGenerator extends ICrudCodeCreate {
    public EntityGenerator(String packageName, IForm formVo) {
        super(packageName, formVo);
    }

    public EntityGenerator(String packageName, IForm formVo,String targetDirectory) {
        super(packageName, formVo,targetDirectory);
    }

    private Class getJavaTypeClass(String javaType){
        Class javaTypeClazz=null;
        if(javaType.equals("string")||javaType.equals("text")){
            javaTypeClazz=String.class;
        }else if (javaType.equals("double")){
            javaTypeClazz=Double.class;
        }else if (javaType.equals("long")){
            javaTypeClazz=Long.class;
        }else if (javaType.equals("date")){
            javaTypeClazz= Date.class;
        }else if (javaType.equals("boolean")){
            javaTypeClazz=boolean.class;
        }
        return javaTypeClazz;
    }


    @Override
    public void create() {
        String[] sysFields={"id","status","modifyDate","modifyId","createId","createDate"};
//        ParameterizedTypeName superClzAndGenic = (ParameterizedTypeName) ParameterizedTypeName.get(DbEntity.class);
        List<FieldSpec> fieldSpecs = new ArrayList<>();
        List<MethodSpec> getMethodSpecs = new ArrayList<>();

        //添加字段
        formVo.getFields().forEach(f->{
            if(Arrays.stream(sysFields).filter(sysField->sysField.equals(f.getFieldName())).count()==0){
                Class javaTypeClazz=getJavaTypeClass(f.getJavaType());
                FieldSpec.Builder _f = FieldSpec.builder(javaTypeClazz,f.getFieldName())
                        .addModifiers(Modifier.PUBLIC).addJavadoc(f.getTitle());
                fieldSpecs.add(_f.build());
            }
        });
        //添加get方法，有长度的给长度
        formVo.getFields().forEach(f->{
            if(Arrays.stream(sysFields).filter(sysField->sysField.equals(f.getFieldName())).count()==0) {
                getMethodSpecs.add(getMethodSpec(f).build());
            }
        });
        TypeSpec.Builder builder = TypeSpec.classBuilder(StringUtils.capitalize(formVo.getType()))
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(formVo.getName())
                .addAnnotation(Entity.class)
                 .addAnnotation(Setter.class)
                .addAnnotation(Table.class)
                .addFields(fieldSpecs)
                .superclass(DbEntity.class)
                .addMethods(getMethodSpecs);

        if(this.formVo.getOrders()!=null){
            AnnotationSpec.Builder vClazzAnnotation = AnnotationSpec.builder(VClazz.class);
            vClazzAnnotation.addMember("orders", "\""+this.formVo.getOrders()+"\"");
            builder.addAnnotation(vClazzAnnotation.build());
        }


        JavaFile javaFile = JavaFile.builder(getPackageName()+".entity", builder.build()).build();
        try {
            generateJavaFIle(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    //get方法
    private MethodSpec.Builder getMethodSpec(IField field) {
        String fieldName=field.getFieldName();
        String javaType=field.getJavaType();
        Class type=getJavaTypeClass(javaType);
        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder("get"+StringUtils.capitalize(fieldName))
                .addModifiers(Modifier.PUBLIC)
                .returns(type)
                .addStatement("return this.$L", fieldName);
        if(javaType.equals("string")&&field.getDbLength()>0){
            AnnotationSpec.Builder column = AnnotationSpec.builder(Column.class);
            column.addMember("length",field.getDbLength()+"");
            methodSpec.addAnnotation(column.build());
        }else if(javaType.equals("text")){
            AnnotationSpec.Builder column = AnnotationSpec.builder(Column.class);
            column.addMember("columnDefinition","\"text\"");
            methodSpec.addAnnotation(column.build());
        }

        return methodSpec;
    }
}