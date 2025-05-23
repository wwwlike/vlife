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

package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;
/**
 * 权限资源
 */
@Data
@Entity
@Table
@VClazz(remove = {Button.class})
public class SysResources extends DbEntity{
    /**
     * 资源名称
     */
    public String name;
    /**
     * 接口注释
     */
    public String javaName;
    /**
     * 接口说明
     * 请简洁描述接口的使用场景
     */
    public String remark;
    /**
     * 接口地址
     * 全局唯一
     */
    public String url;
    /**
     * 实体标识
     */
    public String entityType;
    /**
     *  所属模型
     */
    public String formId;
    /**
     * 接口文件
     * className
     */
    public String actionType;
    /**
     * 权限code
     * 接口URL用“：”分隔的形式 sysUser:save ->sysUser/save
     */
    public String code;
    /**
     * 图标
     */
    public String icon;
    /**
     * 授权方式
     * single(独立授权)/noAuth无需授权/extend继承授权
     * noAuth/extend 两者无需和角色关联
     */
    @VField(dictCode = "RESOURCES_PERMISSION")
    public String permission;
    /**
     * 上级资源
     * 当前地址包涵的地址对应的接口及上级资源 /sysUser/save/userDto的上级资源是 /save/sysUser
     */
    public String pcode;
    /**
     * 请求方式
     */
    public String methedType;
    /**
     * 接口分类
     * add/edit/delete/query/import/export
     */
    public String resourceType;
    //参数名
    public String param;
    //参数模型分类
    public String paramType;//dto,vo,req,bean,other
    //参数模型
    public String paramWrapper;
    //参数泛型
    public String paramGeneric;
    //参数注解
    public String paramAnnotation;
    //出参模型
    public String  returnWrapper;
    //出参泛型
    public String returnGeneric;
    /**
     * 按钮状态
     * 1. 可用 2. 待启用(需程序重启)
     */
    public String state;
    /**
     * 控制器名
     */
    public String fullClassName;
    /**
     * 方法名
     */
    public String methodName;
    /** 待移除 */
    //出参模型分类
    public String  returnType;

}
