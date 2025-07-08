package cn.wwwlike.sys.service;

import cn.vlife.common.IForm;
import cn.vlife.generator.GeneratorMvc;
import cn.wwwlike.sys.dao.FormDao;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.dto.FormFieldDto;
import cn.wwwlike.sys.dto.PageComponentPropDto;
import cn.wwwlike.sys.entity.*;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.ColumnInfo;
import cn.wwwlike.vlife.bean.DbTableInfo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.objship.read.tag.FieldTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.JpaAnnotationUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.vlife.utils.VlifeUtils;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.io.File;
import java.util.*;
import java.util.stream.Collectors;
import static cn.wwwlike.sys.service.FormFieldService.getJavaTypeClass;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.*;

@Service
public class FormService extends VLifeService<Form, FormDao> {

    @Autowired
    public FormFieldService fieldService;
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysMenuService menuService;
    @Autowired
    public SysDictService dictService;
    @Autowired
    public TableBuilder tableBuilder;
    @Autowired
    public SysTabService sysTabService;
    @Autowired
    public ButtonService buttonService;
    @Autowired
    public SysAppService sysAppService;

    /**
     * 根据type查询模型
     */
    public FormDto getModelByType(String type){
        List<FormDto> forms=query(FormDto.class,QueryWrapper.of(Form.class).eq("type",type));
        return forms!=null&&forms.size()>0?forms.get(0):null;
    }

    /**
     * 查询实体的子表模型
     */
    public List<FormDto> querySubForms(String entityType) {
        QueryWrapper<Form> qw=QueryWrapper.of(Form.class);
        qw.eq("itemType","entity").ne("type",entityType).andSub(FormField.class, qw1->qw1.eq("fieldName",entityType+"Id"));
        List<FormDto> forms= query(FormDto.class,qw);
        //有接口的关联子表(排除多对多)
        return forms.stream().filter(f->resourcesService.count(QueryWrapper.of(SysResources.class).eq("formId",f.getId()))>0).collect(Collectors.toList());
    }

    /**
     * 数据库物理表信息同步
     * form数据表->Db同步(字段大小,注释信息)
     * @param currForm 本次模型信息
     * @param lastForm 上次模型信息(
     */
    public  void dbSync(FormDto currForm,FormDto lastForm){
        try {
            Class entityClazz=Class.forName(currForm.getTypeClass());
            DbTableInfo tableInfo=JpaAnnotationUtils.getTableInfo(entityClazz);
            String tableName=tableInfo.getName();
            List<FormFieldDto> lastFields=lastForm!=null?lastForm.getFields():null;
            List<Map<String, String>> dbColumnList=tableBuilder.getTableColumns(tableName);
            currForm.getFields().forEach(currFieldDto->{
               Optional< FormFieldDto> lastFieldDtoOptial=lastFields==null?null:lastFields.stream().filter(ff->ff.getFieldName().equals(currFieldDto.getFieldName())).findFirst();
               FormFieldDto lastFieldDto=lastFieldDtoOptial==null||lastFieldDtoOptial.isPresent()==false?null:lastFieldDtoOptial.get();
               Optional<Map<String,String>> t=dbColumnList.stream().filter(d->d.get("Field").equals(
                       JpaAnnotationUtils.convertToSnakeCase(currFieldDto.getFieldName()))).findFirst();
               if(t.isPresent()){
                   String dbFieldType=t.get().get("Type");
                   tableBuilder.dbFieldSync(tableName,currFieldDto,lastFieldDto,dbFieldType);
               }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 字段模型转数据库模型
     */
    private FormFieldDto fieldDtoToFormFieldDto(IForm form, FieldDto fieldDto){
        Class modelClazz= null;
        try {
            modelClazz = Class.forName(form.getTypeClass());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        FormFieldDto formFieldDto = new FormFieldDto();
        BeanUtils.copyProperties(fieldDto, formFieldDto, "fieldType", "dataType");//
        formFieldDto.setDataType(getDataType(fieldDto.getFieldType()));
        formFieldDto.setFieldType(getFileType(fieldDto.getType()));
        String[] sysFields={"id","createBy","createDate","modifyId","modifyDate","createDeptcode","status"};
        final String fieldName=formFieldDto.getFieldName();
        if(Arrays.stream(sysFields).filter(e->e.equals(fieldName)).count()>0){
            formFieldDto.setSysField(true);
        }
        //存在是简单类型，那么就转成包装类型存入数据库
        Class fieldClass=getJavaTypeClass(fieldDto.getClz().getName());
        formFieldDto.setJavaType(fieldClass.getName());
        String pathName = fieldDto.getPathName();
        int last_index = pathName.lastIndexOf("_");
        if (pathName.endsWith("Id")) {
            String entityType = pathName.substring(last_index + 1, pathName.length() - 2);
            if (GlobalData.findBeanDtoByName("entity", entityType) != null) {
                formFieldDto.setEntityFieldName("id");
                formFieldDto.setEntityType(entityType);
            } else {
            }
        }
        //注解信息读取
        if(form.getItemType().equals("entity")){
            ColumnInfo columnInfo= JpaAnnotationUtils.getColumnInfo(modelClazz,fieldDto.getFieldName());
            if(columnInfo!=null&& "text".equals(columnInfo.getColumnDefinition())){
                formFieldDto.setJavaType("text");
                formFieldDto.setDbLength(null);
            }
            if(formFieldDto.getFieldType().equals("string")&&!formFieldDto.getJavaType().equals("text")){
                formFieldDto.setDbLength((columnInfo==null||columnInfo.getLength()==null)?255:columnInfo.getLength());
            }
        }
        if (formFieldDto.getTitle() == null || "".equals(fieldDto.getTitle()) || fieldDto.getTitle().equals("/")) {
            formFieldDto.setTitle(formFieldDto.getFieldName());
        }
//        formFieldDto.setJavaTitle(formFieldDto.getTitle());
        //组件初始化
        formFieldDto =  fieldService.initComponent(formFieldDto, form);
        return formFieldDto;
    }

    /**
     * java模型转换为数据库模型
     */
    private FormDto javaDtoToFormDto(BeanDto javaDto,ClzTag tag){
        FormDto formDto = new FormDto();
        formDto.setFields(new ArrayList<>());
        BeanUtils.copyProperties(javaDto, formDto);
        formDto.setTitle(tag.getTitle());
        if(formDto.getTitle()==null){
            formDto.setTitle(javaDto.getType());
        }
        //1.表单配置
        formDto.setModelSize(4);
        if (formDto.getItemType().equals(VCT.MODEL_TYPE.REQ)) {
            formDto.setModelSize(1);
        } else {
            int size = formDto.getFields().size();
            formDto.setModelSize(size > 16 ? 4 : size > 10 ? 3 : 2);
        }
        String typeClass=javaDto.getClz().getName();
        formDto.setTypeClass(typeClass);
        formDto.setState(VCT.MODEL_STATE.PUBLISHED);
        formDto.setTypeParentsStr(String.join(",", javaDto.getParentsName()));
        if(javaDto instanceof EntityDto){
           EntityDto entityDto=((EntityDto) javaDto);
           formDto.setOrders(entityDto.getOrders());
            if(entityDto.getDeleteMap()!=null&&entityDto.getDeleteMap().size()>0){
                formDto.setCascadeDeleteEntityNames(JSON.toJSONString(entityDto.getDeleteMap()));
            }
        }
        //2. 字段配置
        final int[] i = {0};
        if(javaDto.getFields()!=null&&javaDto.getFields().size()>0){
            formDto.setFields((List<FormFieldDto>) javaDto.getFields().stream().map(fieldDto -> {
                FormFieldDto  _formFieldDto= fieldDtoToFormFieldDto(formDto,(FieldDto) fieldDto);
                _formFieldDto.setSort(i[0]);
                i[0]++;
                return _formFieldDto;
            }).collect(Collectors.toList()));
        }
        return formDto;
    }

    /**
     * 模型信息同步
     * @param lastFormDto 上次模型信息
     * @param currFormDto 本次最新
     */
    private FormDto modelSync(FormDto lastFormDto,FormDto currFormDto){
        boolean formChange=false;
        //注释信息判断是否有变化
        if(VlifeUtils.compareProperties(currFormDto,lastFormDto,"title")==false){
            String commentTitle=currFormDto.getTitle();
            lastFormDto.setTitle(commentTitle);
            formChange=true;
        }

        if(VlifeUtils.compareProperties(currFormDto,lastFormDto,"cascadeDeleteEntityNames")==false){
            lastFormDto.setCascadeDeleteEntityNames(currFormDto.getCascadeDeleteEntityNames());
            formChange=true;
        }

        if( VlifeUtils.compareProperties(currFormDto,lastFormDto,"itemType","typeClass","typeParentsStr","orders")==false){
            lastFormDto.setOrders(currFormDto.getOrders());
            lastFormDto.setTypeClass(currFormDto.getTypeClass());
            lastFormDto.setTypeParentsStr(currFormDto.getTypeParentsStr());
            lastFormDto.setItemType(currFormDto.getItemType());
            formChange=true;
        }
        if(formChange){
            super.save(lastFormDto);
        }
        return lastFormDto;
    }

    /**
     * Java模型数据解析
     * 1. Class模型类信息-> form数据表
     * 2. form表数据 -> DB库同步
     */
    public void syncOne(BeanDto javaDto, ClzTag tag) {
        List<FormDto> dtos=query(FormDto.class,QueryWrapper.of(Form.class).eq("type",javaDto.getType()));
        if (dtos==null||dtos.size()==0) {
            //开发模式新增模型
            FormDto devModeCreateFormDto=javaDtoToFormDto(javaDto,tag);
            devModeCreateFormDto.setTitle(tag.getTitle()!=null?tag.getTitle():javaDto.getType());
            if(!devModeCreateFormDto.getItemType().equals("entity")){
                String entityId=getModelByType(javaDto.getEntityType()).getId();
                devModeCreateFormDto.setEntityId(entityId);
            }
            if(!devModeCreateFormDto.getItemType().equals("bean")){
                devModeCreateFormDto.setSysAppId(sysAppService.getAppByClassPath(javaDto.getClz()).getId());
                dbSync(devModeCreateFormDto,null);
            }
            save(devModeCreateFormDto);
        }else {
            for(FormDto lastFormDto:dtos){
                boolean publishStateFlag=false;//模型发布状态更新标志
                if(lastFormDto.getTableName()==null&& "entity".equals(lastFormDto.getItemType())){
                    lastFormDto.setTableName(ReflectionUtils.getFieldValue(javaDto,"tableName").toString());
                    save(lastFormDto);
                }
                FormDto currFormDto=javaDtoToFormDto(javaDto,tag);//java模型转form模型
                lastFormDto=modelSync(lastFormDto,currFormDto);//与上一次(last)模型和信息比对后更新
                List<FormFieldDto> currFormFieldDtoList=currFormDto.getFields();
                int newFieldCount=0;
                for (FormFieldDto currField : currFormFieldDtoList) {
                    FieldTag fieldTag=tag.getTags().get(currField.getFieldName());
                    boolean isNewField=true;
                    if(lastFormDto!=null&&lastFormDto.getFields()!=null){
                        for(FormFieldDto lastField:lastFormDto.getFields()){
                            if(lastField.getFieldName().equals(currField.getFieldName())){
                                isNewField=false;
                                boolean change=false;
                                //1. 字段名称发生变化
                                if(fieldTag!=null&&StringUtils.isNotBlank(fieldTag.getTitle())&&!fieldTag.getTitle().equals(lastField.getTitle())){
                                    lastField.setTitle(fieldTag.getTitle());
                                    publishStateFlag=true;
                                    change=true;
                                    //实体模型字段名发生变化，影响关联dto,vo,req模型
                                    if(lastFormDto.getItemType().equals("entity")){
                                        fieldService.syncEntityFieldtitle(lastFormDto.getId(),fieldTag.getFieldName(),fieldTag.getTitle());
                                    }

                                }
                                //2. 名称之外属性变化
                                if(VlifeUtils.compareProperties(currField,lastField,"fieldType","javaType","dbLength","pathName","dictCode","x_component_props$placeholder")==false){
                                    lastField.setFieldType(currField.getFieldType());
                                    lastField.setJavaType(currField.getJavaType());
                                    lastField.setDbLength(currField.getDbLength());
                                    lastField.setPathName(currField.getPathName());
                                    lastField.setDictCode(currField.getDictCode());
                                    lastField.setX_component_props$placeholder(currField.getX_component_props$placeholder());
                                    publishStateFlag=true;
                                    change=true;
                                }

                                if(change){
                                    fieldService.save(lastField);
                                }
                                break;
                            }
                        }
                    }
                    if(isNewField){
                        //新增字段
                        newFieldCount++;
                        currField.setSort(lastFormDto.getFields()!=null?lastFormDto.getFields().size() + newFieldCount:0);
                        currField.setFormId(lastFormDto.getId());
                        fieldService.save(currField);
                    }
                }
                    //2 找出要删除的字段
                if (lastFormDto.getFields() != null) {
                    for (FormFieldDto dbField : lastFormDto.getFields()) {
                        if (currFormDto.getFields().stream().filter(f -> f.getFieldName().equals(dbField.getFieldName())).count() == 0) {
                            try{
                                fieldService.remove(dbField.getId());
                            }catch (Exception exception){
                                //删除失败，说明有业务数据关联，不能删除
                                }

                            publishStateFlag=true;
                        }
                    }
                }

                if(publishStateFlag){
                    lastFormDto.setState(VCT.MODEL_STATE.WAIT_START);
                    save(lastFormDto);
                }
            }
        }
    }

    //后端数据分类转成前端分类
    public static String getDataType(String javaFileType) {
        if (BASIC.equals(javaFileType)) {
            return BASIC;
        } else if (LIST.equals(javaFileType)) {
            return ARRAY;
        } else {
            return OBJECT;
        }
    }

    //后端数据类型转ts类型名称
    public static String getFileType(String javaType) {
        if ("integerlongdouble".indexOf(javaType) != -1) {
            return "number";
        }
        return javaType;
    }

    /**
     * 同步最新的dictCode到field的该字段上
     */
    public FormDto syncDictCode(FormDto dto) {
        dto.setFields(dto.fields.stream().map(field -> {
            if("VfSelect_DICT".equals(field.getX_component())){
                List<PageComponentPropDto> prop = field.getPageComponentPropDtos();
                if (prop != null) {
                    prop.forEach(p -> {
                        if ("dictOpenApi".equals(p.getPropVal()) && p.getParams() != null) {
                            p.getParams().forEach(param -> {
                                if (param.getParamName().equals("code") && !param.getParamVal().equals(field.getDictCode())) {
                                    field.setDictCode(param.getParamVal());
                                }
                            });
                        }
                    });
                }
            }
            return field;
        }).collect(Collectors.toList()));
        return dto;
    }

    //custom自定义模型完善
    public FormDto customPerfect(FormDto formDto){
        formDto.setModelSize(formDto.getModelSize() != null ? formDto.getModelSize() : 2);
        if(formDto.getItemType().equals("entity")){
            formDto.setTableName(JpaAnnotationUtils.convertToSnakeCase(formDto.getType()));
            formDto.setEntityId(formDto.getId());
        }else if(formDto.getEntityType()!=null&&formDto.getEntityId()==null){ //关联实体模型id配置
            formDto.setEntityId(find("type",formDto.getEntityType()).get(0).getEntityId());
        }
        //发布状态更新
        if(formDto.getState()==null||formDto.getState().equals(VCT.MODEL_STATE.CREATING)){
            formDto.setState(VCT.MODEL_STATE.WAIT_START);
        }else if(formDto.getState().equals(VCT.MODEL_STATE.PUBLISHED)){
            formDto.setState(VCT.MODEL_STATE.RESTART);
        }
        //字段完善
        List<FormFieldDto> fields = formDto.getFields();
        fields.stream()
                .map(field ->fieldService.perfect(field,formDto))
                .collect(Collectors.toList());
        formDto.setFields(fields);
        return formDto;
    }

    /**
     * 单个模型删除
     */
    public boolean remove(String id) throws Exception {
        FormDto form=queryOne(FormDto.class,id);
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(form!=null,"模型不存在或者已经删除");
        boolean isEntityModel=VCT.MODEL_TYPE.ENTITY.equals(form.getItemType());
        super.remove(id);  //1. 模型信息删除
        if(form.getTypeClass()!=null){
            GeneratorMvc.remove(form); //2. 物理模型删除
        }
        resourcesService.removeByModelType(form.getType());  //3. 关联接口删除
        if(!isEntityModel&&form.getTypeClass()!=null&&!form.getTypeClass().startsWith("cn.wwwlike")){
            FormDto entity=query(FormDto.class,QueryWrapper.of(Form.class).eq("type",form.getEntityType())).get(0);
            List<FormDto> dtos=query(FormDto.class,QueryWrapper.of(Form.class).eq("entityType",form.getEntityType()).eq("itemType",VCT.MODEL_TYPE.DTO));
        }
        return true;
    }

    //单独发布实体模型(删除级联以及模型名称更新)
    public FormDto entityPublish(FormDto dto){
        //状态更新
        dto.setState(VCT.MODEL_STATE.RESTART);
        //代码创建
        File apiFile=javaFilePublish(dto);
        return super.save(dto, true);
    }

    /**
     * 模型发布
     */
    public FormDto publish(FormDto dto){
        //1. 模型&字段完善
        dto=customPerfect(dto);
        dto.setUnpublishForm(null);
        //2. 代码生成
        File apiFile=javaFilePublish(dto);
        //3. 接口发布(第一次创建实体时发布)
        resourcesService.createDefaultResources(dto);
        FormDto model= super.save(dto, true);
        //4. 按钮创建
        buttonService.createSysButton(dto.getEntityType(),dto.getType());
        //5. 存在删除字段的情况则同步到其他dto模型一并删除
        if(model.getItemType().equals("entity")) {
            removeFieldSync(model);
        }
        return model;
    }

    //字段删除，dto等关联类型模型字段同步
    public void removeFieldSync(FormDto entityDto){
        List<FormFieldDto> entityFields=entityDto.getFields();
        //最新字段
        List<String> fieldNames=entityFields.stream().map(FormFieldDto::getFieldName).collect(Collectors.toList());
        List<FormDto> dtos=query(FormDto.class,QueryWrapper.of(Form.class).ne("itemType","entity").eq("entityType",entityDto.getType()));
        for(FormDto dto:dtos){
            List<FormFieldDto> fields=dto.getFields().stream().filter(f->
                    ("numberstringdateboolean").indexOf(f.getFieldType())==-1|| //dto里的复杂类型字段或数组字段，保留
                    fieldNames.contains(f.getFieldName()) //字段还存在没删除
            ).collect(Collectors.toList());
            //字段存在删除的情况
            if(entityDto.getFields().size()!=fields.size()){
                dto.setFields(fields);
                publish(dto);
            }
        }
    }


    //物理模型发布创建
    private File javaFilePublish(FormDto dto){
        FormDto entity=dto.getItemType().equals("entity")?dto:query(FormDto.class,QueryWrapper.of(Form.class).eq("type",dto.getEntityType())).get(0);
        File apiFile=null;
        if(VCT.MODEL_TYPE.ENTITY.equals(dto.getItemType())){
           apiFile= GeneratorMvc.entityCreate(dto);
        }else if(VCT.MODEL_TYPE.DTO.equals(dto.getItemType())){
            apiFile=GeneratorMvc.dtoCreate(dto,entity);
        }
        return  apiFile;
    }

    /**
     * curd菜单相关资源创建
     * 1. 默认页签
     * 2. 绑定按钮
     */
    public void createMenuRelation(String sysMenuId,String formId){
        FormDto dto=queryOne(FormDto.class,formId);
        String entityType=dto.getEntityType();
        String formType=dto.getType();
        String entityId=dto.getId();
        if(!entityType.equals(formType)){//查找实体
             entityId=getModelByType(entityType).getId();
        }
        //资源创建
        resourcesService.createDefaultResources(dto);
        List<Button> sysBtns=buttonService.createSysButton(entityType,formType);
        if(sysTabService.count(QueryWrapper.of(SysTab.class).eq("sysMenuId",sysMenuId))==0){
            sysTabService.initTab(sysMenuId,entityId,sysBtns,dto);
        }
    }

    /**
     * 查找主表Type集合
     * @param allFkFields 所有外键字段
     * @param formId 子表id
     */
    public List<String> parents(List<FormField> allFkFields,String formId){
        return allFkFields.stream().filter(f->f.getFormId().equals(formId)).map(t->t.getFieldName().replaceAll("Id$", "")).collect(Collectors.toList());
    }

    /**
     * 查找子表type集合
     * @param entityMap key=>id value=>type
     * @param allFkFields 所有外键字段
     * @param entityType 实体type
     */
    public List<String> subs(Map<String,String> entityMap ,List<FormField> allFkFields,String entityType){
        return allFkFields.stream().filter(f->f.getFieldName().equals(entityType+"Id")).map(t->entityMap.get(t.getFormId())).collect(Collectors.toList());
    }


}
