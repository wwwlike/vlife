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

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.dict.Constants;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.base.FieldInfo;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.utils.GenericsUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.BASIC;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.VO;

/**
 * 视图层dto对象
 * 需要校验注入得类也得是voBean或者entity
 */
public class VoRead extends ItemReadTemplate<VoDto> {
    private static VoRead INSTANCE = null;
    private final List<EntityDto> infos;

    private VoRead(List<EntityDto> info) {
        this.infos = info;
    }

    public static VoRead getInstance(List<EntityDto> info) {
        if (INSTANCE == null) {
            INSTANCE = new VoRead(info);
        }
        return INSTANCE;
    }

    /**
     * 读取vo类的信息
     */
    public VoDto readInfo(Class s) {
        VoDto dto = null;
        if (VoBean.class.isAssignableFrom(s) && s != VoBean.class) {
            dto = new VoDto();
            superRead(dto, s);
            dto.setItemType(VO);
            Class entityClz = GenericsUtils.getGenericType(s);
            if (entityClz == null || !Item.class.isAssignableFrom(entityClz)) {
                dto.setState(VCT.ITEM_STATE.ERROR);
            } else {

                dto.setEntityClz(entityClz);
                dto.setEntityType(entityClz.getSimpleName());
            }
            dto.setOrders(Constants.DEFAULT_ORDER_TYPE);
            VClazz f = (VClazz) s.getAnnotation(VClazz.class);
            if (f != null) {
                if (f.orders() != null) {
                    dto.setOrders(f.orders());
                }
            }
        }
        return dto;
    }

    @Override
    public VoDto finished(VoDto voDto) {
        voDto.setTitle(voDto.getEntityDto().getTitle() + "VO");
        voDto.getFields().stream().forEach(f -> {
            infos.stream().forEach(entityDto -> {
                if (f.getEntityClz() != null && entityDto.getClz() == f.getEntityClz()) {
                    if (f.getEntityFieldName() != null) {
                        Optional<FieldDto> optionalFieldDto = entityDto.getFields().stream().filter(ff -> {
                            return ff.getEntityFieldName().equals(f.getEntityFieldName()) && ff.getEntityClz() == f.getEntityClz();
                        }).findFirst();
                        if (optionalFieldDto.isPresent()) {
                            f.setTitle(optionalFieldDto.get().getTitle());
                        }
                    } else {
                        f.setTitle(entityDto.getTitle());
                    }
                }
            });
        });
        return voDto;
    }

    /**
     * 对VO类field字段无对应关系的字段进行处理
     * <p>
     * 1. 打平字段的查找
     * -  外键对象直接打平
     * -  外键对象的关联直接打平
     * 2. 注入对象查找
     */
    public void relation() {
        for (VoDto item : readAll) {
            EntityDto entityDto = GlobalData.entityDto(item.getEntityClz());
            item.setEntityDto(entityDto);
            List<FieldDto> fkFields = entityDto.getFkFields();
            List<Class<? extends Item>> in = entityDto.getFkTableClz();
            for (FieldDto fieldDto : item.getFields()) {
                if (fieldDto.getEntityFieldName() == null) {
                    if (BASIC.equals(fieldDto.getFieldType()) || !IdBean.class.isAssignableFrom(fieldDto.getClz())) {
                        List queryPath = basicFieldMatch(item, fieldDto);
                        if (queryPath != null) {
                            fieldDto.setQueryPath(queryPath);
                        }
                    } else {
                        iocReverseMatch(fieldDto, entityDto);
                    }
                }
            }
            List<String> loseStr = fkFields.stream().filter(fieldDto -> {
                return item.getFields().stream().filter(voField -> {
                    return fieldDto.getFieldName().equals(voField.getEntityFieldName());
                }).count() == 0;
            }).map(FieldInfo::getFieldName).collect(Collectors.toList());
            for (int i = 0; i < loseStr.size(); i++) {
                item.getLoseIds().put(loseStr.get(i), i);
            }
            finished(item);
        }
    }

}
