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

import cn.wwwlike.base.model.IModel;
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.objship.dto.*;
import lombok.Data;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
            }
        }
    }

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
