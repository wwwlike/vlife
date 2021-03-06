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

package cn.wwwlike.vlife.objship.dto;

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.utils.VlifeUtils;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * req和VO类型dto基类
 *
 * @param <T>
 */
@Data
public abstract class ReqVoDto<T> extends BeanDto<T> implements NotEntityDto {
    /**
     * 对应实体类clazz
     */
    public Class<? extends Item> entityClz;
    /**
     * 所有打平字段的查询路径
     */
    public List<List<Class<? extends Item>>> leftPathClz;
    /**
     * 对应的实体类信息
     */
    public EntityDto entityDto;

    /**
     * req vo 里进行字段查询，条件查询会左leftjoin连接的表集合
     */
    public List<List<Class<? extends Item>>> getLeftPathClz() {
        if (leftPathClz == null) {
            leftPathClz = new ArrayList<>();
            List<FieldDto> fields = getFields();
            for (FieldDto field : fields) {
                if (VCT.ITEM_TYPE.BASIC.equals(field.getFieldType())) {
                    leftPathClz = VlifeUtils.addItemClzArray(leftPathClz, field.leftJoinPath());
                }
            }
        }
        return leftPathClz;
    }

}


