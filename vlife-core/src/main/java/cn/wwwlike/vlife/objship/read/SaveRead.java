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

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.SaveDto;
import cn.wwwlike.vlife.utils.GenericsUtils;
import java.util.List;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.BASIC;

/**
 * 视图层dto对象
 */
public class SaveRead extends ItemReadTemplate<SaveDto> {
    private static SaveRead INSTANCE = null;

    private SaveRead(List<EntityDto> info) {
        this.infos = info;
    }

    public static SaveRead getInstance(List<EntityDto> info) {
        if (INSTANCE == null) {
            INSTANCE = new SaveRead(info);
        }
        return INSTANCE;
    }

    /**
     * 读取一vo类的信息
     *
     * @param s
     * @return
     */
    public SaveDto readInfo(Class s) {
        SaveDto dto = null;
        if (SaveBean.class.isAssignableFrom(s) &&s != SaveBean.class) {
                dto = new SaveDto();
            superRead(dto, s);
            dto.setItemType(VCT.MODEL_TYPE.DTO);
            Class entityClz = GenericsUtils.getGenericType(s);
            if (entityClz == null || !Item.class.isAssignableFrom(entityClz)) {
                dto.setState(VCT.ITEM_STATE.ERROR);
            } else {
                dto.setEntityClz(entityClz);
                dto.setEntityType(entityClz.getSimpleName());
            }
        }
        return dto;
    }

    /**
     * save里注入的对象
     * 要么是 save对象，要么是基础数据对象,打平类型的不行
     */
    public void relation() {
        for (SaveDto item : readAll) {
            EntityDto entityDto = GlobalData.entityDto(item.getEntityClz());
            item.setEntityDto(entityDto);
            List<FieldDto> fkFields = entityDto.getFkFields();
            List<Class<? extends Item>> in = entityDto.getFkTableClz();
            for (FieldDto fieldDto : item.getFields()) {
                //把实体相同字段的field以下信息赋值给save
//                entityDto.fields.forEach(e->{
//                    if(e.getFieldName().equals(fieldDto.getFieldName())){
//                        fieldDto.setPathName(e.getPathName());
//                        fieldDto.setEntityClz(e.getEntityClz());
//                        fieldDto.setQueryPath(e.getQueryPath());
//                        fieldDto.setEntityType(e.getEntityType());
//                        fieldDto.setEntityFieldName(e.getEntityFieldName());
//                    }
//                });

                if (fieldDto.getEntityFieldName() == null) {
                    if (!BASIC.equals(fieldDto.getFieldType())) {
                        if (!IdBean.class.isAssignableFrom(fieldDto.getClz())) {
                            List queryPath = basicFieldMatch(item, fieldDto);
                            if (queryPath != null) {
                                fieldDto.setQueryPath(queryPath);
                            }
                        } else {
                            iocReverseMatch(fieldDto, entityDto);
                        }
                    }
                }
                syncDictCode(fieldDto);
            }
        }
        super.saveDtos=readAll;
    }

}
