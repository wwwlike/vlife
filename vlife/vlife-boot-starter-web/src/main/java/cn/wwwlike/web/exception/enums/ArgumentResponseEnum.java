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
 * <p>参数校验异常返回结果</p>
 * 入参校验异常  6000
 * 入参逻辑判断异常  7000
 */
@Getter
@AllArgsConstructor
public enum ArgumentResponseEnum implements ArgumentExceptionAssert {
    VALID_ERROR(6000, "参数校验异常"),
    INDEX_NOTEXIST(6000, "提交数据主键不存在"),
    DATA_NOT_NULL(6000, "{0}不能为空"),
    DADA_FORMAT_ERR(6000, "{0}提交数据格式错误"),
    DADA_REPEAT(7000, "{0}已经存在"),
    DADA_RELATION_ERR(7000, "{0}数据关系错误");
    /**
     * 返回码
     */
    private int code;
    /**
     * 返回消息
     */
    private String message;

}
