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
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.IFilter;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 科室部门
 */
@Data
@Entity
@Table(name = "sys_dept")
public class SysDept extends DbEntity implements ITree, IFilter {//属性结构实体继承ITree
    /**
     * 部门名称
     */
    @VField
    public String name;
    /**
     * 编码
     */
    public String code;
    /**
     * 上级部门
     */
    public String pcode;
    /**
     * 上级部门id
     * 冗余导入数据时采用
     * @create_hide:true
     */
    public String parentId;

}
