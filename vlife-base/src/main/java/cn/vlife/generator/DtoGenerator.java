package cn.vlife.generator;

import cn.vlife.common.IForm;
import cn.wwwlike.vlife.base.SaveBean;
import com.squareup.javapoet.*;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import javax.lang.model.element.Modifier;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class DtoGenerator extends ICrudCodeCreate {

    public  DtoGenerator(String packageName, IForm publihModel, IForm entityModel, String targetDirectory){
        super(packageName,publihModel,entityModel,targetDirectory);
    }

    @Override
    public File create() {
        List<FieldSpec> fieldSpecs = new ArrayList<>();
        //添加字段
        publihModel.getFields().stream().filter(f->!f.getFieldName().equals("id")).forEach(f->{
            FieldSpec.Builder _f=null;
            //1. 非集合类型(基础包装类型和复杂对象类型)
            if(!"array".equals(f.getDataType())){
                Class basicClazz= getJavaTypeClass(f.getJavaType());
                if(basicClazz!=null){
                    _f= FieldSpec.builder(basicClazz,f.getFieldName())
                            .addModifiers(Modifier.PUBLIC).addJavadoc(f.getTitle());
                }
            }else{
                //2. 集合类型(基础包装集合和复杂对象集合)
                Class javaTypeClazz=getJavaTypeClass(f.getJavaType());
                if(javaTypeClazz!=null){
                    //2. 基础类型集合 List<String>|List<Double>
                    TypeName basicListTypeClazz = ParameterizedTypeName.get(List.class, javaTypeClazz);
                    _f= FieldSpec.builder(basicListTypeClazz,f.getFieldName())
                            .addModifiers(Modifier.PUBLIC).addJavadoc(f.getTitle());
                }else if(f.getJavaType().indexOf(".")!=-1){
                    String fullClassName=f.getJavaType();
                    String packageName = fullClassName.substring(0, fullClassName.lastIndexOf('.'));
                    String className = fullClassName.substring(fullClassName.lastIndexOf('.') + 1);
                    TypeName basicListTypeClazz = ParameterizedTypeName.get(ClassName.get(List.class), ClassName.get(packageName, className));
                    _f= FieldSpec.builder(basicListTypeClazz,f.getFieldName())
                            .addModifiers(Modifier.PUBLIC).addJavadoc(f.getTitle());
                }
            }
            if(_f!=null)
                fieldSpecs.add(_f.build());
        });
        String entityName= StringUtils.capitalize(publihModel.getEntityType());
        ClassName entityClz = ClassName.get(getPackageName()+".entity",entityName);
        ParameterizedTypeName superClazz = ParameterizedTypeName.get(ClassName.get(SaveBean.class),entityClz);
        TypeSpec.Builder builder = TypeSpec.classBuilder(StringUtils.capitalize(publihModel.getType()))
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(publihModel.getTitle())
                 .addAnnotation(Data.class)
                .addFields(fieldSpecs)
                .superclass(superClazz);
        JavaFile javaFile = JavaFile.builder(getPackageName()+".dto", builder.build()).addFileComment(fileComment())
                .addFileComment(fileComment()).build();
        try {
           return  generateJavaFile(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }


}