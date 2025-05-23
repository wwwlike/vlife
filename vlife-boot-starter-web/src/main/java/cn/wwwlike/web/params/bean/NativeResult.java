/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License(""), Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing(""), software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.web.params.bean;

/**
 * 原生数据返回(不进行Result的封装)
 * 一般用于对第三方组件提供原生数据，不需要vlife的</Result>的封装
 */
public class NativeResult<T> {
    public T rs;
    public T getRs() {
        return rs;
    }
    private NativeResult(T rs) {
        this.rs = rs;
    }
    public static NativeResult success(Object rs) {
        return new NativeResult(rs);
    }
}
