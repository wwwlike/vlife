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

package cn.wwwlike.oa.req;

import cn.wwwlike.oa.entity.Account;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import lombok.Data;

import java.util.List;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/6/28
 */
@Data
@VClazz(returnType = Account.class)
public class AccountTestReq extends VlifeQuery<Account> {
    @VField(pathName = "account")
    public String username;

    public String dept_name;

    public String projectAccount_projectId;

    public String projectAccount_project_name;

    @VField(pathName = "projectAccount_projectId")
    public List<String> projects;

    @VField(opt = Opt.like)
    public String project_name;

    @VField(pathName = "name",orReqFields = {"name","tel"})
    public String search;

//    public Group group_id;

}
