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
import cn.wwwlike.vlife.core.dsl.WModel;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import com.querydsl.core.QueryResults;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.StringPath;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 数据库操作的基础单元接口
 */
public interface VLifeDao<T extends Item> {

    /**
     * 用包装条件对象查询数量
     */
    public Long count(QueryWrapper<T> wrapper) ;

    /**
     * 终端传入的查询条件查询数量
     */
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> Long count(R request) ;

    /**
     * 终端传入的查询条件<CustsomQuery>进行实体对象<T>列表数据的过滤
     */
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> List<T> find(R request);

    /**
     * 包装条件进行实体对象<T>列表数据的过滤
     */
    public List<T> find(QueryWrapper<T> wq);

    /**
     * 通过终端入参的分页查询对象进行实体分页查询
     */
    public <E extends PageQuery<T>> PageVo<T> findPage(E pageRequest);

    /**
     * 通过终端入参的分页查询对象和VO的class类型进行VO分页查询
     */
    public <E extends VoBean<T>, N extends PageQuery<T>> PageVo<E> queryPage(Class<E> vo, N pageRequest);

    /**
     * 通过条件包装对象和VO的class类型进行VO和DO的查询
     * @param entityVoClz 实体类或VO类信息
     * @param wrapper 条件包装对象
     * @param order 排序对象
     */
    public <E extends IdBean> List<E> query(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, OrderRequest order);

    /**
     * 实体类保存
     */
    public <E extends Item> E save(E item);

    /**
     * SaveDto数据保存
     * @param saveBean  保存的dto数据
     * @param fkMap 可以写入到saveBean对应DO里的外键map集合
     */
    public <E extends SaveBean> E save(E saveBean, Map<String, Object> fkMap);

    /**
     * 物理删除当前表ID所在的行数据
     */
    public long delete(String id);

    /**
     * 物理删除itemClz表ID所在的行数据
     */
    public long delete(Class<? extends Item> itemClz, String id);

    /**
     * 逻辑删除itemClz表ID所在的行数据
     */
    public long remove(Class<? extends Item> clazz, String id);

}
