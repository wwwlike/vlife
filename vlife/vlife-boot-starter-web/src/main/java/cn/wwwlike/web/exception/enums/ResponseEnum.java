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

import cn.wwwlike.web.exception.asserts.BusinessExceptionAssert;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <P>权限校验类</P>
 * 目前应该用不到，都交给security进行了相关判断
 */
@Getter
@AllArgsConstructor
public enum ResponseEnum implements BusinessExceptionAssert {
    TOKEN_NULL(401,"token"),
    /**
     *
     */
    BAD_LICENCE_TYPE(401, "Bad licence type."),

    /**
     *
     */
    LICENCE_NOT_FOUND(7002, "Licence not found.{0}");

    /**
     * 返回码
     */
    private int code;
    /**
     * 返回消息
     */
    private String message;
}
