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
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.Constants;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.utils.FileUtil;
import com.google.common.reflect.TypeToken;
import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.ENTITY;

/**
 * 数据库实体类读取
 */
public class EntityRead extends ItemReadTemplate<EntityDto> {
    private static String model = "publish";
    public static EntityRead getInstance() {
        EntityRead read= EntityReadInstance
                .INSTANCE;
        read.readTitleJson(model);
        return read;
    }

    public static EntityRead getPluginInstance() {
        EntityRead read = EntityReadPluginInstance
                .INSTANCE;
        read.model = "plugin";
        read.readTitleJson(model);
        return read;
    }

    /**
     * 基本信息读取
     * @param s
     * @return
     */
    public EntityDto readInfo(Class s) {
        if (Item.class.isAssignableFrom(s) && s != Item.class) {
            EntityDto dto = new EntityDto();
            superRead(dto, s);
            dto.setItemType(ENTITY);
            dto.setEntityType(s.getSimpleName());
            dto.setOrders(Constants.DEFAULT_ORDER_TYPE);
            VClazz f = (VClazz) s.getAnnotation(VClazz.class);
            if (f != null) {
                dto.deleteMap = new HashMap<>();
                if (f.remove() != null) {
                    Arrays.stream(f.remove()).forEach(clz -> {
                        dto.deleteMap.put(clz, VCT.DELETE_TYPE.REMOVE);
                    });
                }
                if (f.clear() != null) {
                    Arrays.stream(f.clear()).forEach(clz -> {
                        dto.deleteMap.put(clz, VCT.DELETE_TYPE.CLEAR);
                    });
                }
                if (f.nothing() != null) {
                    Arrays.stream(f.nothing()).forEach(clz -> {
                        dto.deleteMap.put(clz, VCT.DELETE_TYPE.NOTHING);
                    });
                }
                if (f.unableRm() != null) {
                    Arrays.stream(f.unableRm()).forEach(clz -> {
                        dto.deleteMap.put(clz, VCT.DELETE_TYPE.UNABLE);
                    });
                }
                if (f.orders() != null) {
                    dto.setOrders(f.orders());
                }
            }
            return dto;
        }
        return null;
    }

    public void relation() {
        for (EntityDto item : readAll) {
            List<FieldDto> fkFields = new ArrayList<>();
            if (!item.getState().equals(VCT.ITEM_STATE.ERROR)) {
                for (FieldDto fieldDto : item.getFields()) {
                    if (fieldDto.getPathName().endsWith("Id")) {
                        String type = fieldDto.getPathName().substring(0, fieldDto.getPathName().length() - 2);
                        readAll.forEach(entityDto -> {
                            if (entityDto.getType().equalsIgnoreCase(type)) {
                                fieldDto.setEntityClz(entityDto.getClz());
                                fieldDto.setEntityType(StringUtils.uncapitalize(entityDto.getClz().getSimpleName()));
                                fieldDto.setEntityFieldName("id");
                                fkFields.add(fieldDto);
                                item.getFkMap().put(fieldDto.getEntityClz(), fieldDto.getFieldName());
                                readAll.forEach(entityDto1 -> {
                                    if (entityDto1.clz == entityDto.getClz()) {
                                        entityDto1.getRelationFields().add(fieldDto);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            item.setFkFields(fkFields);
            for (FieldDto fkField : fkFields) {
                for (FieldDto fieldDto : item.getFields()) {
                    if (fieldDto.getPathName().startsWith(fkField.getEntityType())
                            && (!fieldDto.getPathName().endsWith("Id") && !fieldDto.getPathName().endsWith("id"))) {
                        Field matchF = FieldRead.match(fkField.getEntityClz(), fieldDto.getPathName());
                        if (matchF == null && fieldDto.getEntityFieldName() == null) {
                            fieldDto.setState(VCT.ITEM_STATE.ERROR);
                        }
                        if (matchF != null) {
                            fieldDto.setEntityClz(fkField.getEntityClz());
                            fieldDto.setEntityType(fkField.getEntityType());
                            fieldDto.setEntityFieldName(matchF.getName());
                        }
                    }
                }
            }
        }
        super.infos=readAll;
    }

    private static class EntityReadInstance {
        private static final EntityRead INSTANCE = new EntityRead();
    }
    private static class EntityReadPluginInstance {
        private static EntityRead INSTANCE = new EntityRead();
    }
}
