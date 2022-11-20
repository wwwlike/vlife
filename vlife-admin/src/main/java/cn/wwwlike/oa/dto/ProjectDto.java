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

import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.oa.entity.ProjectTask;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 项目dto
 */
@Data
public class ProjectDto implements SaveBean<Project> {
    public String id;
    /**
     * 项目名称
     */
    public String name;
    /**
     * 项目编号
     */
    public String projectNo;
    /**
     * 甲方
     */
    public String customer;
    /**
     * 负责人
     */
    public String sysUserId;
    /**
     * 项目阶段
     */
    @VField(dictCode = "PROJECT_STATE")
    public String state;
    /**
     * 启动日期
     */
    public Date startDate;

    /**
     * 任务分解
     */
    public List<ProjectTask> tasks;


}
