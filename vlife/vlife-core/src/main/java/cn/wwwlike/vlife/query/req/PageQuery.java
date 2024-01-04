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

package cn.wwwlike.vlife.query.req;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.IPage;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.PageableRequest;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;


/**
 * 带分页，带排序，带自定义入参
 *
 * @param <T>
 */
@Data
public class PageQuery<T extends Item> extends CustomQuery<T, QueryWrapper<T>> implements IPage {
    //post提交查询后去除了 @JsonIgnore
    @VField(skip = true)
    private PageableRequest pager = new PageableRequest();

    public PageQuery() {
    }

    public PageQuery(Class entityClz) {
        this.entityClz = entityClz;
    }

    @Override
    public QueryWrapper<T> instance() {
        return new QueryWrapper<>(getEntityClz());
    }

    public PageableRequest getPager() {
        return pager;
    }

    public void setPager(PageableRequest pager) {
        this.pager = pager;
    }
}
