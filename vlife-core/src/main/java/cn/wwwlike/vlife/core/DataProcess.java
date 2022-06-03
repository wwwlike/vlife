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

package cn.wwwlike.vlife.core;

import cn.wwwlike.vlife.base.IdBean;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * 数据处理，扩展dto数据保存其他数值信息
 * dao回调给值；API里能够获得bean，信息后然后
 * 设置的coulmn是否需要校验
 */
@Getter
public abstract class DataProcess {
    /**
     * 回调给的要保存的bean值
     */
    private IdBean bean;
    /**
     * 字段值设置存储
     */
    private Map<String, Object> columnValMap = new HashMap();


    public DataProcess(IdBean bean) {
        this.bean = bean;
        commonDataSet(this.getBean(), this.getColumnValMap());
    }

    public DataProcess setVal(boolean condition, String column, Object val) {
        if (condition) {
            columnValMap.put(column, val);
        }
        return this;
    }

    public DataProcess setVal(String column, Object val) {
        setVal(true, column, val);
        return this;
    }


    public DataProcess setVal(String column, Supplier<Object> supplier) {
        setVal(true, column, supplier.get());
        return this;
    }

    public DataProcess setNull(String column) {
        setVal(true, column, null);
        return this;
    }

    public DataProcess setNull(boolean condition, String column) {
        setVal(condition, column, null);
        return this;
    }

    /**
     * 默认值的设置
     */
    public abstract void commonDataSet(IdBean bean, Map<String, Object> mm);

}
