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

package cn.wwwlike.web.exception.pojo;

import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import cn.wwwlike.web.exception.enums.IResponseEnum;
import lombok.Data;

@Data
public class BaseResponse {
    /**
     * 返回码
     */
    protected int code;
    /**
     * 返回消息
     */
    protected String msg;

    public BaseResponse() {
        this(CommonResponseEnum.SUCCESS);
    }

    public BaseResponse(IResponseEnum iResponseEnum) {
        this(iResponseEnum.getCode(), iResponseEnum.getMessage());
    }

    public BaseResponse(int code, String message) {
        this.code = code;
        this.msg = message;
    }

}
