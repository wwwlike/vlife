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

package cn.wwwlike.vlife.bi;

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.req.QueryUtils;
import lombok.Data;

import java.util.List;

/**
 * 报表查询端的入参信息
 *
 * @param <T>
 */
@Data
public class ReportQuery<T extends Item> extends CustomQuery<T, ReportWrapper<T>> {
    /**
     * 统计项编码
     * 与reportCode二选一
     */
    public List<String> itemCode;
    /**
     * 报表编码
     */
    public String reportCode;
    /**
     * 分组字段
     * 字段+'_'+tran名如  createDate_ji ->根据根据季度分组
     */
    public List<String> groups;
//    /**
//     * 端传入的分组
//     */
//    public List<Groups> groups = new ArrayList<>();

    public ReportWrapper qw(Class<T> clz) {
        ReportWrapper wrapper = super.qw(clz);
        if (getGroups() != null && getGroups().size() > 0) {
            for (String group : getGroups()) {
//                wrapper.addGroup(groupBy);
            }
        }
        return wrapper;
    }

    /**
     * 植入指标数据
     */
    public ReportWrapper qw(VlifeReportItem item) {
        ReportWrapper wrapper = super.qw(item.getEntityClz());
        if (getGroups() != null && getGroups().size() > 0 &&
                (wrapper.getGroups() == null || wrapper.getGroups().size() == 0)) {
            for (String group : getGroups()) {
                Groups groupObj = new Groups();
                if (group.split("_").length == 1) {
                    groupObj.setColumn(group);
                } else {
                    groupObj.setColumn(group.split("_")[0]);
                    groupObj.setFunc(group.split("_")[1]);
                }
                wrapper.getGroups().add(groupObj);
            }
        }
        //聚合字段
        if (item.getFieldName() != null) {
            wrapper.setCode(item.getCode());
            wrapper.setItemField(item.getFieldName());
            wrapper.setFunc(item.getFunc());
        }
        //查询条件注入
        if (item.getConditions() != null&&item.getConditions().getConditions()!=null) {
            QueryUtils.condition(wrapper, item.getConditions());
        }
        return wrapper;
    }

    @Override
    public ReportWrapper<T> instance() {
        return new ReportWrapper<>(getEntityClz());
    }

}
