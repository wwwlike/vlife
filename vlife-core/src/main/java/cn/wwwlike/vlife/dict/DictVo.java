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

package cn.wwwlike.vlife.dict;

import lombok.Data;

/**
 * 字典解析转换成vo输出
 */
@Data
public class DictVo {
    public String code;
    public String val;
    public String title;
    public Integer level;
    public Integer  sort;

    public DictVo(String code, String val, String title,Integer level,Integer sort) {
        this.code = code;
        this.val = val;
        this.title = title;
        this.level=level;
        this.sort=sort;
    }

    public DictVo(String code, String title,Integer level) {
        this.code = code;
        this.title = title;
        this.level=level;
    }

}
