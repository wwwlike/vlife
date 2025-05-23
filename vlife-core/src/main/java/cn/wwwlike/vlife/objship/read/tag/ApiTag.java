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

import cn.wwwlike.vlife.annotation.PermissionEnum;
import lombok.Data;

import java.util.List;

/**
 *  接口信息
 */
@Data
public class ApiTag {
    /**
     * 接口名称
     * 第一行注释
     */
    public String title;
    /**
     * 接口说明
     * 第二行注释
     */
    public String remark;
    /**
     * 接口路径
     */
    public String path;

    /**
     * 入参名称
     */
    public String param;

    /**
     * 入参注解方式
     */
    public String paramAnnotation;

    /**
     * 入参包装类型
     */
    public String paramWrapper;

    /**
     * 实际包装泛型
     */
    public String paramGeneric;

    /**
     * 出参包装类型
     */
    public String returnWrapper;

    /**
     * 出参泛型
     */
    public String returnGeneric;
//    /**
//     * 出参类型
//     */
//    public String returnClz;
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
    /**
     * 免权接口
     */
    public PermissionEnum permission;
    /**
     * 入参信息
     */
    public List<ParamTag> paramTagList;
}
