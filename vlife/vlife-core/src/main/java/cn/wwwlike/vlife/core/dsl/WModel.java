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

package cn.wwwlike.vlife.core.dsl;

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAUpdateClause;

import java.util.Map;

/**
 * 写入的模型接口
 * 1. 实现缓存功能
 * 2. 关联关系对象外键写入
 * 关联类
 */
public interface WModel<T extends Item> {

    public JPAUpdateClause getUpdateClause();

    public void resetClause();

    public BeanDto getSaveDto();

    public <E extends SaveBean<T>> T dtoToEntity(E saveBean);

    /**
     * 函数式编程
     *
     * @param expressions
     * @return
     */
    public WModel where(BooleanExpression... expressions);

    /**
     * 根据对象保存信息 排除部分字段
     */
    public <E extends IdBean> WModel setVal(E e,String ... ignore);

    public <E extends IdBean> WModel setValWithAssign (E e,String ... assigns);

    /**
     * 根据对象保存信息
     *
     * @return
     */
    public <E extends IdBean> WModel setVal(E e);

    /**
     * 设置一个字段信息
     *
     * @return
     */
    public <E extends IdBean> WModel setVal(String fieldName, Object val);

    /**
     * 设置赋值数据
     *
     * @return
     */
    public WModel setUpdateClauseVal(Map<Path, Object> valMap);

}
