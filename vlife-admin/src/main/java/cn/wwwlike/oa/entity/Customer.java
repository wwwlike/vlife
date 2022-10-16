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

package cn.wwwlike.oa.entity;

import cn.wwwlike.auth.common.Business;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 客户
 * @author xiaoyu
 * @date 2022/10/15
 */
@Data
@Entity
@Table(name = "oa_customer")
public class Customer extends DbEntity implements Business {
    /**
     * 客户地区
      */
    public String linkAreaId;
    //单位名称
    public String name;
    //联系人
    public String linkman;
    //联系电话
    public String linktel;
    //联系地址
    public String address;

    public String sysDeptId;

    public String sysOrgId;

    public String sysAreaId;
}
