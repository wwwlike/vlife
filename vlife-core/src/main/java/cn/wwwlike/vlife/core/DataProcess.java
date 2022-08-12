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
import cn.wwwlike.base.model.IdBean;
import lombok.Getter;
import java.util.*;
import java.util.function.Supplier;

/**
 * 数据处理 dto,item需要保存的值存在map里；
 */
@Getter
public abstract class DataProcess {

    /**
     * 需略的字段
     */
    protected Set<String> ignores;
    /**
     * 指定的字段
     */
    protected Set<String> assigns;

    /**
     * 需要排除保存的
     * @param ignores
     */
    public void setIgnores(String... ignores) {
        if(this.ignores==null){
            this.ignores=new HashSet();
        }
        if(ignores!=null){
            Arrays.stream(ignores).forEach(s -> {this.ignores.add(s);});
        }
        //从新计算
        commonDataSet(this.getBean(), this.getColumnValMap());
    }
    /**
     * 只保存的
     * @param assigns
     */
    public void setAssigns(String[] assigns) {
        if(this.assigns==null){
            this.assigns=new HashSet();
        }
        if(assigns!=null){
            Arrays.stream(assigns).forEach(s -> {this.assigns.add(s);});
        }
        commonDataSet(this.getBean(), this.getColumnValMap());
    }

    /**
     * 回调给的要保存的bean值
     */
    private IdBean bean;
    /**
     * 字段值存储（预设值以及bean的转换值）
     */
    private Map<String, Object> columnValMap = new HashMap();

    public DataProcess(IdBean bean) {
        this.bean = bean;
        setIgnores(new String[]{"status","createDate","modifyDate","createId","modifyId"});
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
    public  abstract void commonDataSet(IdBean bean, Map<String, Object> mm);

}
