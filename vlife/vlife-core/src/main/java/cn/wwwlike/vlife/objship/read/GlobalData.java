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

import cn.wwwlike.vlife.base.IModel;
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.*;
import lombok.Data;
import lombok.Getter;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 全局开放实体类的数据信息
 */
@Data
@Getter
public class GlobalData {
    private static final Map<Class, SaveDto> saves = new HashMap<>();
    private static final Map<Class, EntityDto> entitys = new HashMap<>();
    private static final Map<Class, VoDto> vos = new HashMap<>();
    private static final Map<Class, ReqDto> reqs = new HashMap<>();
    private static final Map<Class, BeanDto> beans = new HashMap<>();

    public static Map<Class, EntityDto> getEntityDtos() {
        return entitys;
    }
    public static Map<Class, VoDto> getVoDtos() {
        return vos;
    }
    public static Map<Class, ReqDto> getReqDtos() {
        return reqs;
    }
    public static Map<Class, SaveDto> getSaveDtos() {
        return saves;
    }
    public static Map<Class, BeanDto> getBeanDtos() {
        return beans;
    }

    public static void clear(){
        saves.clear();
        entitys.clear();
        vos.clear();
        reqs.clear();
        beans.clear();
    }

    public static <T extends BeanDto> void save(List<T> dtos) {
        for (T dto : dtos) {
            if (dto instanceof SaveDto) {
                saves.put(dto.getClz(), (SaveDto) dto);
            } else if (dto instanceof VoDto) {
                vos.put(dto.getClz(), (VoDto) dto);
            } else if (dto instanceof EntityDto) {
                entitys.put(dto.getClz(), (EntityDto) dto);
            } else if (dto instanceof ReqDto) {
                reqs.put(dto.getClz(), (ReqDto) dto);
            }else if (dto instanceof BeanDto) {
                beans.put(dto.getClz(), (BeanDto) dto);
            }
        }
    }

    /**
     * 所有的模型信息
     * @return
     */
    public static List<? extends BeanDto> allModels(){
        List<BeanDto> all=new ArrayList<>();
        all.addAll(getEntityDtos().values());
        all.addAll(getReqDtos().values());
        all.addAll(getSaveDtos().values());
        //排除vo里的saveDto
        all.addAll( getVoDtos().values().stream().filter(bean->!all.stream().map(t->t.getType()).collect(Collectors.toList()).contains(bean.getType())).collect(Collectors.toList()));
        //基础模型
        all.addAll(getBeanDtos().values());
        return all;
    }

    /**
     * 查找指定模型信息
     * @param clazz
     * @param <T>
     * @param <D>
     * @return
     */
    public static <T extends IModel,D extends BeanDto<T>> D get(Class<T> clazz) {
        if (SaveBean.class.isAssignableFrom(clazz)) {
            return (D) saveDto((Class<? extends SaveBean>) clazz);
        } else if (VoBean.class.isAssignableFrom(clazz)) {
            return (D) voDto((Class<? extends VoBean>) clazz);
        } else if (BaseRequest.class.isAssignableFrom(clazz)) {
            return (D) reqDto((Class<? extends BaseRequest>) clazz);
        } else if (Item.class.isAssignableFrom(clazz)) {
            return (D) entityDto((Class<? extends Item>) clazz);
        }
        return null;
    }


    public static BeanDto findModel(String modelName) {
            return findBeanDtoByName(null,modelName);
    }
    /**
     * 根据名称查找模型信息
     * @param itemType 模型类别
     * @param modelName 模型标识
     * @return
     */
    public static BeanDto findBeanDtoByName(String itemType,String modelName) {
        Collection<? extends BeanDto> list=null;
        if (VCT.ITEM_TYPE.SAVE.equals(itemType)) {//数据编辑用途
            list =GlobalData.getSaveDtos().values();
        } else if (VCT.ITEM_TYPE.VO.equals(itemType)) {// 数据展示用途
            list = GlobalData.getVoDtos().values();
        } else if (VCT.ITEM_TYPE.REQ.equals(itemType)) { //数据查询用途
            list = GlobalData.getReqDtos().values();
        }else if(VCT.ITEM_TYPE.ENTITY.equals(itemType)){
            list = GlobalData.getEntityDtos().values();
        }else if(VCT.ITEM_TYPE.BEAN.equals(itemType)){
            list = GlobalData.getBeanDtos().values();
        }else if(itemType==null){
            String[] itemTypes={VCT.ITEM_TYPE.REQ,VCT.ITEM_TYPE.SAVE,VCT.ITEM_TYPE.ENTITY,VCT.ITEM_TYPE.VO,VCT.ITEM_TYPE.BEAN};
            for(String itemTypeTemp:itemTypes){
                BeanDto beanDto=findBeanDtoByName(itemTypeTemp,modelName);
                if(beanDto!=null){
                    return beanDto;
                }
            }
        }
        if(list!=null){
            Optional<? extends BeanDto> dto = list.stream().filter(beanDto ->
                    beanDto.getType().equalsIgnoreCase(modelName)).findAny();
            if(dto.isPresent()){
                return dto.get();
            }
        }
        return null;

    }

    public static EntityDto entityDto(Class<? extends Item> entityClz) {
        EntityDto entityDto = entitys.get(entityClz);
        return entityDto;
    }

    public static EntityDto entityDto(String entityClzStr) {
        Set<Class> set = entitys.keySet();
        for (Class clz : set) {
            if (clz.getSimpleName().equalsIgnoreCase(entityClzStr)) {
                return entityDto((clz));
            }
        }
        return null;
    }

    public static VoDto voDto(Class<? extends VoBean> dtoClz) {
        VoDto dto = vos.get(dtoClz);
        return dto;
    }

    public static ReqDto reqDto(Class<? extends BaseRequest> reqClz) {
        ReqDto dto = reqs.get(reqClz);
        return dto;
    }

    public static SaveDto saveDto(Class<? extends SaveBean> saveClz) {
        SaveDto dto = saves.get(saveClz);
        return dto;
    }


}
