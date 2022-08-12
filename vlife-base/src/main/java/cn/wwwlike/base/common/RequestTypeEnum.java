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

package cn.wwwlike.base.common;

/**
 * req查询请求提交方式。默认返回查询数量LIST
 * _ONE表示期望返回一条数据。
 */
public enum RequestTypeEnum {
    NULL,
    GET_ONE, /* get方式返回一条记录*/
    POST_ONE, /* post方式提交数据，期望返回一条数据，方法名采用req关键字名称 */
    SAVE_CustomName; /* 数据保存，期望用自己dto关键字名称*/

}
