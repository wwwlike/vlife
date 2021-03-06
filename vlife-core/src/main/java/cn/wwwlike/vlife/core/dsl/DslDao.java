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

import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.bean.PageVo;
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
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.querydsl.core.QueryResults;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.ComparableExpression;
import com.querydsl.core.types.dsl.ComparableExpressionBase;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPADeleteClause;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Sort;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ???queryDsl?????????dao??????
 * @author xiaoyu
 * @date 2022/5/30
 */
public class DslDao<T extends Item> extends QueryHelper implements VLifeDao<T> {
    /**
     * ????????????????????????
     */
    public EntityDto entityDto;
    /**
     * VO??????????????????????????????
     */
    public Map<Class<? extends IdBean>, QModel> models = new HashMap<>();
    /**
     * ????????????????????????
     */
    public Map<Class<? extends IdBean>, WModel> wModels = new HashMap<>();
    protected JPAQueryFactory factory;
    @PersistenceContext
    protected EntityManager em;
    /**
     * ??????clz??????
     */
    protected Class<T> entityClz;

    /**
     * ???????????????
     */
    @PostConstruct
    public void init() throws ClassNotFoundException {
        entityClz = GenericsUtils.getSuperClassGenricType(this.getClass());
        entityDto = GlobalData.entityDto(entityClz);
        factory = new JPAQueryFactory(em);
    }

    /**
     * ????????????VO???????????????Dao?????????VO???????????????
     */
    protected QModel select(Class<? extends IdBean> voClz) {
        if (models.get(voClz) == null) {
            models.put(voClz, new VoModel(factory, voClz));
        }
        return models.get(voClz);
    }

    /**
     * ??????VO???????????????(?????????new)
     * @param prefix ??????vo???????????????alias?????????
     */
    protected QModel selectNew(Class<? extends IdBean> vo, String prefix) {
        return new VoModel(factory, vo, prefix);
    }

    /**
     * ????????????????????????dto?????????????????????Model??????
     */
    private WModel edit(Class<? extends IdBean> dto) {
        if (wModels.get(dto) == null) {
            wModels.put(dto, new WriteModel(factory, dto));
        }
        return wModels.get(dto);
    }

    /**
     * ????????????????????????????????????
     * @param entityVoClz ????????????CLz??????
     * @param wrapper     ????????????
     * @param page        ????????????
     * @param order       ????????????
     * @param <E>
     * @return JpaQuery
     */
    protected <E extends IdBean> JPAQuery dslQuery(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, PageableRequest page, OrderRequest order) {
        QModel model = select(entityVoClz);
        wrapper.eq("status", "1");
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
     * ?????????????????????VO??????????????????????????????
     * @param vo ???????????????????????????
     * @param wrapper ??????????????????
     * @param isMainQuery ????????????????????????(?????????????????????)
     * @param page ????????????
     * @param order ????????????
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
     * ????????????????????? VO and DO ??????????????????????????????
     * @param entityVoClz ????????????????????????
     * @param wrapper   ????????????
     * @param page ????????????
     * @param order ????????????
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
     * ?????????????????????????????????
     */
    @Override
    public Long count(QueryWrapper<T> wrapper) {
        return dslQuery(entityClz, wrapper, null, null).fetchCount();
    }

    /**
     * ???????????????????????????????????????
     */
    @Override
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> Long count(R request) {
        return dslQuery(entityClz, request.qw(), null, null).fetchCount();
    }

    /**
     * ???????????????????????????<CustsomQuery>??????????????????<T>?????????????????????
     */
    @Override
    public <W extends QueryWrapper<T>, R extends CustomQuery<T, W>> List<T> find(R request) {
        return dslQuery(entityClz, request.qw(), null, request.getOrder()).fetch();
    }

    /**
     * ??????????????????????????????<T>?????????????????????
     */
    @Override
    public List<T> find(QueryWrapper<T> wq) {
        return find(entityClz, wq, null, null);
    }

    /**
     * ???????????????????????????????????????????????????????????????
     */
    @Override
    public <E extends PageQuery<T>> PageVo<T> findPage(E pageRequest) {
        QueryResults queryResults = dslQuery(entityClz, pageRequest.qw(entityClz), pageRequest.getPager(), pageRequest.getOrder()).fetchResults();
        List list = queryResults.getResults();
        return new PageVo(list, pageRequest.getPager().getSize(),
                pageRequest.getPager().getPage(), queryResults.getTotal());
    }

    /**
     * ??????????????????????????????????????????VO???class????????????VO????????????
     */
    @Override
    public <E extends VoBean<T>, N extends PageQuery<T>> PageVo<E> queryPage(Class<E> vo, N pageRequest) {
        QueryResults queryResults = dslQuery(vo, pageRequest.qw(entityClz), pageRequest.getPager(), pageRequest.getOrder()).fetchResults();
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
     * ???????????????????????????VO???class????????????VO???DO?????????
     * @param entityVoClz ????????????VO?????????
     * @param wrapper ??????????????????
     * @param order ????????????
     */
    @Override
    public <E extends IdBean> List<E> query(Class<E> entityVoClz, QueryWrapper<? extends Item> wrapper, OrderRequest order) {
        if (VoBean.class.isAssignableFrom(entityVoClz)) {
            return (List<E>) query((Class<? extends VoBean>) entityVoClz, wrapper, null, order, true);
        } else {
            return find(entityVoClz, wrapper, null, order);
        }
    }

    /**
     * ???????????????
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
     * SaveDto????????????
     * @param saveBean  ?????????dto??????
     * @param fkMap ???????????????saveBean??????DO????????????map??????
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
     * ?????????????????????ID??????????????????
     */
    @Override
    public long delete(String id) {
        return delete(entityClz, id);
    }

    /**
     * ????????????itemClz???ID??????????????????
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
     * ????????????itemClz???ID??????????????????
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
     * (???)???????????????????????????jpaQuery???
     */
    private JPAQuery page(JPAQuery jQuery, PageableRequest pageRequest) {
        jQuery.offset(pageRequest.getPage() * pageRequest.getSize());
        jQuery.limit(pageRequest.getSize());
        return jQuery;
    }

    /**
     * (???)?????????????????????jpaQuery???
     * @param  main ??????????????????????????????????????????????????????
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
     * VO?????????????????????????????????
     * @param vo         ????????????Vo???clz??????
     * @param mainResult ?????????vo??????????????????????????????????????????
     */
    private void iocQuery(Class<? extends VoBean> vo, List mainResult) {
        if (mainResult.size() > 0) {
            VoDto voDto = GlobalData.voDto(vo);
            List<FieldDto> iocFields = voDto.getFields().stream().filter(
                    fieldDto -> {
                        return !VCT.ITEM_TYPE.BASIC.equals(fieldDto.getFieldType());
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

}