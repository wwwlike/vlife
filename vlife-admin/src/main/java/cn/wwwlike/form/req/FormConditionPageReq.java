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

package cn.wwwlike.form.req;

import cn.wwwlike.form.entity.FormCondition;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 过滤条件的分页查询模型
 */
@Data
public class FormConditionPageReq extends PageQuery<FormCondition> {

    @VField(pathName = "name", opt = Opt.like)
    public String search;

    public String formId;

}
