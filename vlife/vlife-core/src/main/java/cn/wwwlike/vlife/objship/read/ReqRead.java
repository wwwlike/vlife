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
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.utils.GenericsUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.BASIC;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.REQ;

/**
 * 视图层dto对象
 * 外键表的上其他字段数据查询，外键表（1对多，多对多查询）
 * ??? 查询也需要支持 嵌套查询
 * IOC注入
 */
public class ReqRead extends ItemReadTemplate<ReqDto> {
    private static ReqRead INSTANCE = null;

    private ReqRead(List<EntityDto> info) {
        this.infos = info;
    }

    public static ReqRead getInstance(List<EntityDto> info) {
        if (INSTANCE == null) {
            INSTANCE = new ReqRead(info);
        }
        return INSTANCE;
    }

    /**
     * 读取一vo类的信息
     *
     * @param s
     * @return
     */
    public ReqDto readInfo(Class s) {
        ReqDto dto = null;
        if (BaseRequest.class.isAssignableFrom(s) && s != BaseRequest.class) {
            dto = new ReqDto();
            superRead(dto, s);
            dto.setItemType(REQ);
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
     * 对VO类field字段没有
     * 1. 打平字段的查找
     * -  外键对象直接打平
     * -  外键对象的关联直接打平
     * 2. 注入对象查找
     */
    public void relation() {
        for (ReqDto item : readAll) {
            EntityDto entityDto = GlobalData.entityDto(item.getEntityClz());
            item.setEntityDto(entityDto);
            if (item.getFields() != null) {
                for (FieldDto fieldDto : item.getFields()) {
                    //把实体相同字段的field以下信息赋值给req
//                    entityDto.fields.forEach(e->{
//                        if(fieldDto.getFieldType().equals("basic")&&
//                                e.getFieldName().equals(fieldDto.getFieldName())
//                                && !e.getPathName().equals(fieldDto.getPathName())
//                        ){
//                            fieldDto.setPathName(e.getPathName());
//                            fieldDto.setEntityClz(e.getEntityClz());
//                            fieldDto.setQueryPath(e.getQueryPath());
//                            fieldDto.setEntityType(e.getEntityType());
//                            fieldDto.setEntityFieldName(e.getEntityFieldName());
//                        }
//                    });

                    if (fieldDto.getEntityFieldName() == null) {
                        if (BASIC.equals(fieldDto.getFieldType())
                                || !IdBean.class.isAssignableFrom(fieldDto.getClz())) {
                            fieldDto.setQueryPath(basicFieldMatch(item, fieldDto));
                        }
                    }
                    syncDictCode(fieldDto);
                }
            }
        }
        super.reqDtos=readAll;
    }

}
