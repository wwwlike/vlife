package cn.wwwlike.sys.service;

import cn.vlife.common.IForm;
import cn.wwwlike.sys.dao.FormFieldDao;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.dto.FormFieldDto;
import cn.wwwlike.sys.dto.PageComponentPropDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.FormField;
import cn.wwwlike.sys.vo.FieldSelect;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.JpaAnnotationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

import static cn.wwwlike.sys.service.TableBuilder.replaceNumberInBrackets;

@Service
public class FormFieldService extends VLifeService<FormField, FormFieldDao> {
    @Autowired
    public FormService formService;
    @Autowired
    public TableBuilder tableBuilder;
    @PersistenceContext
    private EntityManager entityManager;

    //通过外键字段查询主表信息
    public List<FormField> findByFkFieldId(String fkFieldId){
        if (fkFieldId == null) {
            return new ArrayList<>();
        }
        FormField field=findOne(fkFieldId);
        if(isFkField(field.getPathName(),field.getEntityFieldName())){
            return find(QueryWrapper.of(FormField.class).eq("entityType", field.getEntityType(), Form.class)
                    .eq("itemType", VCT.MODEL_TYPE.ENTITY, Form.class)
            );
        }
        return new ArrayList<>();
    }

    /**
     * 分组字段查询组装
     * 计算当前实体可分组，以及所有外键对应主表可分组字段
     */
    public List<FieldSelect> queryGroupField(String formId){
        if (formId == null) {
            return new ArrayList<>();
        }
        FormDto formVo=formService.queryOne(FormDto.class,formId);
        List<FormFieldDto> groupField =groupField(formVo);
        List<FieldSelect> options= groupField.stream().map(f->new FieldSelect(f.getId(),f.getTitle())).collect(Collectors.toList());
        //主表可分组字段加入
        formVo.getFields().stream().filter(f->isFkField(f.getPathName(),f.getEntityFieldName())).forEach(f->{
            FormDto subFormDto=formService.query(FormDto.class,QueryWrapper.of(Form.class).eq("type", f.getEntityType())).get(0);
            List<FormFieldDto>  subGroupField=groupField(subFormDto);
            options.addAll(subGroupField.stream().map(ff->new FieldSelect(ff.getId(),f.getTitle()+"."+ff.getTitle())).collect(Collectors.toList()));
        });
        return options;
    }

    public static Class getJavaTypeClass(String javaType){
        Class javaTypeClazz=null;
        if(javaType.indexOf(".")!=-1){
            try {
                javaTypeClazz=  Class.forName(javaType);
            } catch (ClassNotFoundException e) {
                //有包路径，但是还不存在，说明还未发布
                return null;
            }
        }
        if(javaType.equals("string")||javaType.equals("text")){
            javaTypeClazz=String.class;
        }else if (javaType.equals("double")){
            javaTypeClazz=Double.class;
        }else if (javaType.equals("long")){
            javaTypeClazz=Long.class;
        }else if (javaType.equals("int")){
            javaTypeClazz=Integer.class;
        }else if (javaType.equals("date")){
            javaTypeClazz= Date.class;
        }else if (javaType.equals("boolean")){
            javaTypeClazz=boolean.class;
        }
        return javaTypeClazz;
    }



    public void dbFieldsSync(FormDto form){
        List<Map<String,String>> dbColumnInfos=tableBuilder.getTableColumns(form.getTableName());
        try{
            Class clazz=Class.forName(form.getTypeClass());
            //遍历实体类，判断是否在db物理和模型信息都存在则更新
            for (Field field:clazz.getFields()){
                Optional<Map<String,String>> optional=dbColumnInfos.stream().filter(c->c.get("Field").equals(JpaAnnotationUtils.convertToSnakeCase(field.getName()))).findFirst();
                Optional<FormFieldDto> fieldDtoOptional=form.getFields().stream().filter(f->f.getFieldName().equals(field.getName())).findFirst();
                if(optional.isPresent()&&fieldDtoOptional.isPresent()){
                    dbFieldSync(form.getTableName(),fieldDtoOptional.get(),optional.get());
                }
            }
            // 遍历数据库信息，判断在类信息里是否存在该字段，不存在则删除
            for(Map<String,String> map :dbColumnInfos){
                String fieldName=map.get("Field");
                if(Arrays.stream(clazz.getDeclaredFields()).filter(f->JpaAnnotationUtils.convertToSnakeCase(f.getName()).equals(fieldName)).count()==0
                && Arrays.stream(clazz.getSuperclass().getDeclaredFields()).filter(f->JpaAnnotationUtils.convertToSnakeCase(f.getName()).equals(fieldName)).count()==0
                ){
                    deleteField(form.getTableName(),fieldName);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    //同步实体模型字段title
    public void syncEntityFieldtitle(String entityId,String fieldName,String title){
        List<FormDto> relationModels=formService.query(FormDto.class,QueryWrapper.of(Form.class).eq("entityId", entityId).ne("itemType","entity"));
        for(FormDto formDto:relationModels){
            List<FormFieldDto> fields=formDto.getFields();
            for(FormFieldDto field:fields){
                if(field.getFieldName().equals(fieldName)){
                    field.setTitle(title);
                    save(field);
                }
            }
        }
    }

    private void dbFieldSync(String tableName, FormFieldDto dto, Map<String,String> fieldDbInfo){
        //注释发生变化
        boolean descChange=!dto.getTitle().equals(fieldDbInfo.get("Comment"));
        boolean lengthChange=false;
        String dbFieldTypeLength=fieldDbInfo.get("Type").replaceAll("\\D", "");
        if(!"".equals(dbFieldTypeLength)&&dto.getDbLength()!=null&& dto.getDbLength()!=Integer.parseInt(dbFieldTypeLength)){
            lengthChange=true;
        }
        //字段注释和精度更新
        if(descChange || lengthChange){//字段长度发生变化
            String  dbFieldType=fieldDbInfo.get("Type");
            if(lengthChange){
                dbFieldType= replaceNumberInBrackets(fieldDbInfo.get("Type"),dto.getDbLength());
            }
            String sql = String.format("ALTER TABLE %s MODIFY COLUMN %s %s COMMENT '%s'",
                    JpaAnnotationUtils.convertToSnakeCase(tableName),//改下划线
                    JpaAnnotationUtils.convertToSnakeCase(dto.getFieldName()),//改下划线
                    dbFieldType, dto.getTitle());
            try {
                entityManager.createNativeQuery(sql).executeUpdate();  //ALTER TABLE sys_tab MODIFY COLUMN id varchar(50) COMMENT '主键id'
            }catch (Exception e){
                System.out.println(sql);
            }
        }
    }


    private void deleteField(String tableName, String fieldName) {
        // 构建 SQL 删除字段的语句
        String sql = String.format("ALTER TABLE %s DROP COLUMN %s",
                JpaAnnotationUtils.convertToSnakeCase(tableName), // 表名下划线转换
                JpaAnnotationUtils.convertToSnakeCase(fieldName)); // 字段名下划线转换
        try {
            // 执行删除字段的 SQL 语句
            entityManager.createNativeQuery(sql).executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     * 字段信息补全完善
     */
    public FormFieldDto perfect(FormFieldDto dto,FormDto model){
        String entityType=model.getEntityType();
        dto.setEntityType(dto.getEntityType() != null ? dto.getEntityType() :entityType);
        if(dto.getDataType()==null){
            dto.setDataType("basic");
        }
        dto.setEntityFieldName(dto.getEntityType().equals(entityType)?dto.getFieldName():"id");
        dto.setPathName(dto.getFieldName());
        Class fieldClz=getJavaTypeClass(dto.getJavaType());
        if(fieldClz==String.class||"text".equals(dto.getJavaType())){
            dto.setFieldType("string");
        }else if(fieldClz==Double.class||fieldClz==Integer.class||fieldClz==Long.class||fieldClz==Number.class||fieldClz==int.class||fieldClz==double.class||fieldClz==long.class){
            dto.setDbLength(null);
            dto.setFieldType("number");
        }else if(fieldClz==Boolean.class||fieldClz==boolean.class){
            dto.setFieldType("boolean");
            dto.setDbLength(null);
        }else if(fieldClz== Date.class){
            dto.setFieldType("date");
            dto.setDbLength(null);
        }
//        dto.setJavaTitle(dto.getTitle());
        if(dto.getX_component()==null){
            dto=initComponent(dto,model);
        }
        return dto;
    }

    /**
     * 字段关联组件并初始化组件数据
     */
    public FormFieldDto initComponent(FormFieldDto dto, IForm formDto) {
        byReqInit(dto,formDto);
        byFieldNameInit(dto);
        x_componetInit(dto,formDto);
        return dto;
    }

    /**
     * 根据字段名做的初始化配置
     */
    private FormFieldDto byFieldNameInit(FormFieldDto dto) {
        if (dto.getFieldName().equals("name")) {
            dto.setRequired(true);
        }
        if (dto.getFieldName().equals("password")) {
            dto.setX_display("hidden");
        }
        return dto;
    }

    private FormFieldDto x_componetInit(FormFieldDto dto, IForm formDto){
        String itemType=formDto.getItemType();
        if (dto.getDataType().equals("basic")) {
            if (dto.getFieldName().endsWith("Id")) {
                dto.setX_component("RelationInput");
            }else if(dto.getPathName().equals("sysUserId")) {
                dto.setX_component("UserSelect");
            }else if(dto.getJavaType().equals("text")){
                dto.setX_component("TextArea");
            }else if (dto.getFieldType().equals("string")) {
                if ("img,IMAGE,photo,avatar".toLowerCase().indexOf(dto.getFieldName().toLowerCase()) != -1) {
                    dto.setX_component("VfImage");
                } else if (dto.getFieldName().toLowerCase().indexOf("icon") != -1) {
                    dto.setX_component("SelectIcon");
                } else {
                    dto.setX_component("Input");
                }
            } else if (dto.getFieldType().equals("number")) {
                dto.setX_component("InputNumber");
            } else if (dto.getFieldType().equals("boolean")) {
                dto.setX_component("VfCheckbox");
            } else if (dto.getFieldType().equals("date")) {
                dto.setX_component("DatePicker");
            }
        } if (dto.getDataType().equals("array") && itemType.equals(VCT.MODEL_TYPE.DTO)) {
            if (dto.getFieldType().equals("string")) {
                dto.setX_component("RelationInput");
            } else {
                dto.setX_component("SubTable");
                dto.setHideLabel(true);
                dto.setX_decorator_props$layout("vertical");
                dto.setX_decorator_props$gridSpan(3);
                dto.setX_decorator_props$labelAlign("left");
//                dto.setDivider(true);
//                dto.setDividerLabel(dto.getTitle());
                PageComponentPropDto pageComponentProp = new PageComponentPropDto();
                pageComponentProp.setPropName("type");
                pageComponentProp.setPropVal("entityType");
                pageComponentProp.setSourceType("sys");
                dto.setPageComponentPropDtos(Arrays.asList(pageComponentProp));
            }
        }
        return dto;
    }

    /**
     * dto模型个性化配置
     */
    private FormFieldDto byDtoInit(FormFieldDto dto, IForm formDto) {
        return dto;
    }

    /**
     * 实体模型个性化配置
     */
    private FormFieldDto byEntityInit(FormFieldDto dto, IForm formDto) {
        return dto;
    }

    /**
     * 实体模型个性化配置
     */
    private FormFieldDto byReqInit(FormFieldDto dto, IForm formDto) {
        if(formDto.getItemType().equals(VCT.MODEL_TYPE.REQ)){
            dto.setX_decorator_props$labelAlign("left");
            dto.setX_decorator_props$layout("vertical");
        }
        return dto;
    }

    /**
     * 是否外键判断
     */
    private Boolean isFkField(String pathName,String entityFieldName){
        return !pathName.equals("id")&&entityFieldName.equals("id");
    }

    /**
     * 是否是分组字段
     * 日期|字典|外键可分组
     */
    private List<FormFieldDto> groupField(FormDto formVo){
        return formVo.getFields().stream().filter(f->
                f.getDataType().equals("basic") &&
                        (f.dictCode!=null||f.fieldType.equals("date")||
                                f.getPathName().endsWith("Id")
                        )).collect(Collectors.toList());
    }

}
