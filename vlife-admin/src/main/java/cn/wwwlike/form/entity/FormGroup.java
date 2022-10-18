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

package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 表单容器
 * 对字段进行分组展示。占一整行的大小
 * @author xiaoyu
 * @date 2022/10/17
 */
@Entity
@Data
@Table(name="form_group")
public class FormGroup extends DbEntity implements ITree {
    /**
     * 所在表单
     */
    public String formId;
    /**
     * 组名
     */
    public String name;
    /**
     * 容器组件
     * FormTab,card等进行扩展
     */
    public String component;
    /**
     * 放置位置
     * 空则是上级容器就是表单
     */
    public String pcode;
    /**
     * 组件编号
     */
    public String code;
    /**
     * 同级序号
     */
    public String sort;
}
