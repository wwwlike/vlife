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

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.query.DataExpressTran;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.LIST;

/**
 * 所有bean的字段信息读取
 */
public class FieldRead implements Read {
    private FieldDto dto = null;
    private List<FieldDto> ids = new ArrayList<>();

    public static FieldRead getInstance() {
        return FieldReadInstance
                .INSTANCE;
    }

    /**
     * 查找field字段在实体类里对应的字段
     * 字段结尾有下划线_  字段中路有下划线_
     *
     * @param itemClazz     查找的目标entity
     * @param findFieldName 要查找的字段
     * @return
     */
    public static Field match(Class itemClazz, String findFieldName) {
        if (findFieldName.endsWith("$")) {
            findFieldName = findFieldName.substring(0, findFieldName.length() - 1);
        }
        Field eqF = ReflectionUtils.getAccessibleFieldByClass(itemClazz, findFieldName);
        if (eqF != null) {
            return eqF;
        }


        Field[] fields = itemClazz.getFields();
        for (Field f : fields) {
            String fieldName = f.getName();
            if (fieldName.endsWith("$")) {
                fieldName = fieldName.substring(0, fieldName.length() - 1);
            }
            String entityName = itemClazz.getSimpleName();

            if (fieldName.equalsIgnoreCase(findFieldName)) {
                return f;
            }

            if ((entityName + fieldName).equalsIgnoreCase(findFieldName)) {
                return f;
            }

            if (fieldName.equalsIgnoreCase(entityName + findFieldName)) {
                return f;
            }
        }
        return null;
    }

    public <DTO extends BeanDto> FieldDto read(Field field, DTO itemDto) {
        dto = new FieldDto();
        dto.setItemDto(itemDto);
        dto.setFieldType(ItemReadTemplate.getClzType(field.getType()));
        dto.setFieldName(field.getName());
        if (!LIST.equals(dto.getFieldType())) {
            dto.setType(StringUtils.uncapitalize(field.getType().getSimpleName()));
            dto.setClz(field.getType());
            dto.setItemClz(itemDto.getClz());
        } else {
            Class clz = GenericsUtils.getFieldGenericType(field, 0);
            dto.setClz(clz);
            dto.setItemClz(itemDto.getClz());
            if (Object.class != clz) {
                dto.setType(StringUtils.uncapitalize(clz.getSimpleName()));
            } else {
                dto.setState(VCT.ITEM_STATE.ERROR);
            }
        }
        Class entityClz = itemDto.getClz();
        if (!Item.class.isAssignableFrom(entityClz)) {
            entityClz = GenericsUtils.getGenericType(entityClz);

        }
        if (itemDto instanceof ReqDto) {
            setFiledDefaultFilterType(dto);
        }
        VField f = field.getAnnotation(VField.class);

        Field mapField = null;
        if (f != null) {
            dto.setVField(f);
            if (f.tran() != DataExpressTran.class) {
                try {
                    dto.setTran(f.tran().newInstance());
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
            if (StringUtils.isNotBlank(f.pathName())) {
                dto.setPathName(f.pathName());
            }
            if (f.opt() != Opt.VOID) {
                dto.setOpt(f.opt());
            }
            if (StringUtils.isNotBlank(f.dictCode())) {
                dto.setDictCode(f.dictCode());
            }
            if (f.orders() != null) {
                dto.setOrders(f.orders());
            }
        }
        mapField = match(entityClz, dto.getPathName());
        if (mapField != null) {
            dto.setEntityClz(entityClz);
            dto.setQueryPath(entityClz);
            dto.setEntityType(StringUtils.uncapitalize(entityClz.getSimpleName()));
            dto.setEntityFieldName(mapField.getName());
        }
        return dto;
    }

    /**
     * 设置字段默认的查询方式
     */
    public void setFiledDefaultFilterType(FieldDto dto) {
        String type = dto.getFieldType();
        Class clz = dto.getClz();
        if (type.equals(LIST)) {
            if (clz == Date.class || clz == Double.class || clz == Integer.class || clz == Long.class) {
                dto.setOpt(Opt.between);
            } else {
                dto.setOpt(Opt.in);
            }
        } else {
            dto.setOpt(Opt.eq);
        }
    }

    /**
     * 单例方法
     */
    private static class FieldReadInstance {
        private static final FieldRead INSTANCE = new FieldRead();
    }


}
