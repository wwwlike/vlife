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

package cn.wwwlike.autoconfiguration.init;

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.base.FieldInfo;
import cn.wwwlike.vlife.objship.base.ItemInfo;
import cn.wwwlike.vlife.objship.dto.*;
import cn.wwwlike.vlife.objship.read.*;
import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 关系加载
 */
public class LoadRelation {
    List<String> error = new ArrayList<>();
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    public void load(String path) {
        List<String> list = ItemReadTemplate.readPackage(path);
        try {
            ClassLoader loader = Thread.currentThread().getContextClassLoader();

            EntityRead read = EntityRead.getInstance();
            List<EntityDto> itemDtos = read.read(loader, list);
            GlobalData.save(itemDtos);

            VoRead voRead = VoRead.getInstance(itemDtos);
            List<VoDto> voDtos = voRead.read(loader, list);
            GlobalData.save(voDtos);

            ReqRead reqRead = ReqRead.getInstance(itemDtos);
            List<ReqDto> reqDtos = reqRead.read(loader, list);
            GlobalData.save(reqDtos);

            SaveRead saveRead = SaveRead.getInstance(itemDtos);
            List<SaveDto> saveDtos = saveRead.read(loader, list);
            GlobalData.save(saveDtos);
            errInfo(itemDtos, voDtos, reqDtos, saveDtos);
            for (String str : error) {
                logger.error(str);
            }
            if(error.size()>0){

            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    /**
     * 检查类
     *
     * @param reqDto
     */
    public void check(ReqVoDto reqDto) {
        if (reqDto.getEntityClz() == null) {
            error.add(reqDto.getClz().getSimpleName());
        }
    }

    /**
     * 检查字段
     *
     * @param fieldDto
     */
    public void check(BeanDto table, FieldDto fieldDto) {
        String tableName = table.getClass().getSimpleName() + "__";
        if (fieldDto.getFieldType() == null || fieldDto.getEntityClz() == null) {
            error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "__" + fieldDto.getFieldName() + "找不到实体类和字段");
            return;
        }
        if (fieldDto.getFieldType().equals(VCT.ITEM_TYPE.BASIC)) {
            if (fieldDto.getEntityFieldName() == null || fieldDto.getQueryPath() == null) {
                error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "__" + fieldDto.getFieldName() + "没有找到匹配的字段");
                return;
            }
        } else {
            if (fieldDto.getQueryPath() == null || fieldDto.queryPathName() == null) {
                error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "__" + fieldDto.getFieldName() + "的查询路径没有找到，请先检查类型设置是否准确");
                return;
            }

            if (IdBean.class.isAssignableFrom(fieldDto.getClz()) && fieldDto.queryPathName().indexOf("_") != -1) {
                String queryName = fieldDto.queryPathName();
                int _size = queryName.split("_").length - 1;
                int __length = queryName.split("__").length - 1;
                String fieldType = fieldDto.getFieldType();
                if (_size == __length * 2) {
                    if (VCT.ITEM_TYPE.LIST.equals(fieldType)) {
                        error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段应该为object");
                    }
                } else if (!VCT.ITEM_TYPE.LIST.equals(fieldType)) {
                    error.add(tableName + fieldDto.getItemDto().getClz().getSimpleName() + "的" + fieldDto.getFieldName() + "字段应该为list");
                }

            }
        }
    }

    public void errInfo(List<? extends BeanDto>... beanDtos) {
        for (List<? extends BeanDto> list : beanDtos) {
            for (BeanDto entityDto : list) {
                if (entityDto instanceof ReqVoDto) {
                    check((ReqVoDto) entityDto);
                }
                List<FieldDto> list2 = entityDto.getFields();
                if (list2 != null) {
                    for (FieldDto dto1 : list2) {
                        check(entityDto, dto1);
                    }
                }
            }
        }
    }


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
