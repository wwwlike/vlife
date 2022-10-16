package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 列表字段接口;
 */
@RestController
@RequestMapping("/form")
public class FormApi extends VLifeApi<Form, FormService> {
  /**
   * 根据用途查询该类别已经保存的模型和能够支持该类型的模型
   * @return
   */
  @GetMapping("/models/{uiType}")
  public  List<FormVo> models(@PathVariable String uiType){
    Collection<? extends BeanDto>  entitys=GlobalData.getEntityDtos().values();
    List<BeanDto> dtos=new ArrayList<>();//查询的指定模型
    if(VCT.ITEM_TYPE.LIST.equals(uiType)){//列表用途
      dtos=new ArrayList<>(GlobalData.getVoDtos().values());
    } else if(VCT.ITEM_TYPE.SAVE.equals(uiType)){//数据编辑用途
      dtos=new ArrayList<>(GlobalData.getSaveDtos().values());
    }else if(VCT.ITEM_TYPE.VO.equals(uiType)){// 数据展示用途
      dtos=new ArrayList<>(GlobalData.getSaveDtos().values());
    }else if(VCT.ITEM_TYPE.REQ.equals(uiType)){ //数据查询用途
      dtos=new ArrayList<>(GlobalData.getReqDtos().values());
    }
    if(!VCT.ITEM_TYPE.REQ.equals(uiType)){
      dtos.addAll(new ArrayList<>(entitys));
    }
    return service.getFormsByUiType(uiType,dtos);
  }

  /**
   * 查询指定模型信息
   * @param uiType
   * @param modelName
   * @return
   */
  @GetMapping("/model")
  public FormVo model(String uiType, String modelName){
    VlifeQuery<Form> request=new VlifeQuery(Form.class);
    request.qw(Form.class).eq("uiType",uiType).eq("type",modelName);
    List<FormVo> published=service.query(FormVo.class,request);
    FormVo form=null;
    if(published!=null&&published.size()>0){
      form= published.get(0);
    }else{
      Collection<? extends BeanDto>  list=GlobalData.getEntityDtos().values();
      Optional<? extends BeanDto> dto= list.stream().filter(beanDto ->
              beanDto.getType().equalsIgnoreCase(modelName)).findAny();
      if(dto.isPresent()==false){
        if(VCT.ITEM_TYPE.LIST.equals(uiType)){//列表用途
          list=new ArrayList<>(GlobalData.getVoDtos().values());
        } else if(VCT.ITEM_TYPE.SAVE.equals(uiType)){//数据编辑用途
          list=new ArrayList<>(GlobalData.getSaveDtos().values());
        }else if(VCT.ITEM_TYPE.VO.equals(uiType)){// 数据展示用途
          list=new ArrayList<>(GlobalData.getSaveDtos().values());
        }else if(VCT.ITEM_TYPE.REQ.equals(uiType)){ //数据查询用途
          list=new ArrayList<>(GlobalData.getReqDtos().values());
        }
        dto= list.stream().filter(beanDto ->
                beanDto.getType().equalsIgnoreCase(modelName)).findAny();
      }
      if(dto.isPresent()){
        form= service.tran(dto.get(),uiType);
      }
    }
    /**
     * 对机构/地区/部门的查询组件与查询权限范围进行对比，最多选出一个符合的组件展示
     */
    if(uiType.equals("req")){
      form=service.reqModelFilter(form);
    }
     return form;
  }

  /**
   * 已经发布的
   * @return
   */
  @RequestMapping("/published")
  public List<FormDto> published(){
    return service.queryAll(FormDto.class);
  }

  /**
   * 保存列表字段;
   * @param dto 列表字段;
   * @return 列表字段;
   */
  @PostMapping("/save/formDto")
  public FormVo save(@RequestBody FormDto dto) {
   String id=service.save(dto,true).getId();
   FormVo vo= service.queryOne(FormVo.class,id);
   return vo;
  }

  /**
   * 保存列表字段;
   * @param dto 列表字段;
   * @return 列表字段;
   */
  @PostMapping("/save")
  public Form save(@RequestBody Form dto) {
    return service.save(dto);
  }

  /**
   * 明细查询列表字段;
   * @param id null;
   * @return 列表字段;
   */
  @GetMapping("/detail/{id}")
  public Form detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 逻辑删除;
   * @param id null;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }
}
