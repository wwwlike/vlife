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

import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.DataExpressTran;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.jpa.impl.JPAQuery;
import org.springframework.data.querydsl.SimpleEntityPathResolver;

import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;


/**
 * 数据库操作辅助类，与业务不强关联最小原子粒度的方法
 *
 * @author dlc
 * @date 2022/5/25
 */
public class QueryHelper {
    /**
     * 根据查询对象clz创建querydsl的对应的实体对象
     *
     * @param clazz 查询对象实体对象
     * @return
     */
    public static EntityPathBase<? extends Item> getItemEntityPath(Class<? extends IdBean> clazz) {
        EntityPathBase entityPathBase = null;
        if (Item.class.isAssignableFrom(clazz)) {
            entityPathBase = (EntityPathBase) SimpleEntityPathResolver.INSTANCE.createPath(clazz);
        } else {
            Class entityClz = GenericsUtils.getGenericType(clazz);
            entityPathBase = (EntityPathBase) SimpleEntityPathResolver.INSTANCE.createPath(entityClz);
        }
        return entityPathBase;
    }

    /**
     *  将前端入参的查询对象转换成QueryWrapper包裹形式的查询对象
     * @param request 前端入参
     * @param reqDto 查询对象的配置信息(优化后可从request里提取到)
     * @param <R>
     * @param <Q>
     * @return
     */


    /**
     * 根据实体类创建指定“别名”的dsl的查询主体对象
     *
     * @param voClz 查询的VO对象clz信息
     * @param alias 希望的
     * @param <T>
     * @return
     */
    public static <T extends IdBean> EntityPathBase getItemEntityPath(Class<T> voClz, String alias) {
        EntityPathBase entityPathBase = null;
        Class itemClz = voClz;
        if (VoBean.class.isAssignableFrom(voClz) && !Item.class.isAssignableFrom(voClz)) {
            itemClz = GenericsUtils.getGenericType(voClz);
        }
        Constructor ct = null;
        EntityPathBase path = null;
        try {
            ct = getItemEntityPath(itemClz).getClass().getDeclaredConstructor(String.class);
            ct.setAccessible(true);
            path = (EntityPathBase) ct.newInstance(alias);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }

    /**
     * 查询的主对象
     *
     * @param fromQuery dsl的from查询对象
     * @return
     */
    public EntityPathBase mainTablePath(JPAQuery fromQuery) {
        return (EntityPathBase) fromQuery.getMetadata().getJoins().get(0).getTarget();
    }

    /**
     * 将查询到的子类（IOC注入查询）的数据结果，根据外键标识关系设置到主查询的对应的ioc注入的属性里
     *
     * @param voDto        主查询voBean的信息
     * @param mainResult   主查询的结果集
     * @param iocFieldName 主查询需要注入的字段名称
     * @param iocResult    注入对象信息结果的数据集
     * @param parentId     主查询关联字段名称
     * @param subId        注入对象里关联字段名称
     * @return
     */
    protected List setListSubBean(VoDto voDto, List<?> mainResult, List<?> iocResult, String iocFieldName, String parentId, String subId) {
        if (mainResult == null || iocResult == null || mainResult.size() == 0 || iocResult.size() == 0) {
            return mainResult;
        }

        boolean parentTuple = !(mainResult.get(0) instanceof IdBean);
        boolean subTuple = !(iocResult.get(0) instanceof IdBean);

        Map groupDatas = iocResult.stream().collect(Collectors.groupingBy(
                v -> {
                    if (subTuple) {
                        if (!subId.equals("id")) {
                            Class vo = ((Tuple) v).get(0, IdBean.class).getClass();
                            VoDto subDto = GlobalData.voDto(vo);
                            Integer index = subDto.getLoseIds().get(subId);
                            if (index != null) {
                                return (String) ((Tuple) v).get(index + 1, String.class);
                            }
                        } else {
                            return ((Tuple) v).get(0, IdBean.class).getId();
                        }
                    }
                    return (String) ReflectionUtils.getFieldValue(v, subId);
                }));
        if (subTuple) {
            for (Object idKey : groupDatas.keySet()) {
                Object o = ((List) groupDatas.get(idKey)).stream().map(tuple -> {
                    return ((Tuple) tuple).get(0, IdBean.class);
                }).collect(Collectors.toList());
                groupDatas.put(idKey, o);
            }
        }

        for (Object parentData : mainResult) {
            Object key = null;
            if (parentTuple) {
                if (parentId.equals("id")) {
                    IdBean bean = ((Tuple) parentData).get(0, IdBean.class);
                    key = bean.getId();
                } else if (voDto.getLoseIds().get(parentId) != null) {
                    key = ((Tuple) parentData).get(voDto.getLoseIds().get(parentId) + 1, String.class);
                } else {
                    IdBean bean = ((Tuple) parentData).get(0, IdBean.class);
                    key = ReflectionUtils.getFieldValue(bean, parentId);
                }
                if (key != null) {
                    if (groupDatas.get(key) != null) {
                        if (subId.equals("id")) {
                            ReflectionUtils.setFieldValue(((Tuple) parentData).get(0, voDto.getClz()), iocFieldName, ((List) groupDatas.get(key)).get(0));
                        } else {
                            ReflectionUtils.setFieldValue(((Tuple) parentData).get(0, voDto.getClz()), iocFieldName, groupDatas.get(key));
                        }
                    }
                } else {

                }
            } else {
                key = ReflectionUtils.getFieldValue(parentData, parentId);
                if (groupDatas.get(key) != null) {
                    if (subId.equals("id")) {
                        ReflectionUtils.setFieldValue(parentData, iocFieldName, ((List) groupDatas.get(key)).get(0));
                    } else {
                        ReflectionUtils.setFieldValue(parentData, iocFieldName, groupDatas.get(key));
                    }
                }
            }
        }
        return mainResult;
    }


    /**
     * 通过查询路径创建包裹条件,把查询条件传到最后一个对象上进行过滤
     * 和customQuery里的该方法重复了，后期需要优化
     *
     * @param queryPath              查询路径
     * @param lastQueryPathFieldName 主查询里的字段名称(支持多个字段 和Val进行关联)
     * @param val                    查询字段值
     */
    public <S extends Item> QueryWrapper<S> createWrapperFromQueryPath(QueryWrapper<S> qw, List queryPath, Object val, Opt opt, DataExpressTran tran, String... lastQueryPathFieldName) {
        List<Class<? extends Item>> leftClz = new ArrayList();
        for (Object o : queryPath) {
            if (qw == null) {
                qw = QueryWrapper.of((Class) o);
            }
            if (o instanceof List) {
                Consumer<QueryWrapper<S>> subQuery = abc -> {
                    createWrapperFromQueryPath(abc, (List) o, val, opt, tran, lastQueryPathFieldName);
                };
                qw.andSub((Class<S>) ((List) o).get(0), subQuery, leftClz.toArray(new Class[leftClz.size()]));
            } else {
                leftClz.add((Class<S>) o);
            }
        }
        Class<? extends Item>[] leftArray = leftClz.toArray(new Class[leftClz.size()]);
        for (String reqName : lastQueryPathFieldName) {
            if (queryPath.get(queryPath.size() - 1) instanceof Class) {
                if (opt == Opt.in || opt == Opt.notIn) {
                    qw.in(true, reqName, (val instanceof List ? ((List) val).toArray() : (Object[]) val), tran, leftArray);
                } else if (opt == Opt.between || opt == Opt.notBetween) {
                    qw.between(true, reqName, ((List) val).get(0), ((List) val).get(1), tran, leftArray);
                } else if (opt == Opt.eq || opt == Opt.ne) {
                    qw.eq(true, reqName, val, tran, leftArray);
                } else if (opt == Opt.like || opt == Opt.notLike) {
                    qw.like(true, reqName, "%" + val + "%", tran, leftArray);
                } else if (opt == Opt.isNotNull ) {
                    qw.isNotNull((Boolean) val, reqName, leftArray);
                } else if ( opt == Opt.isNull){
                    qw.isNull((Boolean) val, reqName, leftArray);
                }else if (opt == Opt.startsWith || opt == Opt.endsWith
                        || opt == Opt.gt
                        || opt == Opt.goe
                        || opt == Opt.lt
                        || opt == Opt.loe
                ) {
                    qw.startsWith(true, reqName, val, tran, leftArray);
                }
            }
        }
        return qw;
    }

    /**
     * 获得obj里的idName属性的值
     *
     * @param objVal 一条记录信息（可能是元组->说明里面存对象是VODto）
     * @param idName 取得字段的信息
     * @return
     */
    public String getObjIdVal(Object objVal, String idName) {
        if (objVal instanceof IdBean) {
            return (String) ReflectionUtils.getFieldValue(objVal, idName);
        } else {
            Tuple voTuple = (Tuple) objVal;
            VoDto voDto = GlobalData.voDto(voTuple.get(0, VoBean.class).getClass());
            Integer index = voDto.getLoseIds().get(idName);
            if (index == null) {
                return (String) ReflectionUtils.getFieldValue(
                        voTuple.get(0, IdBean.class), idName);
            } else {
                return voTuple.get(index + 1, String.class);
            }
        }
    }
}
