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

import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/8/17
 */
@Data
public class ProjectPageReq extends PageQuery<Project> {
    /**
     * 项目名称
     */
    @VField(opt = Opt.like,orReqFields = {"projectNo"})
    public String name;

    /**
     * 项目阶段
     */
    public List<String> state;
    /**
     * 负责人
     */
    public List<String> sysUserId;
    /**
     * 甲方
     */
    public String sysOrgId;
    /**
     * 启动日期
     */
    public List<Date> startDate;
}
