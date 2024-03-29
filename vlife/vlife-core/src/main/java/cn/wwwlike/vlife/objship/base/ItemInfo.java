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

package cn.wwwlike.vlife.objship.base;

import lombok.Data;
import org.apache.commons.lang3.StringUtils;

/**
 * 类级别元素的基础字段信息
 */
public class ItemInfo extends ClazzInfo {
    /** 模型类型(ENTITY/REQ/SAVE/VO)*/
    public String itemType;
    /** 实体模型类型名称 */
    public String entityType;

    public String getItemType() {
        return itemType;
    }
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }
    public void setEntityType(String entityType) {
        this.entityType = StringUtils.uncapitalize(entityType);
    }
    public String getEntityType() {
        if (this.entityType != null)
            return StringUtils.uncapitalize(this.entityType);
        return null;
    }
}
