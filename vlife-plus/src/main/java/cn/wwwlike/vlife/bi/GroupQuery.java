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
import lombok.Data;

import java.util.List;

/**
 * 支持分组的自定义Req
 *
 * @param <T>
 */
@Data
public class GroupQuery<T extends Item> extends CustomQuery<T, GroupWrapper<T>> {

    public String[] groupBys;


    public GroupWrapper qw(Class<T> clz) {
        GroupWrapper wrapper = super.qw(clz);
        for (String groupBy : getGroupBys()) {
            wrapper.addGroup(groupBy);
        }
        return wrapper;
    }

    /**
     * @param clz
     * @param ignores 忽略不用操作的分组字段，在实现类进行相关处理了
     * @return
     */
    public GroupWrapper qw(Class<T> clz, List<String> ignores) {
        GroupWrapper wrapper = super.qw(clz);
        for (String groupBy : getGroupBys()) {
            if (!ignores.contains(groupBy)) {
                wrapper.addGroup(groupBy);
            }
        }
        return wrapper;
    }

    @Override
    public GroupWrapper<T> instance() {
        return new GroupWrapper<>(getEntityClz());
    }


    public void setGroupBys(String[] groupBys) {
        this.groupBys = groupBys;
    }


}
