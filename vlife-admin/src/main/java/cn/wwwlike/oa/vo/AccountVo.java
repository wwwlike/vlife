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

package cn.wwwlike.oa.vo;

import cn.wwwlike.oa.entity.Account;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/6/21
 */
@Data
public class AccountVo implements VoBean<Account> {
    public String id;

    public String name;

    @VField(pathName = "id")
    public String token;

    public String password;

    /**
     * 用户组
     */
    public String deptId;

}
