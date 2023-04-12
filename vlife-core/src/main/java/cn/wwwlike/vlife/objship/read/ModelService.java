package cn.wwwlike.vlife.objship.read;

import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 模型服务
 */
public class ModelService {

    /**
     * 返回指定类型模型的解析信息
     * @param modelType
     * @return
     */
    public  static List<BeanDto> typeModels(String  modelType){
        if (VCT.ITEM_TYPE.ENTITY.equals(modelType)) {//数据编辑用途
            return  new ArrayList<>(GlobalData.getEntityDtos().values());
        } else if (VCT.ITEM_TYPE.VO.equals(modelType)) {// 数据展示用途
             return  new ArrayList<>(GlobalData.getSaveDtos().values());
        } else if (VCT.ITEM_TYPE.REQ.equals(modelType)) { //数据查询用途
           return  new ArrayList<>(GlobalData.getReqDtos().values());
        }else if (VCT.ITEM_TYPE.SAVE.equals(modelType)) { //数据查询用途
             return  new ArrayList<>(GlobalData.getSaveDtos().values());
        }
        return null;
    }

    /**
     * 返回指定实体的关联类型的模型信息；itemType为空则查询entity关联到的各种模型；包涵外键和关联表
     * @param entityType //指定关联实体类型
     * @param itemType //指定模型
     * @return
     */
    public  static List<BeanDto> typeEntityModels(String entityType,String itemType){
        List<BeanDto> dtos=new ArrayList<>();
        List<BeanDto> volist=new ArrayList<>(GlobalData.getVoDtos().values().stream().filter(saveDto -> saveDto.getEntityType().equals(entityType)).collect(Collectors.toList()));
        List<BeanDto> reqList=new ArrayList<>(GlobalData.getReqDtos().values().stream().filter(saveDto -> saveDto.getEntityType().equals(entityType)).collect(Collectors.toList()));
        List<BeanDto> dtoList=new ArrayList<>(GlobalData.getSaveDtos().values().stream().filter(saveDto -> saveDto.getEntityType().equals(entityType)).collect(Collectors.toList()));
        EntityDto self=GlobalData.entityDto(entityType);
        List<BeanDto> relationList=self.getRelationTableClz().stream().map(clz->GlobalData.entityDto(clz)).collect(Collectors.toList()); //关联实体
        List<BeanDto> fkTableList=self.getFkTableClz().stream().map(clz->GlobalData.entityDto(clz)).collect(Collectors.toList());
        if (VCT.ITEM_TYPE.VO.equals(itemType)) {// 数据展示用途
            return volist;
        }else if (VCT.ITEM_TYPE.REQ.equals(itemType)) { //数据查询用途
            return reqList;
        }else  if (VCT.ITEM_TYPE.SAVE.equals(itemType)) { //数据查询用途
            return dtoList;
        }else  if (VCT.ITEM_TYPE.FK.equals(itemType)) { //数据查询用途
            return fkTableList;
        }else  if (VCT.ITEM_TYPE.Relation.equals(itemType)) { //数据查询用途
            return relationList;
        }else if (itemType==null){
            dtos.addAll(volist);
            dtos.addAll(reqList);
            dtos.addAll(dtoList);
            dtos.add(self);
            dtos.addAll(fkTableList);
            dtos.addAll(relationList);
        }
        return dtos;
    }




}
