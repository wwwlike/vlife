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

import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;

import java.util.List;
import java.util.Map;

/**
 * 数据库操作的基础单元接口
 */
public interface VLifeDao<T extends Item> {


    /**
     * 1.数量查询
     *
     * @param wrapper
     * @return
     */
    public Long count(QueryWrapper<T> wrapper);

    /**
     * 2.数量查询
     *
     * @param request
     * @return
     */
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> Long count(R request);

    /**
     * 3.实体类对象通过前端入参对象条件查询
     *
     * @param request
     * @return
     */
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> List<T> find(R request);

    /**
     * 4. 实体类对象通过包裹条件查询
     *
     * @param wq
     * @return
     */
    public List<T> find(QueryWrapper<T> wq);


    /**
     * 5. 当前实体对象分页入参查询
     *
     * @param pageRequest
     * @param <E>
     * @return
     */
    public <E extends PageQuery<T>> PageVo<T> findPage(E pageRequest);

    /**
     * 6. VO对象分页查询vo
     *
     * @param vo
     * @param request
     * @param <E>
     * @return
     */
    public <E extends VoBean<T>, N extends PageQuery<T>> PageVo<E> queryPage(Class<E> vo, N request);


    /**
     * 所有实体类通用查询
     *
     * @param entityVoClz
     * @param wrapper
     * @param <E>
     * @return
     */
    public <E extends IdBean> List<E> query(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, PageableRequest page, OrderRequest order);


    /**
     * 根据条件删除数据
     *
     * @param request 查询待删除数据的条件
     * @return
     */
    public long delete(BaseRequest<T> request);

    /**
     * 数据保存
     *
     * @param item
     * @return
     */
    public <E extends Item> E save(E item);

    /**
     * 保存的时候传入可能的外键字段
     *
     * @param saveBean 可能不包含fkMap里的key属性
     * @param fkMap    关联保存传入的外键字段及值MAp(无则为空)
     * @param <E>
     * @return
     */
    public <E extends SaveBean> E save(E saveBean, Map<String, Object> fkMap);

    /**
     * 物理删除
     *
     * @param id
     * @return
     */
    public long delete(String id);

    /**
     * 删除指定实体类
     *
     * @param itemClz
     * @param id
     * @return
     */
    public long delete(Class<? extends Item> itemClz, String id);

    public long remove(Class<? extends Item> clazz, String id);
}
