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

package cn.wwwlike.vlife.objship.dto;

import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.objship.base.FieldInfo;
import cn.wwwlike.vlife.objship.base.ISort;
import cn.wwwlike.vlife.query.DataExpressTran;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 模型字段解析后的信息
 */
@Data
public class FieldDto<T extends BeanDto> extends FieldInfo implements ISort {
    /** 字段所在类模型信息 */
    @JsonIgnore
    public T itemDto;
    /** 字段类型（集合字段是泛型clz) */
    @JsonIgnore
    public Class clz;
    /** 字段所在item的类clz*/
    @JsonIgnore
    public Class<? extends IdBean> itemClz;
    /**
     * 字段所在实体类clz
     * 不是字段所在VO类对应的entity;是字段数值来源的实体；
     * 如sysUserVo里的deptId对应的类实体不是 sysUser而是sysDept
     */
    @JsonIgnore
    public Class<? extends Item> entityClz;

    /** 到达该字段的路径clz信息，list里存clz和集合clz
     *  集合clz说明有子查询
     * */
    @JsonIgnore
    public List queryPath;
    /** 字段值(当前没有用到，可以作为默认初始值) */
    @JsonIgnore
    public Object value;
    /** 字段排序方式(注解方式可以进行设置)*/
    @JsonIgnore
    public String orders;
    /** 作为查询条件的匹配方式，B端设置功能后期因该可以对他进行覆盖*/
    @JsonIgnore
    public Opt opt;
    /** 注解信息*/
    @JsonIgnore
    public VField vField;
    /** 字段查询和展示时使用的转换方式*/
    @JsonIgnore
    public DataExpressTran tran;

    /** 外键关联查询路径 */
    public List<Class<? extends Item>> leftJoinPath() {
        return VlifeUtils.leftJoinPathByQueryPath(getQueryPath());
    }
    /** 外键关联查询名称*/
    public String leftJoinName() {
        List<Class<? extends Item>> clz = leftJoinPath();
        if (clz == null || clz.size() == 0)
            return null;
        String all = "";
        for (Class cz : clz) {
            all += "_" + StringUtils.uncapitalize(cz.getSimpleName());
        }
        return all.substring(1);
    }

    /** 根据全量路径得到全量查询路径名称(能递归) */
    public String queryPathName() {
        List obj = getQueryPath();
        if (obj == null) {
            return null;
        }
        return VlifeUtils.fullPath("", obj, true);
    }

    public List getQueryPath() {
        return this.queryPath;
    }

    /** 设置全量查询路径 */
    public void setQueryPath(List queryPath) {
        this.queryPath = queryPath;
    }

    /** 设置全量查询路径 */
    public void setQueryPath(Object... queryPath) {
        this.queryPath = Arrays.asList(queryPath);
    }

    @Override
    public String toString() {
        return "FieldDto{" +
                "itemDto=" + itemDto +
                ", clz=" + clz +
                ", itemClz=" + itemClz +
                ", entityClz=" + entityClz +
                ", queryPath=" + queryPath +
                ", value=" + value +
                ", orders='" + orders + '\'' +
                ", opt=" + opt +
                ", vField=" + vField +
                ", tran=" + tran +
                '}';
    }
}
