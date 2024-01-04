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

package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.Form;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 表单保存对象
 * @author xiaoyu
 * @date 2022/9/22
 */
@Data
public class FormDto implements SaveBean<Form> {
    public String id;
    /**
     * 元素中文信息
     */
    public String title;
    /**
     * 类型(clz)
     */
    public String type;
    /**
     * 模型父类字符串集合
     */
    public String typeParentsStr;
    /**
     * 实体clz
     */
    public String entityType;
    /**
     * 模型类型
     */
    public String itemType;

    public String name;
    /**
     * 图标
     */
    public String  icon;
    /**
     * 页面大小
     * 1. 对于form可以确定弹出层大小(tailwind的比例)
     * 2. field的gridSpan最小支持的约束
     */
    public Integer modelSize;

    public Integer  pageSize;
    /**
     * 版本
     * 保存一次版本加一(待)
     */
    public Integer version;
    /**
     * 分页列表api代码路径
     */
    public String listApiPath;
    /**
     * 分页列表api代码路径
     */
    public String saveApiPath;
    /**
     * 编号前缀
     */
    public String prefixNo;
    /**
     * 接口
     */
    public List<SysResources> resources;

    public String  itemName;

    public String sysMenuId;

    public String formDesc;
    //开发帮助文档
    public String helpDoc;
    public List<FormFieldDto> fields;
    public List<FormTabDto> formTabDtos;
}
