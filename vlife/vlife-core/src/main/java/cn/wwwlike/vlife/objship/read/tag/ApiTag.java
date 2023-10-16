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

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/8/26
 */
@Data
public class ApiTag {
    /**
     * 函数名
     */
    public String title;
    /**
     * 接口路径
     */
    public String path;

    /**
     * 入参包装类型
     */
    public String paramWrapper;

    /**
     * 入参名称
     */
    public String param;
    /**
     * 出参包装类型
     */
    public String returnWrapper;
    /**
     * 出参类型
     */
    public String returnClz;
    /**
     * 请求方式
     */
    public String methodType;
    /**
     * 入参是否存在于path里
     */
    public Boolean pathParams;
    /**
     * 方法名称
     */
    public String methodName;
}
