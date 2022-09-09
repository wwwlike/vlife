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
 * 所有pojo类的属性字段信息dto
 */
@Data
public class FieldDto<T extends BeanDto> extends FieldInfo implements ISort {
    /**
     * 字段所在item类信息 parent信息
     */
    @JsonIgnore
    public T itemDto;
    /**
     * 字段类型 type的clz list的存放的是里面泛型的clazz
     */
    @JsonIgnore
    public Class clz;
    /**
     * 字段所属 item的 Clazz 字段所在item的类clz itemInfoType的clz
     */
    @JsonIgnore
    public Class<? extends IdBean> itemClz;
    /**
     * 字段所在实体类的clazz,这里不是item对应的entity,例如ITEM是VO，那么可能放的是其他关联表的字段
     */
    @JsonIgnore
    public Class<? extends Item> entityClz;
    /**
     * 打平字段的查询路径 有下划线多层打平 && 驼峰命名字段间接一层注入
     */
    @JsonIgnore
    public List queryPath;
    @JsonIgnore
    public Object value;
    @JsonIgnore
    public String orders;
    @JsonIgnore
    public Opt opt;
    @JsonIgnore
    public VField vField;
    @JsonIgnore
    public DataExpressTran tran;

    public static void main(String[] args) {
        String a = "a__b_c";
        a.split("___");
    }

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

    /**
     * 如果是注入对象那么查询到该对象 需要传参file命名是
     *
     * @return
     */
    public String filterFieldName() {
        return null;
    }

    public String queryPathName() {
        List obj = getQueryPath();
        if (obj == null) {
            return null;
        }
        return VlifeUtils.fullPath("", obj, true);
    }

    /**
     * 进行左连接的路径
     *
     * @return
     */
    public List<Class<? extends Item>> leftJoinPath() {
        return VlifeUtils.leftJoinPathByQueryPath(getQueryPath());
    }

    /**
     * 查询路径里最后一个对象是否包涵在数组里（
     * 包涵则:最后一个对象是上一个对象的外键对象  (子查询exist or is)
     * 不包涵：最后一个对象是上一个对象的关联对象（left）
     *
     * @return
     */
    public boolean lastItemClzIsInArray() {
        String path = queryPathName();
        String[] split = path.split("__");
        if (split.length > 1) {
            if (split[split.length - 1].split("_").length > 1) {
                return false;
            }
            return true;
        }

        return false;
    }

    /**
     * 返回查询该字段的第一个子查询的LISt语句
     * 该字段第子查询的路径(子查询可里面还可以包涵子查询) ,
     * 集合里index=0个子查询的主对象，index >0的是左连接查询对象, 里面如果是list则是嵌套的子查询对象
     *
     * @return
     */
    @JsonIgnore
    public List getSubPath() {
        if (getQueryPath() != null) {
            for (Object obj : getQueryPath()) {
                if (obj instanceof List) {
                    return (List) obj;
                }
            }
        }
        return null;
    }

    /**
     * 深入拷贝使用插件时候存在找不到类的情况，使用该对象的时候浅拷贝
     */
    public List getQueryPath() {
        return this.queryPath;


    }

    /**
     * 设置全量查询路径 只设置一个
     *
     * @param queryPath
     */
    public void setQueryPath(List queryPath) {
        this.queryPath = queryPath;
    }

    /**
     * 设置全量查询路径
     *
     * @param queryPath
     */
    public void setQueryPath(Object... queryPath) {
        this.queryPath = Arrays.asList(queryPath);
    }
}
