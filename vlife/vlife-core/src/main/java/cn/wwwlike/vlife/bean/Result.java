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

package cn.wwwlike.vlife.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @description 全局统一返回类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> implements Serializable {

    /**
     * 成功数据
     */
    private T data;

    /**
     * 响应编码200为成功
     */
    private Integer code;

    /**
     * 请求消耗时间
     */
    private long cost;

    /**
     * 描述
     */
    private String msg;

    /**
     * 请求id
     */
    private String requestId;

    public Result(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public static Result create(Integer code, String msg) {
        Result result = new Result(code, msg);
        return result;
    }

    /**
     * 无数据返回成功
     *
     * @return
     */
    public static Result createSuccess() {
        return create(200, "成功");
    }

    /**
     * 有数据返回成功
     *
     * @param data
     * @param <T>
     * @return
     */
    public static <T> Result<T> createSuccess(T data) {
        return createSuccess().setData(data);
    }

    /**
     * 无描述返回失败
     *
     * @return
     */
    public static Result createFail() {
        return create(403, "异常");
    }

    /**
     * 自定义返回失败描述
     *
     * @param code
     * @param msg
     * @return
     */
    public static Result createFail(Integer code, String msg) {
        return create(code, msg);
    }

    public Result setData(T data) {
        this.data = data;
        return this;
    }
}
