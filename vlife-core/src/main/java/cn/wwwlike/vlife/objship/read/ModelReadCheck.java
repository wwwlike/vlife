/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.vlife.objship.read;

import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.base.FieldInfo;
import cn.wwwlike.vlife.objship.base.ItemInfo;
import cn.wwwlike.vlife.objship.dto.*;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 模型关系读取&校验
 * 加载到全局缓存池里
 */
@Getter
public class ModelReadCheck {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    private  List<EntityDto> itemDtos = null;
    private  List<VoDto> voDtos = null;
    private  List<ReqDto> reqDtos = null;
    private  List<SaveDto> saveDtos=null;


    public BeanDto find(String beanName){
        if(itemDtos!=null){
           Optional obj=itemDtos.stream().filter(t->t.getType().equals(beanName)).findFirst();
           if(obj.isPresent()){
               return (BeanDto) obj.get();
           }
        }
        if(voDtos!=null){
            Optional obj=voDtos.stream().filter(t->t.getType().equals(beanName)).findFirst();
            if(obj.isPresent()){
                return (BeanDto) obj.get();
            }
        }
        if(reqDtos!=null){
            Optional obj=reqDtos.stream().filter(t->t.getType().equals(beanName)).findFirst();
            if(obj.isPresent()){
                return (BeanDto) obj.get();
            }
        }
        if(saveDtos!=null){
            Optional obj=saveDtos.stream().filter(t->t.getType().equals(beanName)).findFirst();
            if(obj.isPresent()){
                return (BeanDto) obj.get();
            }
        }
        return null;
    }

    /**
     * 从项目根路径开始读取类信息
     */
    public Integer load(ClassLoader loader) {
        return load(loader,"");
    }
    /**
     * 返回异常错误数量
     */
    public Integer load(ClassLoader loader,String path) {
        List<String> list = ItemReadTemplate.readPackage(loader,path);
        logger.info("读取Java类数量："+list.size());
        Integer errorNum=0;
        try {
            GlobalData.clear();
            /** step1 模型信息读取 */
            EntityRead read = EntityRead.getInstance();
            itemDtos = read.read(loader, list);
            GlobalData.save(itemDtos);
            VoRead voRead = VoRead.getInstance(itemDtos);
            voDtos = voRead.read(loader, list);
            GlobalData.save(voDtos);
            ReqRead reqRead = ReqRead.getInstance(itemDtos);
            reqDtos = reqRead.read(loader, list);
            GlobalData.save(reqDtos);
            SaveRead saveRead = SaveRead.getInstance(itemDtos);
            saveDtos = saveRead.read(loader, list);
            GlobalData.save(saveDtos);
            //两个for 处理缓存读取时有时为空的问题
            for(VoDto d:voDtos){
                d.getLeftPathClz();
            }
            for(ReqDto d:reqDtos){
                d.getLeftPathClz();
            }
            /** step1 模型分析; 注解信息校验(待处理) */
            errorNum=errInfo(itemDtos, voDtos, reqDtos, saveDtos);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return errorNum;
    }

//    /**
//     * 单独检查vo是否存同时存在对象注入以及该对象的数据打平
//     * @param dto
//     * @return
//     */
//    public Integer checkVoRepeat(VoDto dto){
//        List<FieldDto> fields=dto.getFields();
//        /* field里有关联的类信息*/
//        Set<Class> clzSet=fields.stream().map(FieldDto::getEntityClz).collect(Collectors.toSet());
//        int err=0;
//        for(Class clz:clzSet){
//            if(clz!=dto.getEntityClz()){
//                List<FieldDto> filterFields=fields.stream().filter(f->f.getEntityClz()==clz).collect(Collectors.toList());
//                if(filterFields.size()>1){
////                    String typeNum=null;
//                    Map<List,String> map=new HashMap<>();
//                    for(FieldDto field:filterFields){
//                        //存在一种类型，多种路径到达的形式，那么需要分别讨论
//                        if(map.get(field.getQueryPath())==null){
//                            map.put(field.getQueryPath(),field.getType());
//                        }else if(!map.get(field.getQueryPath()).equals(field.getType())){
//                            logger.error("[" + dto.getClass().getSimpleName() + "]" + field.getItemDto().getClz().getSimpleName() + "模型里注入的[" + clz.getSimpleName()+"]存在字段注入和类型注入两种情况，请选择一种方式进行");
//                            err++;
//                            break;
//                        }
//                    }
//                }
//            }
//        }
//        return err;
//    }

    /**
     * 检查字段
     * 1. 必填信息是否存在判断（fieldType,entityClz）
     * 2. 字段类型用法是否恰当
     * @param fieldDto
     */
    public boolean checkField(BeanDto table, FieldDto fieldDto) {
        final Boolean checkFailed=false;
        final String tableName = table.getClass().getSimpleName() ;
        if (fieldDto.getFieldType() == null || fieldDto.getEntityClz() == null) {
            logger.error("["+tableName+"]"+fieldDto.getItemDto().getClz().getSimpleName() + "模型的[" + fieldDto.getFieldName() + "<"+fieldDto.getClz().getSimpleName()+">]无法匹配");
            return checkFailed;
        }
        if (fieldDto.getFieldType().equals(VCT.ITEM_TYPE.BASIC)) {
            if (fieldDto.getEntityFieldName() == null || fieldDto.getQueryPath() == null) {
                logger.error("[" + tableName + "]" + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段没有找到匹配的实体字段");
                return checkFailed;
            }
            /*简单类型，查询路径里有外键(LIST)*/
            if(table instanceof VoDto  || table instanceof SaveDto){
                for (Object path : fieldDto.getQueryPath()){
                    if (path instanceof List) {
                        logger.error("[" + tableName + "]" + fieldDto.getItemDto().getClz().getSimpleName() + "模型的[" + fieldDto.getFieldName() + "]类型应该为集合List<" + fieldDto.getClz().getSimpleName() + ">");
                        return checkFailed;
                    }
                }
            }
        } else { //可能是对象也可能是LIst
            if (fieldDto.getQueryPath() == null || fieldDto.queryPathName() == null) {
                logger.error("["+tableName+"]" + fieldDto.getItemDto().getClz().getSimpleName() + "模型的" + fieldDto.getFieldName() + "查询路径没有找到，请检查字段名称、字段类型是否准确");
                return checkFailed;
            }else if (table instanceof VoDto || table instanceof SaveDto){
                /* 存在 vo,save段的queryPathName是对的，修饰字段的类型存在写反的情况 */
                if(fieldDto.getFieldType().equals(VCT.ITEM_TYPE.LIST)&&iocFieldSholudList(fieldDto.getQueryPath())==false){
                    logger.error("[" + tableName + "]" + fieldDto.getItemDto().getClz().getSimpleName() + "模型的[" + fieldDto.getFieldName() +"]不应该是List<" + fieldDto.getClz().getSimpleName() + ">");
                    return checkFailed;
                }else if(!fieldDto.getFieldType().equals(VCT.ITEM_TYPE.LIST) &&
                       iocFieldSholudList(fieldDto.getQueryPath())){
                        logger.error("[" + tableName + "]" + fieldDto.getItemDto().getClz().getSimpleName() + "模型的[" + fieldDto.getFieldName() + "]应该是List<" + fieldDto.getClz().getSimpleName() + ">");
                        return checkFailed;
                }
            }
            /* 注入的是对象，且有下划线 */
//            if (IdBean.class.isAssignableFrom(fieldDto.getClz()) && fieldDto.queryPathName().indexOf("_") != -1) {
//                String queryName = fieldDto.queryPathName();
//                int _size = queryName.split("_").length - 1;
//                int __length = queryName.split("__").length - 1;
//                String fieldType = fieldDto.getFieldType();
//                if (_size == __length * 2) {/* 无单下划线，都是双下划线 */
//                    if (VCT.ITEM_TYPE.LIST.equals(fieldType)) {
//                        logger.error("["+tableName+"]" + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段应该为object");
//                        return checkFailed;
//                    }
//                } else if (!VCT.ITEM_TYPE.LIST.equals(fieldType)) {
//                    logger.error("["+tableName+"]" + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段应该为list");
//                    return checkFailed;
//                }
//            }
        }
        return true;
    }

    /**
     *  通过queryPath计算ioc注入对象应该是LIST or 单个类型
     * @param queryPath
     * @return
     */
    private boolean iocFieldSholudList(List queryPath){
        Object lastType=queryPath.get(queryPath.size()-1);
        /* 数量大于三，说明第2个不是list**/
        if(queryPath.size()>=3 ||lastType instanceof List==false){
            return true;
        }else if(queryPath.size()==2&&((List)lastType).size()>1){
            return iocFieldSholudList((List)lastType );
        }else if(((List)lastType).size()==1){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 所有模型信息传入进行校验
     */
    public Integer errInfo(List<? extends BeanDto>... beanDtos) {
        Integer errorNum = 0;
        for (List<? extends BeanDto> list : beanDtos) {
            for (BeanDto beanDto : list) {
                if (beanDto instanceof NotEntityDto) {
                    if(((NotEntityDto) beanDto).getEntityClz()==null){
                        errorNum+=1;
                        logger.error("[model] "+beanDto.getType()+" require write <Item>");
                    }
                }
                List<FieldDto> fieldDtos = beanDto.getFields();
                if (fieldDtos != null) {
                    for (FieldDto fieldDto : fieldDtos) {
                        //没有注解，或者注解里不跳过则进行数据有效性检查
                        if(fieldDto.getVField()==null|| fieldDto.getVField().skip()==false) {
                            errorNum = (checkField(beanDto, fieldDto) == false) ? errorNum + 1 : errorNum;
                        }
                    }
                }
                if(beanDto instanceof VoDto){
                }
            }
        }
        return errorNum;
    }



    /**
     *  数据持久化(目前未采用)
     */
    public void save(List<? extends BeanDto>... beanDtos) {
        for (List<? extends BeanDto> list : beanDtos) {
            for (BeanDto entityDto : list) {
                ItemInfo info = new ItemInfo();
                BeanUtils.copyProperties(entityDto, info);
                List<FieldDto> fieldDtos = entityDto.getFields();
                for (FieldDto fieldDto : fieldDtos) {
                    FieldInfo fieldInfo = new FieldInfo();
                    BeanUtils.copyProperties(fieldDto, fieldInfo);
                }
            }
        }
    }
}
