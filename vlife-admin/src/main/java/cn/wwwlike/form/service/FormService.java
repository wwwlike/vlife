package cn.wwwlike.form.service;

import cn.wwwlike.common.BaseService;
import cn.wwwlike.form.dao.FormDao;
import cn.wwwlike.form.dao.FormFieldDao;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.vo.FormFieldVo;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FormService extends BaseService<Form, FormDao> {

    @Autowired
    public FormFieldService fieldService;
    /**
     * 返回前端最新同步过后的表单模型信息
     * @param uiType 请求模型类型
     * @param dtos 最新模型信息
     * @return
     */
    public List<FormVo> getFormsByUiType(String uiType, List<BeanDto> dtos){
        //类型已经发布的
       final List<FormVo> published=
                dao.query(FormVo.class, QueryWrapper.of(Form.class).eq("uiType",uiType), null);
        //发布过的同步数据(字段会更新)，增减字段
            published.forEach(vo->{
                List<FormField> adds=new ArrayList<>();
                Optional<BeanDto> dto=dtos.stream().filter(d->vo.getType().equals(d.getType())).findFirst();
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
                    });
                    //视图里多余字段干掉
                    vo.setFields(
                            vo.getFields().stream().filter(ff->syncField.contains(ff.getId())).collect(Collectors.toList()));
                }else{//表删除
                    remove(vo.getId());
                }
            });

       List<String> itemNames=published.stream().map(FormVo::getType).collect(Collectors.toList());
         //没有发布的转换成formVO
        List<BeanDto> filters=dtos.stream().filter(d->!itemNames.contains(d.getType())).collect(Collectors.toList());
        filters.forEach(f->{
            FormVo formVo=tran(f,uiType);
            formVo.setUiType(uiType);
            published.add(formVo);
        });
        return published;
    }
    /**beanDto转换成formVO ,字段加上排序号**/
    public FormVo tran(BeanDto f, String uiType){
        List<FieldDto> fieldDtos=f.getFields();
        FormVo formDto=new FormVo();
        formDto.setFields(new ArrayList<>());
        BeanUtils.copyProperties(f,formDto);
        formDto.setUiType(uiType);
        formDto.setGridSpan(uiType.equals("req")?3:1);//默认 查询一列，编辑2列
        final int[] i = {0};
        fieldDtos.stream().forEach(fieldDto -> {
            FormFieldVo formField=new FormFieldVo();
            formField.setSort(i[0]);
            i[0]++;
            BeanUtils.copyProperties(fieldDto,formField);
            formDto.getFields().add(formField);
        });
        return formDto;
    }

}
