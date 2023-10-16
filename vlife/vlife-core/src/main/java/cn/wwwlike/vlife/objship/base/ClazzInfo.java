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

import cn.wwwlike.vlife.dict.VCT;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * 基础元素的basic信息
 */
@Data
public abstract class ClazzInfo {
    /** 元素中文信息 */
    public String title;
    /** 元素类型 */
    public String type;
    /** 类状态(删)*/
    @JsonIgnore
    public String state = VCT.ITEM_STATE.WAIT;

//    public String getTitle() {
//        return title==null?"实体"+type:title;
//    }
}


