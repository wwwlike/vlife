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

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 字典表
 * 所有字典大类来源于CT及子类里的定义；
 * 字典
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Table(name = "sys_dict")
@Entity
public class SysDict extends DbEntity {
    /**
     *编码
     */
    public String code;
    /**
     *选项值
     */
    public String val;
    /**
     *选项名
     */
    public String title;
    /**
     * 系统项
     */
    public Boolean sys;
    /**
     * 可维护
     */
    public Boolean edit;

}
