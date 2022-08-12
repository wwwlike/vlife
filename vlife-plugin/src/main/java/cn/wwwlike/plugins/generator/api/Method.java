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

package cn.wwwlike.plugins.generator.api;

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import com.squareup.javapoet.MethodSpec;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * method信息构造接口
 */
public interface Method {
    final static String NAME_KEY="ONLY_KEY";//方法名只有key
    final static String NAME_PREFIX="NAME_PREFIX";//方法名只有PREFIX=
    final static String NAME_ALL="NAME_ALL";//都有

    /**
     * 方法体的模板类型
     */
     public enum MethodContent{
        save,
        remove,
        page,
        detail,
        list,
        one
    }

    /**
     * 类型名称
     */
    public String getTitle();
    /**
     * 前缀关键字
     */
    public String getPrefix();
    /**
     * 主要入参类型
     */
    public Class getParamsType();
    /**
     * 入参名称
     */
    public String getParamsName();
    /**
     * 入参注解的类型 @ResponseBody
     */
    public Class getParamsAnnotationClz();
    /**
     * 方法上的注解类型 @PostMapping
     */
    public Class getMethodAnnotationClz();

    public Class getReturnType();
    /**
     * 【计算】实际返回类型=index[0]，index[1]+为类型里的泛型
     */
    public Class[] realReturnType(Class out);
    /**
     * 【计算】实际入参类型
     */
    public  Class realParamsType(Class in);
    /**
     * 接口访问路径 ,同methodName保持一致
     */
    public String getPath(String methodName);
    /**
     * 计算方法名称
     */
    public <T extends Item>String methodName(Class<T> itemClz,Class in);
    /**
     * 方法体名称
     */
    public MethodContent getMethodContent();
    /**
     * 返回方法描述/入参/出参的注释
     * @return
     */
    public String[] getMethodComment(String itemName,String paramName,String returnName);
}
