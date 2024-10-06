package cn.wwwlike.form.service;

import cn.wwwlike.form.IField;
import cn.wwwlike.form.dao.FormFieldDao;
import cn.wwwlike.form.dto.FormFieldDto;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.vo.FormFieldVo;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FormFieldService extends VLifeService<FormField, FormFieldDao> {
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * 是否是分组字段
     */
    public List<FormFieldVo> groupField(FormVo formVo){
       return formVo.getFields().stream().filter(f->
         f.getDataType().equals("basic") &&
                (f.dictCode!=null||f.fieldType.equals("date")||
                        f.getPathName().endsWith("Id")
                )).collect(Collectors.toList());
    }

    /**
     * 将模型字段信息转成数据表的字段信息集合
     */
    public List<FormField> getFieldList(List<FieldDto> dtos){
        List<FormField> fields=new ArrayList<>();
        int i=0;
        for(FieldDto dto:dtos){
            FormField formField=new FormField();
            BeanUtils.copyProperties(dto,formField);//dto->entityItem
            i++;
            formField.setSort(i);
            fields.add(formField);
        }
        return fields;
    }


    public FormFieldDto perfect(FormFieldDto dto,String entityType){
        dto.setEntityType(dto.getEntityType() != null ? dto.getEntityType() :entityType);
        dto.setDataType("basic");
        dto.setEntityFieldName(dto.getEntityType().equals(entityType)?dto.getFieldName():"id");
        dto.setPathName(dto.getFieldName());
        if(dto.getJavaType().equals("string")||dto.getJavaType().equals("text")){
            dto.setFieldType("string");
        }
        if(dto.getJavaType().equals("number")||dto.getJavaType().equals("double")||dto.getJavaType().equals("int")||dto.getJavaType().equals("integer")||dto.getJavaType().equals("long")||dto.getJavaType().equals("double")){
            dto.setFieldType("number");
        }
        if(dto.getJavaType().equals("boolean")){
            dto.setFieldType("boolean");
        }
        if(dto.getJavaType().equals("date")){
            dto.setFieldType("date");
        }
        dto.setJavaTitle(dto.getTitle());

        if(dto.getX_component()==null){
            if(dto.getJavaType().equals("text")){
                dto.setX_component("TextArea");
            }else if(dto.getFieldType().equals("string")){
                dto.setX_component("Input");
            }else if(dto.getFieldType().equals("number")){
                dto.setX_component("InputNumber");
            }else if(dto.getFieldType().equals("boolean")){
                dto.setX_component("VfCheckbox");
            }else if(dto.getFieldType().equals("date")){
                dto.setX_component("DatePicker");
            }
        }
        return dto;
    }



    /**
     * 根据Java类型映射到SQL类型
     * @param javaType Java类型的字符串表示
     * @return 对应的SQL类型
     */
    private String mapJavaTypeToSqlType(String javaType) {
        switch (javaType.toLowerCase()) {
            case "string":
                return "VARCHAR"; // 默认长度255
            case "int":
                return "INT";
            case "long":
                return "BIGINT";
            case "double":
                return "DOUBLE";
            case "float":
                return "FLOAT";
            case "boolean":
                return "BOOLEAN";
            case "date":
                return "DATETIME"; // 或者使用DATE
            // 可以根据需要添加其他Java类型的映射
            default:
                return "VARCHAR(255)"; // 默认为VARCHAR
        }
    }
    /**
     * 修改字段
     * @param tableName 表名
     * @param newField 字段信息
     */
    @Transactional
    public void modifyField(String tableName,IField newField) {
        String sql = String.format("ALTER TABLE %s MODIFY %s %s(%s) COMMENT '%s'",
                tableName,
                newField.getFieldName(),
                mapJavaTypeToSqlType(newField.getJavaType()),
                newField.getDbLength(),
                newField.getTitle());
        entityManager.createNativeQuery(sql).executeUpdate();
    }
    //更新字符串类型数据库精度
    public void modifyDbVarLength(String tableName,List<FormFieldDto> fields){
        //查找出有字符串精度更新的字符串
        fields.stream().filter(f->f.getId()!=null&&f.getJavaType().equals("string")&&findOne(f.getId()).getDbLength()!=f.getDbLength()).forEach(formFieldDto -> {
            modifyField(tableName,formFieldDto);
        });

    }

}
