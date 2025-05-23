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

package cn.wwwlike.web.exception.enums;

import cn.wwwlike.web.exception.asserts.ArgumentExceptionAssert;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>代码错误异常,用于检查约定规范不正确的编码情况</p>
 * <p>返回-1</p>
 */
@Getter
@AllArgsConstructor
public enum CodeErrorResponseEnum  implements ArgumentExceptionAssert {
    /**
     * 绑定参数校验异常
     */
    CODE_ERROR(-1, "写法不规范-{0}");
    /**
     * 返回码
     */
    private int code;
    /**
     * 返回消息
     */
    private String message;
}
