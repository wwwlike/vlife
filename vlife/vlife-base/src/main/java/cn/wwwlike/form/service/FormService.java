package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.FormDao;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.dto.FormFieldDto;
import cn.wwwlike.form.dto.PageComponentPropDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.entity.PageApiParam;
import cn.wwwlike.form.vo.FormFieldVo;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.*;

@Service
public class FormService extends VLifeService<Form, FormDao> {

    @Autowired
    public FormFieldService fieldService;

    private FormFieldDto  initComponent(FormFieldDto dto,String itemType,BeanDto javaDto){
        if(dto.getFieldName().equals("id")){
            dto.setX_hidden(true);
        }
        if(itemType.equals("req")){
            dto.setX_decorator_props$labelAlign("left");
            dto.setX_decorator_props$layout("vertical");
        }else{
            if(dto.getFieldName().equals("name")){
                dto.setRequired(true);
            }
            if(dto.getFieldName().equals("password")){
                dto.setListHide(true);
            }
        }
        PageComponentPropDto prop=null;
        String x_component="Input";
        if(dto.getDictCode()!=null){
            prop=new PageComponentPropDto();
            if(itemType.equals("req")){
                x_component="SelectTag";
                prop.setPropName("datas");
            }else{
                x_component="VfSelect_DICT";
                prop.setPropName("optionList");
            }
            prop.setPropVal("dictDatas");
            prop.setSourceType("api");
            prop.setRelateVal("ISelect");
            PageApiParam apiParam=new PageApiParam();
            apiParam.setParamVal(dto.getDictCode());
            apiParam.setParamName("code");
            apiParam.setSourceType("fixed");
            List<PageApiParam> params=new ArrayList<>();
            params.add(apiParam);
            List<PageComponentPropDto> dtos=new ArrayList<>();
            prop.setParams(params);
            dtos.add(prop);
            dto.setPageComponentPropDtos(dtos);

        }else if(dto.getFieldName().endsWith("Id")){
            x_component="RelationTagInput";
        }else if(dto.getDataType().equals("basic")){
            if(dto.getFieldType().equals("string")&&itemType.equals("req")){
                x_component="SearchInput";
            }else if(dto.getFieldType().equals("string")&&itemType.equals("entity")){
                x_component="Input";
            }else if(dto.getFieldType().equals("number")){
                x_component="InputNumber";
            }else if(dto.getFieldType().equals("boolean")){
                x_component="VfCheckbox";
            }else if("imgImgIMAGEPHOTOphoto".indexOf(dto.getFieldName())!=-1){
                x_component="VfImage";
            }
        }else if(dto.getDataType().equals("array")&&itemType.equals("save")){
            x_component="table";
            dto.setHideLabel(true);
            dto.setX_decorator_props$layout("vertical");
            dto.setX_decorator_props$gridSpan(3);
            dto.setX_decorator_props$labelAlign("left");
            dto.setDivider(true);
            dto.setDividerLabel(dto.getTitle());
            PageComponentPropDto pageComponentProp=new PageComponentPropDto();
            pageComponentProp.setPropName("type");
            pageComponentProp.setPropVal("entityType");
            pageComponentProp.setSourceType("sys");
            dto.setPageComponentPropDtos(Arrays.asList(pageComponentProp));
        }
        if(dto.getFieldType().equals("date")){
            x_component="DatePicker";
        }
        if(dto.getFieldName().equals("code")){
            dto.setX_hidden(true);
        }
        if(dto.getFieldName().equals("no")&&INo.class.isAssignableFrom(javaDto.getClz())){
            dto.setX_hidden(true);
            dto.setListHide(false);
        }
        dto.setX_component(x_component);
        return dto;
    }


    /**
     * 模型信息同步
     * @param modelName
     * @return 能否继续
     */
    public boolean syncOne(String modelName){
        //查找最新java模型
        List<Form> published=find("type",modelName);
        FormDto formDto=null;
        if(published!=null&& published.size()>0){
            formDto=queryOne(FormDto.class,published.get(0).getId());
        }
        BeanDto javaDto= GlobalData.findModel(modelName);
        //有关联title读取到，则进行同步
        if(javaDto!=null&&javaDto.commentRead) {
            if (formDto != null) {//更新
                boolean formChange=false;
                if ((javaDto.getTitle()!=null&&!javaDto.getTitle().equals(formDto.getTitle()))) {
                    if(formDto.getTitle()==null||formDto.getTitle().equals(formDto.getName())){
                        formDto.setName(javaDto.getTitle());
                    }
                    formChange=true;
                    formDto.setTitle(javaDto.getTitle());
                }
                //主字段表达式设置
                if (formDto.itemType.equals("entity")) {
                    String itemName= (String) ReflectionUtils.getFieldValue(javaDto,"itemName");
                    if(itemName==null||"".equals(itemName)||!itemName.equals(formDto.getItemName())){
                        formDto.setItemName(itemName);
                        formChange=true;
                    }
                }
                if(formChange){
                    save(formDto);
                }
                List<FieldDto> javaFields = javaDto.getFields();
                //遍历最新模型的Java字段
                int count = 0;
                for (FieldDto javaField : javaFields) {
                    //1找出要新增，要修改的字段
                    boolean exists = false;
                    for (FormFieldDto dbField : formDto.getFields()) {
                        boolean change = false;
                        //字段属性发生变化进行修订
                        if (dbField.getFieldName().equals(javaField.getFieldName())) {
                            if (!dbField.getFieldType().equals(getFileType(javaField.getType())) ||
                                    !dbField.getDataType().equals(getDataType(javaField.getFieldType()))
                            ) {
                                change = true;
                                dbField.setDataType(getDataType(javaField.getFieldType()));
                                dbField.setFieldType(getFileType(javaField.getType()));
                                initComponent(dbField, formDto.getItemType(),javaDto);
                            }else if(javaField.getDictCode()!=null&&"Input".equals(dbField.getX_component())
                                    &&dbField.getDictCode()==null){
                                change = true;
                                dbField.setDictCode(javaField.getDictCode());
                                initComponent(dbField, formDto.getItemType(),javaDto);
                            }
                            String javaTitle = javaField.getTitle();
                            if (javaTitle != null && !javaTitle.equals("/") && !javaTitle.equals(dbField.getJavaTitle())) {
                                change = true;
                                if (dbField.getTitle().equals(dbField.getJavaTitle())) {
                                    dbField.setTitle(javaTitle);
                                }
                                dbField.setJavaTitle(javaTitle);
                            }
                            if(javaField.getPlaceholder()!=null&&dbField.getX_component_props$placeholder()==null){
                                change = true;
                                dbField.setX_component_props$placeholder(javaField.getPlaceholder());
                            }

                            if (change) {
                                fieldService.save(dbField);
                            }
                            exists = true;
                        }
                    }
                    if (exists == false) {//增量新增
                        count++;
                        FormFieldDto formField = new FormFieldDto();
                        BeanUtils.copyProperties(fieldTran(javaField), formField);
                        formField.setSort(formDto.getFields().size() + count);
                        formField.setFormId(formDto.getId());
                        formField.setX_component_props$placeholder(javaField.getPlaceholder());
                        initComponent(formField, formDto.getItemType(),javaDto);
                        //没有注释，则使用fieldName
                        if (formField.getTitle() == null || formField.getTitle().equals("/")) {
                            formField.setTitle(formField.getFieldName());
                        }
                        formField.setJavaTitle(formField.getTitle());
                        fieldService.save(formField);
                    }
                }
                //2 找出要删除的字段
                if (formDto.getFields() != null) {
                    for (FormFieldDto dbField : formDto.getFields()) {
                        //开始删除
                        if (javaFields.stream().filter(f -> f.getFieldName().equals(dbField.getFieldName())).count() == 0) {
                            fieldService.remove(dbField.getId());
                        }
                    }
                }
            } else if (javaDto != null && javaDto.getFields() != null && javaDto.getFields().size() > 0) {//模型新增
                FormVo vo = tran(javaDto);
                FormDto dto = new FormDto();
                dto.setVersion(0);
                BeanUtils.copyProperties(vo, dto);
                dto.setFields(
                        vo.getFields().stream().map(f -> {
                            //1赋值
                            FormFieldDto d = new FormFieldDto();
                            BeanUtils.copyProperties(f, d);
                            if (d.getTitle() == null || "".equals(d.getTitle()) || d.getTitle().equals("/")) {
                                d.setTitle(d.getFieldName());
                            }
                            d.setJavaTitle(d.getTitle());
                            //2.组件后端初始化
                            d = initComponent(d, vo.getItemType(),javaDto);
                            return d;
                        }).collect(Collectors.toList()));
                //页面布局相关
                if (dto.getItemType().equals("req")) {
                    dto.setModelSize(1);
                } else {
                    int size = dto.getFields().size();
                    dto.setModelSize(size > 16 ? 4 : size > 10 ? 3 : 2);
                }
                dto.setPageSize(10);
                dto.setName(dto.getTitle());
                save(dto);
            } else {
//                System.out.println(modelName);
            }
            return true;
        }else{
            return false;
        }

    }

    /**
     * 对数据库里的模型信息同步最新的Java模型信息
     * @param javaModels 最新的模型信息
     * @return
     */
    public Integer sync(List<? extends BeanDto> javaModels){
        //所有已经发布的模型信息
        final List<FormVo> published=queryAll(FormVo.class);
        int[] count={0};
        //发布过的同步数据(字段会更新)，增减字段
        published.forEach(vo->{
            List<FormField> adds=new ArrayList<>();
            Optional<? extends BeanDto> dto=javaModels.stream().filter(d->vo.getType().equals(d.getType())).findFirst();
            if(dto.isPresent()){
                List<FieldDto> fields=dto.get().getFields();
                List<String> syncField=new ArrayList<>();
                for(FieldDto f:fields){
                    boolean exists=false;
                    for(FormFieldVo vf:vo.getFields()){
                        if(vf.getFieldName().equals(f.getFieldName())){
                            syncField.add(vf.getId());
                            if(!vf.getPathName().equals(f.getPathName())){
                                FormField item=fieldService.findOne(vf.getId());
                                item.setPathName(f.getPathName());
                            }
                            exists=true;
                        }
                    }
                    if(!exists){//添加新的并保存入库
                        count[0]++;
                        FormField formField=new FormField();
                        BeanUtils.copyProperties(f,formField);//dto->entityItem
                        formField.setSort(vo.getFields().size()+1);
                        formField.setFormId(vo.getId());
                        fieldService.save(formField);
                        syncField.add(formField.getId());
                        adds.add(formField);
                    }
                }
                //添加到vo里
                if(adds.size()>0){
                    adds.forEach(add->{
                        FormFieldVo ffVo=new FormFieldVo();
                        BeanUtils.copyProperties(add,ffVo);
                        vo.getFields().add(ffVo);
                    });
                }
                //数据库里删除多余字段
                vo.getFields().stream().filter(ff->!syncField.contains(ff.getId())).forEach(notExist->{
                    fieldService.remove(notExist.getId());
                    count[0]++;
                });
                //视图里多余字段干掉
                vo.setFields(
                        vo.getFields().stream().filter(ff->syncField.contains(ff.getId())).collect(Collectors.toList()));
            }else{//表删除
                remove(vo.getId());
                count[0]++;
            }
        });
        return count[0];
//        List<String> itemNames=published.stream().map(FormVo::getType).collect(Collectors.toList());
//         //没有发布的转换成formVO
//        List<BeanDto> filters=javaModels.stream().filter(d->!itemNames.contains(d.getType())).collect(Collectors.toList());
//        filters.forEach(f->{
//            FormVo formVo=tran(f,uiType);
//            formVo.setUiType(uiType);
//            published.add(formVo);
//        });
//        return published;
    }

    public  FormFieldVo fieldTran(FieldDto fieldDto){
        FormFieldVo formFieldVo=new FormFieldVo();
        BeanUtils.copyProperties(fieldDto,formFieldVo,"fieldType","dataType");//
        formFieldVo.setDataType(getDataType(fieldDto.getFieldType()));
        formFieldVo.setFieldType(getFileType(fieldDto.getType()));
        String pathName=fieldDto.getPathName();
        int last_index=pathName.lastIndexOf("_");
        if(pathName.endsWith("Id")){
            String entityType=pathName.substring(last_index+1,pathName.length()-2);
            if(GlobalData.findBeanDtoByName("entity",entityType)!=null){
                formFieldVo.setEntityFieldName("id");
                formFieldVo.setEntityType(entityType);
            }else{
            }
        }
        return formFieldVo;
    }

    /**beanDto转换成formVO ,字段加上排序号**/
    public FormVo tran(BeanDto f){
        List<FieldDto> fieldDtos=f.getFields();
        FormVo formVo=new FormVo();
        formVo.setFields(new ArrayList<>());
        BeanUtils.copyProperties(f,formVo);
        formVo.setModelSize(4);
        final int[] i = {0};
        fieldDtos.stream().forEach(fieldDto -> {
            FormFieldVo formField=fieldTran(fieldDto);
            formField.setSort(i[0]);
            i[0]++;
            formVo.getFields().add(formField);
        });
        return formVo;
    }

    //后端数据分类转成前端分类
    public static String getDataType(String javaFileType) {
        if (BASIC.equals(javaFileType)) {
            return BASIC;
        } else if (LIST.equals(javaFileType)) {
            return ARRAY;
        } else{
            return OBJECT;
        }
    }

    //后端数据类型转ts类型名称
    public static String getFileType(String javaType) {
        if ("integerlongdouble".indexOf(javaType)!=-1) {
            return "number";
        }
        return javaType;
    }

    /**
     根据用户权限对查询模型返回出去的字段进行过滤
     * @param form 查询业务的数据库里的模型信息
     * @param relationTableNames 查询业务模型的 关联表name集合
     * @param userLeftTableNames 用户表的外键表name集合
     * @param filterType 用户权限组 过滤权限 关联实体名
     * @param filterLevel 过滤权限范围类型 1本级 2本级和下级
     * @return
     */
    public  List<FormFieldVo> reqModelFilter(FormVo form,List<String> relationTableNames,  List<String> userLeftTableNames, String filterType,String filterLevel,boolean querySub){
        String entityName=form.entityType;
        List<FormFieldVo> fieldVos=form.fields.stream().filter(f-> {
//            if(f.entityType.equals(form.entityType)){
//                return true;
//            }
            String fieldEntityName=f.entityType;
            //查询字段隐藏的2个条件，1字段来源是用户表的外键,2和行级过滤条件实体类需要一致（待）
            if(userLeftTableNames.contains(fieldEntityName)){
                if("1".equals(filterLevel)&&querySub){//能查询子集的过滤条件，但是当前查询是查本级，group上的查询条件，不能用；可扩展成该实体的外键表上的查询条件，如查本机构，那么其实是按照本机构的部门进行查询
                    //查本部门，那么前端不展示部门，展示用户，用户表里有部门id relation；前提是req模型里面有用户
                    if(relationTableNames.contains(fieldEntityName)){
                        return true;
                    }else{
                        return false;
                    }
                }else  if(!fieldEntityName.equals(filterType)){// 查本级和下级只能是group上的实体查询条件
                    return false;
                }
            }
            return true;
        }).collect(Collectors.toList());
        return fieldVos;
    }


    /**
     * 字段重新加载
     */

    @Autowired
    public PageComponentPropService propService;

    @Autowired
    public PageApiParamService paramService;
    /**
     * 物理删除指定实体模型，以及相关所有模型;
     * @param id
     */
    public String deleteModel(String id){
        FormVo formVo=queryOne(FormVo.class,id);
        if(formVo!=null){
//            QueryWrapper qw=QueryWrapper.of(Form.class);
//            qw.eq("entityType",formVo.getType());
//            //删除关联模型
//            List<FormVo> models=query(FormVo.class,qw);
//            if(models==null){
//                models=new ArrayList<>();
//            }
//            models.add(formVo);
//            for(FormVo model:models){
            formVo.fields.forEach(f->{
                fieldService.delete(f.getId());
                if(f.getPageComponentPropDtos()!=null){
                    f.getPageComponentPropDtos().forEach(p->{
                        propService.delete(p.getId());
                        if(p.getParams()!=null){
                            p.getParams().forEach(a->{
                                paramService.delete(a.getId());
                            });
                        }
                    });
                }
            });
            delete(formVo.getId());

//            }
            return  formVo.getType();
        }else{
            return null;
        }
    }

    /**
     * 同步最新的dictCode到field的该字段上
     * @param dto
     * @return
     */
    public FormDto syncDictCode(FormDto dto){
        dto.setFields(
        dto.fields.stream().map(field->{
            List<PageComponentPropDto> prop=field.getPageComponentPropDtos();
            if(prop!=null){
                prop.forEach(p->{
                    if("dictDatas".equals(p.getPropVal())&&p.getParams()!=null){
                        p.getParams().forEach(param->{
                            if(param.getParamName().equals("code")&&!param.getParamVal().equals(field.getDictCode())){
                                field.setDictCode(param.getParamVal());
                            }
                        });
                    }
                });
            }
            return field;
        }).collect(Collectors.toList()));
        return dto;
    }

    /**
     * 查询form的子表信息
     * @param form
     * @return
     */
    public List<FormVo> querySubForms(Form form){
        if(form==null){
            return null;
        }
        List<FormVo> formVos= query(FormVo.class,QueryWrapper.of(Form.class).eq("itemType","entity").ne("id",form.getId()));
        return formVos.stream().filter(subForm->subForm.getFields().stream().filter(field-> field.getEntityType().equals(form.getType())).count()>0).collect(Collectors.toList());
    }
}
