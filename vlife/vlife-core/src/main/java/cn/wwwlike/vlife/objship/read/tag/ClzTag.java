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

package cn.wwwlike.vlife.objship.read.tag;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 类注释信息
 */
@Data
public class ClzTag {
    /**
     * 直接父类
     */
    public String superName;
    /**
     * 父类集合
     */
    public List<String> parentsName;
    /**
     * 类名(应该是clz)
     */
    public String entityName;
    /**
     * 实体分类
     */
    public String typeName;
    /**
     * 类名称
     */
    public String title;
    /**
     * 访问路径
     */
    public String path;
    /**
     * 类字段信息
     */
    public Map<String, FieldTag> tags;

    public List<ApiTag> apiTagList=new ArrayList<>();

    public ClzTag() {
        this.tags = new HashMap<String, FieldTag>();
    }
}
