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
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.DataExpressTran;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.querydsl.core.types.Expression;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 分组查询的包装条件
 *
 * @param <T>
 */
@Getter
public class GroupWrapper<T extends Item> extends AbstractWrapper<T, String, GroupWrapper<T>> {

    /**
     * 分组条件
     */
    protected List<Group> groups = new ArrayList<>();
    /**
     * 分组后过滤条件
     */
    protected List<GroupFilter> filters = new ArrayList<>();

    public GroupWrapper(Class<T> entity) {
        super.entityClz = entity;
    }

    public static <E extends Item> GroupWrapper of(Class<E> clz) {
        return new GroupWrapper<E>(clz);
    }

    @Override
    public GroupWrapper<T> instance(GroupWrapper<T> parent) {
        GroupWrapper query = new GroupWrapper(parent.entityClz);
        query.entityClz = parent.entityClz;
        query.parent = parent;
        return query;
    }

    /**
     * 根据column分组
     *
     * @param column
     */
    public void addGroup(String column) {
        addGroup(column, null, null);
    }

    /**
     * 对column列进行tran转换后分组
     *
     * @param column
     */
    public void addGroup(String column, DataExpressTran tran) {
        addGroup(column, tran, null);
    }

    /**
     * 对关联path路径的column字段进行分组
     *
     * @param column
     */
    public void addGroup(String column, Class... path) {
        addGroup(column, null, path);
    }

    /**
     * 全量进分组的分组条件
     *
     * @param column
     * @param groupType
     * @param path
     */
    public void addGroup(String column, DataExpressTran groupType, Class... path) {
        Group group = new Group(column, (path == null || path.length == 0) ? Arrays.asList(entityClz) : Arrays.asList(path), groupType);
        groups.add(group);
    }


    public void addFilter(String column, Opt opt, Expression val) {
        addFilter(column, FunctionEnum.count, opt, val);
    }

    public void addFilter(Opt opt, Expression val) {
        addFilter("id", FunctionEnum.count, opt, val);
    }

    public void addFilter(String column, FunctionEnum func, Opt opt, Expression val) {
        filters.add(new GroupFilter(column, func, opt, val));
    }

    /**
     * 把group by里面字段的路径也添加到表管理里面，否则group by的时候报错
     *
     * @return
     */
    @Override
    public List<List<Class<? extends Item>>> allLeftPath() {
        List<List<Class<? extends Item>>> all = super.allLeftPath();
        for (Group group : getGroups()) {
            all = VlifeUtils.addItemClzArray(all, group.getPath());
        }
        return all;
    }

    /**
     * 分组查询having的过滤元组
     */
    @Getter
    @AllArgsConstructor
    public class GroupFilter {
        protected String column;
        protected FunctionEnum func;
        protected Opt opt;
        protected Expression val;
    }

    @Getter
    public class Group {

        protected String column;
        protected List<Class<? extends Item>> path;
        protected DataExpressTran tran;

        public Group(String column, List<Class<? extends Item>> path, DataExpressTran tran) {
            this.column = column;
            this.path = path;
            this.tran = tran;
        }

        public Group(String column, List<Class<? extends Item>> path) {
            this.column = column;
            this.path = path;
        }

        public Group(String column) {
            this.column = column;
            this.path = Arrays.asList(entityClz);
        }

    }
}
