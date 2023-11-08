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
import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.bi.Groups;
import cn.wwwlike.vlife.bi.ReportWrapper;
import cn.wwwlike.vlife.core.DataProcess;
import cn.wwwlike.vlife.core.VLifeDao;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.base.ISort;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.req.QueryUtils;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.querydsl.core.QueryResults;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.ComparableExpressionBase;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.objship.read.ItemReadTemplate.GSON;

/**
 * 以queryDsl方式的dao实现
 *
 * @author xiaoyu
 * @date 2022/5/30
 */
public class DslDao<T extends Item> extends QueryHelper implements VLifeDao<T> {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    /**
     * 当前类的实体信息
     */
    public EntityDto entityDto;
    /**
     * VO查询查询封装模型缓存
     */
    public Map<Class<? extends IdBean>, QModel> models = new HashMap<>();
    /**
     * 写入对象模型缓存
     */
    public Map<Class<? extends IdBean>, WModel> wModels = new HashMap<>();
    protected JPAQueryFactory factory;
    @PersistenceContext
    protected EntityManager em;
    /**
     * 实体clz类型
     */
    protected Class<T> entityClz;

    /**
     * 属性初始化
     */
    @PostConstruct
    public void init() throws ClassNotFoundException {
        entityClz = GenericsUtils.getSuperClassGenricType(this.getClass());
        entityDto = GlobalData.entityDto(entityClz);
        factory = new JPAQueryFactory(em);
    }

    /**
     * 通过视图VO类信息得到Dao封装的VO的查询模型
     */
    protected QModel select(Class<? extends IdBean> voClz) {
//        return new VoModel(factory, voClz);
        if (models.get(voClz) == null) {
            models.put(voClz, new VoModel(factory, voClz));
        }
        return models.get(voClz);
    }

    /**
     * 得到VO查询的模型(每次都new)
     *
     * @param prefix 本次vo里主查询的alias的前缀
     */
    protected QModel selectNew(Class<? extends IdBean> vo, String prefix) {
        return new VoModel(factory, vo, prefix);
    }

    /**
     * 通过传输保存对象dto从缓存提取写入Model模型
     */
    private WModel edit(Class<? extends IdBean> dto) {
        if (wModels.get(dto) == null) {
            wModels.put(dto, new WriteModel(factory, dto));
        } else {
            wModels.get(dto).resetClause();
        }
        return wModels.get(dto);
    }

    /**
     * ✦✦✦✦原子查询✦✦✦✦
     *
     * @param entityVoClz 查询对象CLz信息
     * @param wrapper     查询条件
     * @param page        分页条件
     * @param order       排序条件
     * @param <E>
     * @return JpaQuery
     */
    protected <E extends IdBean> JPAQuery dslQuery(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, PageableRequest page, OrderRequest order) {
        QModel model = select(entityVoClz);
        JPAQuery query = model.fromWhere(wrapper);
        if (page != null) {
            query = page(query, page);
        }
        if (order == null || order.getOrderReqList().size() == 0) {
            if (order == null) {
                order = new OrderRequest();
            }
            ISort sort = null;
            if (Item.class.isAssignableFrom(entityVoClz)) {
                sort = GlobalData.entityDto((Class<? extends Item>) entityVoClz);
            } else {
                sort = GlobalData.voDto((Class<? extends VoBean>) entityVoClz);
            }
            order.setOrders(sort.getOrders());
        }

        query = order(model.getMain(), query, order.getOrderReqList());
        return query;
    }

    /**
     * 用包装条件进行VO类型数据查询数据查询
     *
     * @param vo          返回查询的结果类型
     * @param wrapper     包裹条件对象
     * @param isMainQuery 本次是否是主查询(该方法支持递归)
     * @param page        分页参数
     * @param order       排序参数
     */
    private <E extends VoBean> List<E> query(Class<E> vo, QueryWrapper<? extends Item> wrapper, PageableRequest page, OrderRequest order, Boolean isMainQuery) {
        List mainResult = dslQuery(vo, wrapper, page, order).fetch();
        if (mainResult.size() > 0) {
            iocQuery(vo, mainResult);
        }
        VoDto voDto = GlobalData.voDto(vo);
        if (voDto.getLoseIds().size() > 0 && isMainQuery) {
            List<Tuple> tuplesResult = mainResult;
            mainResult = tuplesResult.stream().map(v -> v.get(0, Object.class)).collect(Collectors.toList());
        }
        return mainResult;
    }

    /**
     * 用包装条件进行 VO and DO 类型数据查询数据查询
     *
     * @param entityVoClz 返回视图的类信息
     * @param wrapper     包装条件
     * @param page        分页参数
     * @param order       排序参数
     * @param <E>
     * @return
     */
    private <E extends IdBean> List<E> find(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, PageableRequest page, OrderRequest order) {
        if (Item.class.isAssignableFrom(entityVoClz)) {
            return dslQuery(entityVoClz, wrapper, page, order).fetch();
        } else {
            return (List<E>) query((Class<VoBean>) entityVoClz, wrapper, page, order, true);
        }
    }

    /**
     * 用包装条件对象查询数量
     */
    @Override
    public Long count(QueryWrapper<T> wrapper) {
        return dslQuery(entityClz, wrapper, null, null).fetchCount();
    }

    /**
     * 终端传入的查询条件查询数量
     */
    @Override
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> Long count(R request) {
        return dslQuery(entityClz, request.qw(), null, null).fetchCount();
    }

    /**
     * 终端传入的查询条件<CustsomQuery>进行实体对象<T>列表数据的过滤
     */
    @Override
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> List<T> find(R request) {
        return dslQuery(entityClz, request.qw(), null, request.getOrder()).fetch();
    }

    /**
     * 包装条件进行实体对象<T>列表数据的过滤
     */
    @Override
    public List<T> find(QueryWrapper<T> wq) {
        return find(entityClz, wq, null, null);
    }


    /**
     * 通过终端入参的分页查询对象进行实体分页查询
     */
    @Override
    public <E extends PageQuery<T>> PageVo<T> findPage(E pageRequest) {
        QueryWrapper qw=pageRequest.qw(entityClz);
        if(pageRequest.getConditions()!=null){
            QueryUtils.condition(qw,pageRequest.getConditions());
        }
        if(pageRequest.getConditionGroups()!=null){
            QueryUtils.condition(qw,pageRequest.getConditionGroups());
        }
        QueryResults queryResults = dslQuery(entityClz, qw, pageRequest.getPager(), pageRequest.getOrder()).fetchResults();
        List list = queryResults.getResults();
        return new PageVo(list, pageRequest.getPager().getSize(),
                pageRequest.getPager().getPage(), queryResults.getTotal());
    }

    /**
     * 通过终端入参的分页查询对象和VO的class类型进行VO分页查询
     */
    @Override
    public <E extends VoBean<T>, N extends PageQuery<T>> PageVo<E> queryPage(Class<E> vo, N pageRequest) {
        QueryWrapper qw=pageRequest.qw(entityClz);
        if(pageRequest.getConditions()!=null){
            QueryUtils.condition(qw,pageRequest.getConditions());
        }
        if(pageRequest.getConditionGroups()!=null){
            QueryUtils.condition(qw,pageRequest.getConditionGroups());
        }
        QueryResults queryResults = dslQuery(vo, qw, pageRequest.getPager(), pageRequest.getOrder()).fetchResults();
        List mainResult = queryResults.getResults();
        VoDto voDto = GlobalData.voDto(vo);
        if (mainResult.size() > 0) {
            iocQuery(vo, mainResult);
        }
        if (voDto.getLoseIds().size() > 0) {
            List<Tuple> tuplesResult = mainResult;
            mainResult = tuplesResult.stream().map(v -> v.get(0, Object.class)).collect(Collectors.toList());
        }
        return new PageVo(mainResult, pageRequest.getPager().getSize(),
                pageRequest.getPager().getPage(), queryResults.getTotal());
    }

    /**
     * 通过条件包装对象和VO的class类型进行VO和DO的查询
     *
     * @param entityVoClz 实体类或VO类信息
     * @param wrapper     条件包装对象
     * @param order       排序对象
     */
    @Override
    public <E extends IdBean> List<E> query(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, OrderRequest order) {
//        logger.info("当前查询"+entityVoClz.getTypeName());
        if (VoBean.class.isAssignableFrom(entityVoClz)) {
            return (List<E>) query((Class<? extends VoBean>) entityVoClz, wrapper, null, order, true);
        } else {
            return find(entityVoClz, wrapper, null, order);
        }
    }

    /**
     * 实体类保存
     */
    @Override
    public <E extends Item> E save(E item) {
        if (item.getId() == null) {
            em.persist(item);
        } else {
            em.merge(item);
        }
        return item;
    }

    /**
     * 实体对象数据保存（需要数据加工处理的形式）
     * 通过dataProcess来实现下面三种
     * 1支持保存之前设置默认值;
     * 2可只对固定字段进行保存；
     * 3可排除部分字段进行保存
     */
    @Override
    public <E extends Item> E save(E item, DataProcess dataProcess) {
        WModel wmodel = edit(item.getClass());
        EntityPathBase<? extends Item> saveEntityPath = getItemEntityPath(item.getClass());
        if (item.getId() == null) { //新增则过滤掉不参与到保存的字段
            if (dataProcess.getAssigns() != null) { //指定
                Arrays.stream(item.getClass().getFields()).map(Field::getName).filter(name -> {
                    return !dataProcess.getAssigns().contains(name);
                }).forEach(name -> {
                    ReflectionUtils.setFieldValue(item, name, null);
                });
            } else if (dataProcess.getIgnores() != null) { //排除
                Arrays.stream(item.getClass().getFields()).map(Field::getName).filter(name -> {
                    return dataProcess.getIgnores().contains(name);
                }).forEach(name -> {
                    ReflectionUtils.setFieldValue(item, name, null);
                });
            }
            em.persist(item);
        } else {// 修改则直接对参与的字段拼接成querydsl语法保存
            StringPath idPath = (StringPath) ReflectionUtils.getFieldValue(saveEntityPath, "id");
            wmodel.where(idPath.eq(item.getId()));
            if (dataProcess.getAssigns() != null) {
                wmodel.setValWithAssign(item, dataProcess.getAssigns().toArray(new String[dataProcess.getAssigns().size()]));
            } else {
                wmodel.setVal(item, dataProcess.getIgnores().toArray(new String[dataProcess.getIgnores().size()]));
            }
            Map<String, Object> columnValMap = dataProcess.getColumnValMap();
            columnValMap.forEach((k, v) -> {
                Path fnNameDsl = (Path) ReflectionUtils.getFieldValue(saveEntityPath, k);
                wmodel.getUpdateClause().set(fnNameDsl, v);
            });
            wmodel.getUpdateClause().execute();
        }
        return item;
    }

//    /**
//     * 实体类数据保存。采用querydsl方式保存
//     * 其中实体类修改；status和creteDate不能修改或者清空
//     */
//    public <E extends Item> E save(E item, Map<String, Object> fkMap) {
//        if (item.getId() == null) {
//            em.persist(item);
//        } else { //这里可以和saveBean
//            WModel wmodel = edit(item.getClass());
//            EntityPathBase<? extends Item> saveEntityPath = getItemEntityPath(item.getClass());
//            StringPath idPath = (StringPath) ReflectionUtils.getFieldValue(saveEntityPath, "id");
//            wmodel.where(idPath.eq(item.getId()))
//                    .setVal(item,"status","createDate");
//            fkMap.forEach((k, v) -> {
//                Path fnNameDsl = (Path) ReflectionUtils.getFieldValue(saveEntityPath, k);
//                wmodel.getUpdateClause().set(fnNameDsl, v);
//            });
//            wmodel.getUpdateClause().execute();
//        }
//        return item;
//    }

    /**
     * SaveDto数据保存
     *
     * @param saveBean 保存的dto数据
     * @param fkMap    可以写入到saveBean对应DO里的外键map集合
     */
    @Override
    public <E extends SaveBean> E save(E saveBean, Map<String, Object> fkMap) {
        WModel wmodel = edit(saveBean.getClass());
        if (saveBean.getId() != null) {
            Class<T> saveEntityClz = GenericsUtils.getGenericType(saveBean.getClass());
            EntityPathBase<? extends Item> saveEntityPath = getItemEntityPath(saveEntityClz);
            StringPath idPath = (StringPath) ReflectionUtils.getFieldValue(saveEntityPath, "id");
            wmodel.where(idPath.eq(saveBean.getId()))
                    .setVal(saveBean);
            fkMap.forEach((k, v) -> {
                Path fnNameDsl = (Path) ReflectionUtils.getFieldValue(saveEntityPath, k);
                wmodel.getUpdateClause().set(fnNameDsl, v);
            });
            wmodel.getUpdateClause().execute();
        } else {
            Item item = wmodel.dtoToEntity((SaveBean) saveBean);
            fkMap.forEach((k, v) -> {
                ReflectionUtils.setFieldValue(item, k, v);
            });
            save(item);
            saveBean.setId(item.getId());
        }
        return saveBean;
    }

    /**
     * 物理删除当前表ID所在的行数据
     */
    @Override
    public long delete(String id) {
        return delete(entityClz, id);
    }

    /**
     * 物理删除itemClz表ID所在的行数据
     */
    @Override
    public long delete(Class<? extends Item> itemClz, String id) {
        Object item = em.find(itemClz, id);
        if (item != null) {
            em.remove(item);
            return 1;
        }
        return 0;
    }

    /**
     * 逻辑删除itemClz表ID所在的行数据
     */
    @Override
    public long remove(Class<? extends Item> clazz, String id) {
        Item item = em.find(clazz, id);
        if (item != null) {
            item.setStatus(CT.STATUS.REMOVE);
            em.merge(item);
            return 1;
        }
        return 0;
    }

    /**
     * (私)分页过滤条件注入到jpaQuery里
     */
    private JPAQuery page(JPAQuery jQuery, PageableRequest pageRequest) {
        jQuery.offset((pageRequest.getPage() - 1) * pageRequest.getSize());
        jQuery.limit(pageRequest.getSize());
        return jQuery;
    }

    /**
     * (私)排序条件注入到jpaQuery里
     *
     * @param main 排序目前值支持主查询里的字段进行排序
     */
    private JPAQuery order(EntityPathBase main, JPAQuery jQuery, List<Order> orderReqList) {
        orderReqList.stream().forEach(order -> {
            Sort.Direction direction = order.getDirection();
            ComparableExpressionBase expression =
                    (ComparableExpressionBase) ReflectionUtils.getFieldValue(main, order.getProperty());
            if (direction.isAscending())
                jQuery.orderBy(expression.asc());
            else
                jQuery.orderBy(expression.desc());
        });
        return jQuery;
    }

    /**
     * VO里的注入对象数据的查询
     *
     * @param vo         主查询的Vo的clz信息
     * @param mainResult 查询的vo里的主结果集对象，可能是元组
     */
    private void iocQuery(Class<? extends VoBean> vo, List mainResult) {
        if (mainResult.size() > 0) {
            VoDto voDto = GlobalData.voDto(vo);
            List<FieldDto> iocFields = voDto.getFields().stream().filter(
                    fieldDto -> {
                        return !VCT.ITEM_TYPE.BASIC.equals(fieldDto.getFieldType())
                                && (fieldDto.getVField()==null||fieldDto.getVField().skip()==false);
                    }).collect(Collectors.toList());
            for (FieldDto fieldDto : iocFields) {
                boolean iocList = (VCT.ITEM_TYPE.ENTITY.equals(fieldDto.getFieldType()) ||
                        VCT.ITEM_TYPE.VO.equals(fieldDto.getFieldType())) ? false : true;
                if (fieldDto.getPathName().indexOf("_") != -1) {
                    List<Class> pingList = VlifeUtils.queryPathClazzList(fieldDto.getQueryPath());
                    Class secondLastClz = pingList.get(pingList.size() - 2);
                    EntityDto secondLastEntityDto = GlobalData.entityDto(secondLastClz);
                    String idName = secondLastEntityDto.getFkMap().get(pingList.get(pingList.size() - 1));
                    idName = (idName == null ? "id" : idName);
                    List iocQueryPath = VlifeUtils.removeQueryPathLast(fieldDto.getQueryPath());
                    String mainIdName = idName.equals("id") ? voDto.getEntityDto().getFkMap().get(secondLastClz) : "id";
                    for (Object obj : mainResult) {
                        String idVal = getObjIdVal(obj, mainIdName);
                        if (idVal != null) {
                            QueryWrapper<T> wq = createWrapperFromQueryPath(null, iocQueryPath, idVal, Opt.eq, null, idName);
                            List sub = null;
                            if (Item.class.isAssignableFrom(fieldDto.getClz())) {
                                sub = query(fieldDto.getEntityClz(), wq, null);
                            } else if (fieldDto.getClz().isPrimitive()
                                    || fieldDto.getClz() == Date.class
                                    || fieldDto.getClz() == String.class) {
                                List<? extends Item> items = query(fieldDto.getEntityClz(), wq, null);

                                sub = items.stream().map(db -> {
                                    String fieldName = fieldDto.getEntityFieldName();
                                    return ReflectionUtils.getFieldValue(db, fieldName == null ? "id" : fieldName);
                                }).collect(Collectors.toList());
                            } else {
                                sub = query(fieldDto.getClz(), wq, null, null, true);
                            }
                            if (sub != null && sub.size() > 0) {
                                Object setval = sub;
                                if (!iocList) {
                                    setval = sub.get(0);
                                }
                                if (obj instanceof IdBean) {
                                    ReflectionUtils.setFieldValue(obj, fieldDto.getFieldName(), setval);
                                } else {
                                    ReflectionUtils.setFieldValue(((Tuple) obj).get(0, IdBean.class), fieldDto.getFieldName(), setval);
                                }
                            }
                        }
                    }
                } else {
                    EntityDto mainDto = voDto.getEntityDto();
                    EntityDto iocEntityDto = GlobalData.entityDto(fieldDto.getEntityClz());
                    Object[] ids = new Object[mainResult.size()];
                    QueryWrapper wq = QueryWrapper.of(fieldDto.getEntityClz());
                    if (mainDto.getFkMap().get(fieldDto.getEntityClz()) != null) {
                        if (mainResult.get(0) instanceof IdBean) {
                            ids = mainResult.stream().map(obj -> {
                                return ReflectionUtils.getFieldValue(obj, mainDto.getFkMap().get(fieldDto.getEntityClz()));
                            }).filter(
                                    id -> id != null
                            ).toArray();
                        } else {
                            ids = mainResult.stream().map(obj -> {
                                return ((Tuple) obj).get(voDto.getLoseIds().get(mainDto.getFkMap().get(fieldDto.getEntityClz())) + 1, String.class);
                            }).filter(
                                    id -> id != null
                            ).toArray();
                        }
                    } else {

                        if (mainResult.get(0) instanceof IdBean) {
                            ids = mainResult.stream().map(obj -> {
                                return (String) ReflectionUtils.getFieldValue(obj, "id");
                            }).filter(
                                    id -> id != null
                            ).toArray();
                        } else {
                            ids = mainResult.stream().map(obj -> {
                                return ((Tuple) obj).get(0, IdBean.class).getId();
                            }).filter(
                                    id -> id != null
                            ).toArray();
                        }
                    }
                    if (ids.length == 1) {
                        wq.eq(iocEntityDto.getFkMap().get(mainDto.getClz()), ids[0]);
                    } else {
                        wq.in(iocEntityDto.getFkMap().get(mainDto.getClz()), ids);
                    }
                    List iocResult = null;
                    if (Item.class.isAssignableFrom(fieldDto.getClz())) {
                        iocResult = find(fieldDto.getClz(), wq, null, null);
                    } else {
                        iocResult = query(fieldDto.getClz(), wq, null, null, false);
                    }
                    String subId = iocList ? fieldDto.getItemDto().getEntityType() + "Id" : "id";
                    String parentId = iocList ? "id" : fieldDto.getEntityType() + "Id";
                    setListSubBean(voDto, mainResult, iocResult, fieldDto.getFieldName(), parentId, subId);
                }
            }
        }
    }

    /**
     * 查询单一字段报表数据
     */
    public List report(ReportWrapper wrapper) {
        return report(new ArrayList<>(), wrapper);
    }

    /**
     * 查询一张报表
     */
    public List<Map> report(List<Map> all, ReportWrapper wrapper) {
        //单指标查询
        QModel<T> model = select(wrapper.getEntityClz());//产生： select * from xxx
        JPAQuery query = model.fromGroupWhere(wrapper); //过滤条件组装 where?
        List<Tuple> result=query.fetch();//统计结果
        //查询结果转换
        List<Groups> groups = wrapper.getGroups();
        List<String> columns = groups.stream().map(g -> {
            return g.getColumn() + (g.getFunc() != null ? "_" + g.getFunc() : "");
        }).collect(Collectors.toList());
        List currList = QueryHelper.tupletoMap( result,columns, wrapper.getCode());
        if (all.size() == 0) {
            return currList;
        }
        all = QueryHelper.join(currList, all, columns, wrapper.getCode());
        return all;
    }

    @Override
    public List dataCount(ReportWrapper wrapper) {
        QModel<T> model = select(wrapper.getEntityClz());//产生： select * from xxx
        JPAQuery query = model.fromGroupWhere(wrapper); //过滤条件组装 where?
        List<Tuple> result=query.fetch();//统计结果
        return result;
    }


}