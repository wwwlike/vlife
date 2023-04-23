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
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.dict.Constants;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.base.FieldInfo;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.utils.GenericsUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.BASIC;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.VO;

/**
 * 视图层dto对象,savedto也是voDto
 * 需要校验注入得类也得是voBean或者entity
 */
public class VoRead extends ItemReadTemplate<VoDto> {
    private static VoRead INSTANCE = null;

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
        // savebean其实也是voBean
        if (VoBean.class.isAssignableFrom(s)  &&s != VoBean.class&& s != SaveBean.class) {
        dto = new VoDto();
        superRead(dto, s);
        dto.setItemType(VO);
        Class entityClz = GenericsUtils.getGenericType(s);
        if (entityClz == null || !Item.class.isAssignableFrom(entityClz)) {
//                dto.setState(VCT.ITEM_STATE.ERROR);
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

    /**
     * 1. 对VO类field字段无对应关系的字段进行关系查找
     * <p>
     * 1. 打平字段的查找
     * -  外键对象直接打平
     * -  外键对象的关联直接打平
     * 2. 注入对象查找
     * 3. VField里的dictCode同步
     * 4. VObean里关联查询必要字段缺失分析，写入到lose里
     */
    public void relation() {
        for (VoDto item : readAll) {
            EntityDto entityDto = GlobalData.entityDto(item.getEntityClz());
            item.setEntityDto(entityDto);
            List<FieldDto> fkFields = entityDto.getFkFields();
            List<Class<? extends Item>> in = entityDto.getFkTableClz();
            for (FieldDto fieldDto : item.getFields()) {
                entityDto.fields.forEach(e->{
//                    if(fieldDto.getFieldType().equals("basic")&&
//                            e.getFieldName().equals(fieldDto.getFieldName())
//                            && !e.getPathName().equals(fieldDto.getPathName())
//                    ){
//                        fieldDto.setPathName(e.getPathName());
//                        fieldDto.setEntityClz(e.getEntityClz());
//                        fieldDto.setQueryPath(e.getQueryPath());
//                        fieldDto.setEntityType(e.getEntityType());
//                        fieldDto.setEntityFieldName(e.getEntityFieldName());
//                    }
                });

                if (fieldDto.getEntityFieldName() == null) {
                    if (BASIC.equals(fieldDto.getFieldType())
                            || !IdBean.class.isAssignableFrom(fieldDto.getClz())) {
                        List queryPath = basicFieldMatch(item, fieldDto);
                        if (queryPath != null) {
                            fieldDto.setQueryPath(queryPath);
                        }
                    } else {
                        iocReverseMatch(fieldDto, entityDto);
                    }
                }
                syncDictCode(fieldDto);
            }
            List<String> loseStr = fkFields.stream().filter(fieldDto -> {
                return item.getFields().stream().filter(voField -> {
                    return fieldDto.getFieldName().equals(voField.getEntityFieldName());
                }).count() == 0;
            }).map(FieldInfo::getFieldName).collect(Collectors.toList());
            for (int i = 0; i < loseStr.size(); i++) {
                item.getLoseIds().put(loseStr.get(i), i);
            }
        }
        super.voDtos=readAll;
    }
}