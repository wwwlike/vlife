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

package cn.wwwlike.oa.dto;

import cn.wwwlike.oa.entity.Account;
import cn.wwwlike.oa.entity.Dept;
import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 登录元素
 * @author xiaoyu
 * @date 2022/6/26
 */
@Data
public class AccountDto implements SaveBean<Account> , VoBean<Account> {
    public String id;
    @VField(pathName = "account")
    public String username;

    public String password;

    public Dept group;

    /**
     * 创建人的id
     */
    List<String> project_id;

    List<String> project_name;

    /**
     * 项目创建人
     */
    public List<Project> projects;

    // 多对多
    List<String> projectAccount_projectId;

    /**
     * 多对多的关联关系
     */
    public List<Project> projectAccount_project;

    public List<String> projectAccount_project_name;



}
