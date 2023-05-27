package cn.wwwlike.form.service;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.form.dao.FormDao;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.dto.FormFieldDto;
import cn.wwwlike.form.dto.PageComponentPropDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.vo.FormFieldVo;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.INo;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
                dto.setListShow(false);
            }
        }

        PageComponentPropDto prop=null;
//        { propName: "optionList", propVal: ff.dictCode, sourceType: "dict" },
        String x_component=null;
        if(dto.getDictCode()!=null){
            prop=new PageComponentPropDto();
            if(itemType.equals("req")){
                x_component="SelectTag";
                prop.setPropName("datas");
            }else{
                x_component="VfSelect_DICT";

                prop.setPropName("optionList");

            }
            prop.setPropVal(dto.getDictCode());
            prop.setSourceType("dict");
            List<PageComponentPropDto> dtos=new ArrayList<>();
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
            }
        }
        if(dto.getFieldType().equals("date")){
            x_component="DatePicker";
        }
        if(dto.getFieldName().equals("code")){
            dto.setX_hidden(true);
        }
        if(dto.getFieldName().equals("no")&&INo.class.isAssignableFrom(javaDto.getClz())){
            dto.setX_hidden(true);
            dto.setListShow(true);
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
        if(javaDto.commentRead) {
            if (formDto != null) {//更新
                if (!formDto.getTitle().equals(javaDto.getTitle())) {
                    formDto.setTitle(javaDto.getTitle());
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
                            }
                            String javaTitle = javaField.getTitle();
                            if (javaTitle != null && !javaTitle.equals("/") && !javaTitle.equals(dbField.getJavaTitle())) {
                                change = true;
                                if (dbField.getTitle().equals(dbField.getJavaTitle())) {
                                    dbField.setTitle(javaTitle);
                                }
                                dbField.setJavaTitle(javaTitle);
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

//            VClazz v= (VClazz) javaDto.getClz().getAnnotation(VClazz.class);
//            if(v!=null&&v.module()!=null){
//                dto.setModule(v.module());
//            }else{
//                Pattern pattern = Pattern.compile("[A-Z]");
//                Matcher matcher = pattern.matcher(vo.getEntityType());
//                //字段初始化
//                if (matcher.find()) {
//                    dto.setModule(vo.getEntityType().substring(0,matcher.start()));
//                }
//            }
                //页面布局相关
                if (dto.getItemType().equals("req")) {
                    dto.setModelSize(1);
                } else {
                    int size = dto.getFields().size();
                    dto.setModelSize(size > 16 ? 4 : size > 10 ? 3 : 2);
                }
                dto.setPageSize(10);
                save(dto);
            } else {
                System.out.println(modelName);
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
               System.out.println(entityType);
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
}
