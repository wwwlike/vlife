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
import cn.wwwlike.vlife.query.AbstractWrapper;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 查询指定指标的封装包裹条件
 * 将数据库里定义好的ReportItem数据与端发送的分组过滤数据进行组合翻译成querydsl能够处理的脚本
 */
@Data
public class ReportWrapper<T extends Item> extends AbstractWrapper<T, String, ReportWrapper<T>> {
    /**
     * 聚合查询字段
     */
    public String itemField;
    /**
     * 聚合方式
     */
    public String func;
    /**
     * 查询字段别名
     */
    public String code;
    /**
     * 分组字段信息
     */
    protected List<Groups> groups = new ArrayList<Groups>();
    /**
     * 分组后的过滤条件
     * 应该用不到
     */
    protected List<Havings> havings = new ArrayList<Havings>();

    public ReportWrapper(Class<T> entity) {
        super.entityClz = entity;
    }

    @Override
    public ReportWrapper<T> instance(ReportWrapper<T> parent) {
        ReportWrapper query = new ReportWrapper(parent.entityClz);
        query.entityClz = parent.entityClz;
        query.parent = parent;
        return query;
    }

    public class Havings {
    }
}
