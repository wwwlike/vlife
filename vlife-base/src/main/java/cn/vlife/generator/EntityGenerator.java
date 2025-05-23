package cn.vlife.generator;

import cn.vlife.common.IField;
import cn.vlife.common.IForm;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.dict.VCT;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.javapoet.*;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import javax.lang.model.element.Modifier;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


public class EntityGenerator extends ICrudCodeCreate {

    public EntityGenerator(String packageName, IForm entityModel, String targetDirectory) {
        super(packageName, entityModel,targetDirectory);
    }



    private static CodeBlock createVClassCascadeRemove(String... removeClasses) throws ClassNotFoundException {
        // 构建 remove 属性的值
        CodeBlock.Builder codeBlockBuilder = CodeBlock.builder();
        for (int i = 0; i < removeClasses.length; i++) {
            if (i > 0) {
                codeBlockBuilder.add(", ");
            }
            Class clz=Class.forName(removeClasses[i]);
            codeBlockBuilder.add("$T.class", ClassName.get(clz));
        }
        return codeBlockBuilder.build();

    }

    @Override
    public File create() {
        String[] sysFields={"id","status","modifyDate","modifyId","createId","createDate","createDeptcode"};
        List<FieldSpec> fieldSpecs = new ArrayList<>();
        List<MethodSpec> getMethodSpecs = new ArrayList<>();

        //添加字段
        entityModel.getFields().forEach(f->{
            if(Arrays.stream(sysFields).filter(sysField->sysField.equals(f.getFieldName())).count()==0){
                Class javaTypeClazz= getJavaTypeClass(f.getJavaType());
                FieldSpec.Builder _f = FieldSpec.builder(javaTypeClazz,f.getFieldName())
                        .addModifiers(Modifier.PUBLIC).addJavadoc(f.getTitle());
                if(f.getDictCode()!=null){
                    AnnotationSpec.Builder vField = AnnotationSpec.builder(VField.class);
                    vField.addMember("dictCode", "\""+f.getDictCode()+"\"");
                    _f.addAnnotation(vField.build());
                }
                fieldSpecs.add(_f.build());
            }
        });
        //添加get方法，有长度的给长度
        entityModel.getFields().forEach(f->{
            if(Arrays.stream(sysFields).filter(sysField->sysField.equals(f.getFieldName())).count()==0) {
                getMethodSpecs.add(getMethodSpec(f).build());
            }
        });



        TypeSpec.Builder builder = TypeSpec.classBuilder(StringUtils.capitalize(entityModel.getType()))
                .addModifiers(Modifier.PUBLIC)
                .addAnnotation(Entity.class)
                 .addAnnotation(Setter.class)
                .addAnnotation(Table.class)
                .addFields(fieldSpecs)
                .superclass(DbEntity.class)
                .addMethods(getMethodSpecs);

        if(entityModel.getTitle()!=null){
            builder.addJavadoc(entityModel.getTitle());
        }
        try {
            AnnotationSpec.Builder vClazzAnnotation = AnnotationSpec.builder(VClazz.class);
            //添加排序字段
            if(this.entityModel.getOrders()!=null){
                vClazzAnnotation.addMember("orders", "\""+this.entityModel.getOrders()+"\"");
            }
            //添加级联删除实体
            if(this.entityModel.getCascadeDeleteEntityNames()!=null){
                Map<String, String> map = JSON.parseObject(this.entityModel.getCascadeDeleteEntityNames(), new TypeReference<Map<String,String>>() {});
                String[] types = {VCT.DELETE_TYPE.REMOVE, VCT.DELETE_TYPE.CLEAR, VCT.DELETE_TYPE.UNABLE};
                for (String type : types) {
                    String[] keys = map.entrySet().stream()
                            .filter(entry -> type.equals(entry.getValue()))
                            .map(Map.Entry::getKey)
                            .toArray(String[]::new);

                    if (keys.length > 0) {
                        vClazzAnnotation.addMember(type, createVClassCascadeRemove(keys));
                    }
                }
            }
            if(vClazzAnnotation.members.size()>0){
                builder.addAnnotation(vClazzAnnotation.build());
            }
            JavaFile javaFile = JavaFile.builder(getPackageName()+".entity", builder.build()).addFileComment(fileComment())
                    .addFileComment(fileComment()).build();
            return generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
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
        if(javaType.equals("text")){
            AnnotationSpec.Builder column = AnnotationSpec.builder(Column.class);
            column.addMember("columnDefinition","\"text\"");
            methodSpec.addAnnotation(column.build());
        }else if(javaType.equals("java.lang.String")&&field.getDbLength()!=null){
            AnnotationSpec.Builder column = AnnotationSpec.builder(Column.class);
            column.addMember("length",field.getDbLength()+"");
            methodSpec.addAnnotation(column.build());
        }

        return methodSpec;
    }
}