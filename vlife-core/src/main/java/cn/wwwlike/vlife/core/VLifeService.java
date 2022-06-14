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
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.SaveDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.DELETE_TYPE;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE;

/**
 * ??? service 做什么事情，不能仅是dao的调用，应该吧dao里的逻辑写在这里面
 * 思路 ：
 * service 里获取entity,saveBean,req封装的信息
 * dao里   使用querydsl进行表操作
 * <p>
 * 思考：
 * 1. join数据结构的封装
 * 2. bean对象从缓存的读取与设置
 * 3.
 *
 * @param <T>
 * @param <D>
 */
@Transactional
public class VLifeService<T extends Item, D extends VLifeDao<T>> {
    @Autowired
    public D dao;
    public Class<T> entityClz;

    public D getDao() {
        return dao;
    }

    @PostConstruct
    public void init() throws ClassNotFoundException {
        entityClz = GenericsUtils.getSuperClassGenricType(this.getClass());

    }

    /**----------------------------1.实体类查询--------------------------*/
    /**
     * 根据id查询单个实体
     *
     * @param id
     * @return
     */
    public T findOne(String id) {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).eq("id", id);
        List<T> list = dao.find(wrapper);
        if (list.size() > 0) {
            return list.get(0);
        }
        return null;
    }

    /**
     * 根据id数组进行集合查询
     *
     * @param ids
     * @return
     */
    public List<T> findByIds(String... ids) {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).in("id", ids);
        return dao.find(wrapper);
    }

    ;

    /**
     * 查询全部
     *
     * @return
     */
    public List<T> findAll() {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz);
        return dao.find(wrapper);
    }

    /**
     * 查询全部排序
     *
     * @return
     */
    public List<T> findAll(OrderRequest order) {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz);
        return dao.query(entityClz, wrapper, null, order);
    }

    /**
     * 根据单个字段查询
     *
     * @param property
     * @param val
     * @return
     */
    public List<T> find(String property, Object val) {
        return dao.find(QueryWrapper.of(entityClz).eq(property, val));
    }

    /**
     * 根据req查询条件查询实体列表
     *
     * @param req
     * @param <E>
     * @return
     */
    public <S extends QueryWrapper, E extends CustomQuery<T, S>> List<T> find(E req) {
        return dao.find(req);
    }

    ;

    /**
     * 查询数量
     *
     * @param req
     * @return
     */
    public <S extends QueryWrapper, E extends CustomQuery<T, S>> long count(E req) {
        return dao.count(req.qw());
    }

    /**
     * 分页查询
     *
     * @param pageRequest
     * @param <E>
     * @return
     */
    public <E extends PageQuery<T>> PageVo<T> findPage(E pageRequest) {
        return dao.findPage(pageRequest);
    }


    /**-----------------------------------------------------------------*/
    /**----------------------------2.VO对象查询--------------------------*/
    /**
     * -----------------------------------------------------------------
     */


    public <E extends VoBean<T>> E queryOne(Class<E> voClz, String id) {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).eq("id", id);
        List<E> list = dao.query(voClz, wrapper, null, null);
        if (list != null && list.size() == 1) {
            return list.get(0);
        }
        return null;
    }

    /**
     * VO列表查询
     *
     * @param vo
     * @param request
     * @return
     */
    public <D extends VoBean<T>, S extends QueryWrapper, E extends CustomQuery<T, S>> List<D> query(Class<D> vo, E request) {
        return dao.query(vo, request.qw(entityClz), null, request.getOrder());
    }

    /**
     * 分页查询vo
     *
     * @param vo
     * @param request
     * @param <E>
     * @return
     */
    public <E extends VoBean<T>, N extends PageQuery<T>> PageVo<E> queryPage(Class<E> vo, N request) {
        return dao.queryPage(vo, request);
    }

    /**-----------------------------------------------------------------*/
    /**----------------------------3.delete--------------------------*/
    /**-----------------------------------------------------------------*/

    /**
     * 默认级联删除原则规范
     * 1. 不进行物理删除
     * 2. 关联表有且只有有本表作为外键，那么删除主表的同时那么对这张关联表也进行逻辑删除；
     * 3. 如果关联表有多个表作为外键，则清空关联关系——> clear;
     * 4. 进行逻辑删除的表，会递归完成删除操作；
     * 5. 多对多的表如何做？有且只有2张表可以看做多对多的表；切没有其他多余字段；删除关联一方数据则会把这个多对对多的表给删除掉（逻辑）
     * 根据外键删除（status）,只负责自己表本身,关联表的处理在service里进行
     */

    public long remove(String id) {
        return remove(entityClz, id);
    }

    private long remove(Class<? extends Item> itemClz, String id) {
        EntityDto entityDto = GlobalData.entityDto(itemClz);

        List<Class<? extends Item>> relationClz = entityDto.getRelationTableClz();
        for (Class<? extends Item> clz : relationClz) {
            EntityDto delEntityDto = GlobalData.entityDto(clz);


            QueryWrapper wrapper = new QueryWrapper(clz);
            String fkName = delEntityDto.getFkMap().get(itemClz);
            wrapper.eq(fkName, id);
            List<? extends Item> data = dao.query(clz, wrapper, null, null);
            if (data != null && data.size() > 0) {

                String deltype = delRelation(entityDto, delEntityDto);
                ;

                for (Item item : data) {
                    if (DELETE_TYPE.REMOVE.equals(deltype)) {
                        remove(clz, item.getId());
                    } else if (DELETE_TYPE.CLEAR.equals(deltype)) {
                        ReflectionUtils.setFieldValue(item, fkName, null);
                        dao.save(item);
                    }
                }
            }
        }

        return dao.remove(itemClz, id);
    }

    /**
     * 删除通过dto里的map取，若无则计算删除表的关系
     *
     * @param main 主表
     * @param del  被删除的子表
     * @return
     */
    private String delRelation(EntityDto main, EntityDto del) {
        String delType = main.getDeleteMap().get(del.getClz());
        if (delType == null) {

            boolean delByRule = (del.getFkTableClz().size() == 1 || del.isM2M());
            if (delByRule) {
                delType = DELETE_TYPE.REMOVE;
            } else {
                delType = DELETE_TYPE.CLEAR;
            }
        }
        return delType;
    }


    /**
     * 物理删除
     *
     * @param id
     * @return
     */
    public long delete(String id) {
        return dao.delete(id);
    }

    /**
     * 批量物理删除
     *
     * @param ids
     * @return
     */
    public long batchDel(String... ids) {
        long i = 0;
        for (String id : ids) {
            i += delete(id);
        }
        return i;
    }

    /**
     * 批量逻辑删除
     *
     * @param ids
     * @return
     */
    public long batchRm(String... ids) {
        long i = 0;
        for (String id : ids) {
            i += remove(entityClz, id);
        }
        return i;
    }


    /**
     * 实体类查询（和下面的重复了）这里是public,规范让子类不能保存其他类的数据
     *
     * @return
     */
    public T save(T t) {
        return saveBean(t, true);
    }

    ;

    /**
     * saveBean对象保存 dto保存
     * 1. 保存主类
     * 2. 保存关联类（1对多，多对多，多对1的关联保存）
     * 3. 对于本次没提交的进行数据清除
     *
     * @param saveBean
     * @param <E>
     * @return
     */
    public <E extends SaveBean<T>> E save(E saveBean, boolean isFull) {
        return saveBean(saveBean, isFull);
    }

    /**
     * 默认都是传入的非全量数据，所以不对为提交的数据进行操作
     *
     * @param saveBean
     * @param <E>
     * @return
     */
    public <E extends SaveBean<T>> E save(E saveBean) {
        return saveBean(saveBean, false);
    }

    private <E extends IdBean> E saveBean(final E idBean, boolean isFull) {
        return saveBean(idBean, null, null, null, isFull);
    }

    public DataProcess createProcess(IdBean bean) {
        return new HealthDataProcess(bean);
    }

    private <E extends IdBean> E saveBean(final E beanDto, Class<? extends Item> fkItemClz, String fkItemId, UnaryOperator<DataProcess> callBackMethod, boolean subIsFull) {
        DataProcess masterProcess = callBackMethod == null ? createProcess(beanDto) : callBackMethod.apply(createProcess(beanDto));
        if (beanDto instanceof SaveBean) {
            boolean editModel = beanDto.getId() == null ? false : true;
            SaveBean saveBean = (SaveBean) beanDto;
            Class<? extends Item> entityClz = GenericsUtils.getGenericType(saveBean.getClass());
            EntityDto entityDto = GlobalData.entityDto(entityClz);
            if (fkItemClz != null && fkItemId != null) {
                masterProcess.setVal(entityDto.getFkMap().get(fkItemClz), fkItemId);
            }
            SaveDto saveDto = GlobalData.saveDto(saveBean.getClass());
            saveDto.filter(ITEM_TYPE.ENTITY, ITEM_TYPE.SAVE).stream().filter(
                    fieldDto -> {
                        Class fkClz = fieldDto.getEntityClz();
                        return entityDto.getFkTableClz().contains(fkClz) &&
                                ReflectionUtils.getFieldValue(saveBean, fieldDto.getFieldName()) != null
                                ;
                    }
            ).forEach(dto -> {
                IdBean bean = (IdBean) ReflectionUtils.getFieldValue(saveBean, dto.getFieldName());
                bean = saveBean(bean, null, null, callBackMethod, false);
                String fkIdName = entityDto.getFkMap().get(dto.getEntityClz());
                masterProcess.setVal(fkIdName, bean.getId());
            });
            String masterId = dao.save(saveBean, masterProcess.getColumnValMap()).getId();
            saveDto.filter(ITEM_TYPE.ENTITY, ITEM_TYPE.VO, ITEM_TYPE.LIST).stream().filter(
                    fieldDto -> {
                        Class fkClz = fieldDto.getEntityClz();
                        return entityDto.getRelationTableClz().contains(fkClz);
                    }
            ).forEach(fieldDto -> {
                Object bean = ReflectionUtils.getFieldValue(saveBean, fieldDto.getFieldName());

                if (subIsFull && editModel) {
                    removeRelationEntity(fieldDto, entityDto, saveBean);
                }
                if (bean instanceof IdBean) {
                    saveBean((IdBean) bean, entityClz, masterId, callBackMethod, false);
                } else if (bean instanceof List) {
                    for (Object b : (List) bean) {
                        if (b instanceof IdBean) {
                            saveBean((IdBean) b, entityClz, masterId, callBackMethod, false);
                        } else if (b.getClass().isPrimitive()
                                || b instanceof Date
                                || b instanceof String) {
                            Class saveClz = fieldDto.getEntityClz();
                            EntityDto itemDto = GlobalData.entityDto(saveClz);
                            if (itemDto.isM2M()) {


                                Item m2mItem = null;
                                QueryWrapper req = QueryWrapper.of(saveClz);
                                req.eq(itemDto.getFkMap().get(entityClz), masterId);
                                req.eq(fieldDto.getEntityFieldName(), b);
                                try {
                                    m2mItem = (Item) saveClz.newInstance();
                                    ReflectionUtils.setFieldValue(m2mItem, itemDto.getFkMap().get(entityClz), masterId);
                                    ReflectionUtils.setFieldValue(m2mItem, fieldDto.getEntityFieldName(), b);
                                } catch (Exception exception) {
                                }
                                List<? extends Item> list = dao.query(saveClz, req, null, null);
                                if (list == null || list.size() == 0) {
                                    saveBean(m2mItem, null, null, callBackMethod, false);
                                }
                            } else {
                                QueryWrapper wrapper = QueryWrapper.of(fieldDto.getEntityClz());
                                wrapper.eq("id", b);

                                List<? extends Item> list = dao.query(fieldDto.getEntityClz(), wrapper, null, null);
                                if (list != null && list.size() > 0) {

                                    saveBean(list.get(0), entityClz, masterId, callBackMethod, false);
                                }
                            }
                        }
                    }
                }
            });
            List<Class<? extends Item>> relationItems = entityDto.getRelationTableClz();
            saveDto.filter(ITEM_TYPE.LIST).stream().filter(
                    fieldDto -> {
                        Class fkClz = fieldDto.getEntityClz();
                        return !relationItems.contains(fkClz)
                                && fieldDto.getEntityClz() != null;
                    }
            ).forEach(fieldDto -> {
                relationItems.forEach(item -> {
                    EntityDto m2mDto = GlobalData.entityDto(item);
                    String rigthFkName = m2mDto.getFkMap().get(fieldDto.getEntityClz());
                    String leftFkName = m2mDto.getFkMap().get(entityClz);
                    if (rigthFkName != null && leftFkName != null && m2mDto.isM2M()) {
                        List<? extends IdBean> beans = (List<? extends IdBean>) ReflectionUtils.getFieldValue(saveBean, fieldDto.getFieldName());
                        if(beans!=null){
                        List<? extends Item> existDbItem = new ArrayList<>();
                        if (editModel) {
                            QueryWrapper wrapper = new QueryWrapper(m2mDto.getClz());
                            wrapper.eq(leftFkName, masterId);
                            existDbItem = dao.query(m2mDto.getClz(), wrapper, null, null);
                        }
                        if (subIsFull && editModel) {
                            List<String> commitIds = beans.stream()
                                    .filter(idBean1 -> idBean1.getId() != null).map(IdBean::getId).collect(Collectors.toList());
                            existDbItem.forEach(db -> {
                                if (!commitIds.contains(ReflectionUtils.getFieldValue(db, rigthFkName))) {
                                    remove(m2mDto.getClz(), db.getId());
                                }
                            });
                        }
                            for (IdBean b : beans) {
                                String m2mId = saveBean(b, null, null, callBackMethod, false).getId();
                                if (!existDbItem.stream().map(db -> ReflectionUtils.getFieldValue(db, rigthFkName)).collect(Collectors.toList()).contains(m2mId)) {
                                    try {
                                        Item m2mEntity = m2mDto.getClz().newInstance();
                                        ReflectionUtils.setFieldValue(m2mEntity, leftFkName, masterId);
                                        ReflectionUtils.setFieldValue(m2mEntity, rigthFkName, m2mId);
                                        saveBean(m2mEntity, null, null, callBackMethod, false);
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            }
                        }
                    }
                });
            });
        } else if (beanDto instanceof Item) {
            EntityDto entityDto = GlobalData.entityDto((Class<? extends Item>) beanDto.getClass());
            if (fkItemClz != null) {
                ReflectionUtils.setFieldValue(beanDto, entityDto.getFkMap().get(fkItemClz), fkItemId);
            }
            masterProcess.getColumnValMap().forEach((k, v) -> {
                ReflectionUtils.setFieldValue(beanDto, k, v);
            });
            dao.save((Item) beanDto);
        }
        return beanDto;
    }

    private List<String> getIds(IdBean... idBeans) {
        return getIdList(Arrays.asList(idBeans), "id");
    }

    /**
     * step1 将本次提交的子表数据与库里存在的数据进行分析，本次没提交但是又存在数据库里的将要被删除
     * step2 调用删除方法->   remove(subItem, db2.getId());
     *
     * @param fieldDto
     * @param entityDto
     * @param saveBean
     */
    private void removeRelationEntity(FieldDto fieldDto, EntityDto entityDto, SaveBean saveBean) {
        Object bean = ReflectionUtils.getFieldValue(saveBean, fieldDto.getFieldName());

        QueryWrapper wrapper = new QueryWrapper(fieldDto.getEntityClz());
        Class<? extends Item> subItemClz = fieldDto.getEntityClz();
        EntityDto subEntityDto = GlobalData.entityDto(fieldDto.getEntityClz());
        String fkName = subEntityDto.getFkMap().get(entityClz);
        wrapper.eq(fkName, saveBean.getId());
        List<? extends Item> existDb = dao.query(subItemClz, wrapper, null, null);

        final List<String> thisCommitIds = new ArrayList<>();
        if (bean != null) {
            if (bean instanceof IdBean) {
                thisCommitIds.addAll(getIds((IdBean) bean));
            } else if (bean instanceof List) {
                List list = (List<IdBean>) bean;
                if (list.size() > 0 && list.get(0) instanceof IdBean) {
                    thisCommitIds.addAll(getIdList(list, "id"));
                }
                if (list.size() > 0 && (list.get(0).getClass().isPrimitive()
                        || list.get(0) instanceof Date
                        || list.get(0) instanceof String)) {
                    thisCommitIds.addAll((List<String>) bean);
                }
            }
        }
        String deltype = delRelation(entityDto, subEntityDto);
        ;
        existDb.stream().filter(db -> {
            Object id = ReflectionUtils.getFieldValue(db, fieldDto.getEntityFieldName() == null ? "id" : fieldDto.getEntityFieldName());
            return !thisCommitIds.contains(id);
        }).forEach(dbSubItem -> {
            if (DELETE_TYPE.REMOVE.equals(deltype)) {
                remove(subItemClz, dbSubItem.getId());
            } else if (DELETE_TYPE.CLEAR.equals(deltype)) {
                ReflectionUtils.setFieldValue(dbSubItem, fkName, null);
                dao.save(dbSubItem);
            }
        });
    }

    /**
     * 将bean里的指定字段封成一个LIST对象输出
     *
     * @param idBeans
     * @param fkIdName
     * @return
     */
    private List getIdList(List<? extends IdBean> idBeans, String fkIdName) {
        return idBeans.stream().map(bean -> {
            return ReflectionUtils.getFieldValue(bean, fkIdName);
        }).filter(str -> str != null).collect(Collectors.toList());
    }

    /**
     * 回调保存
     *
     * @param t
     * @param <E>
     * @return
     */
    public <E extends SaveBean<T>> E save(E t, UnaryOperator<DataProcess> callBackMethod) {
        return saveBean(t, null, null, callBackMethod, false);
    }
    /**
     * 回调保存
     *
     * @param t
     * @param <E>
     * @return
     */
    public <E extends SaveBean<T>> E save(E t, UnaryOperator<DataProcess> callBackMethod, boolean isfull) {
        return saveBean(t, null, null, callBackMethod, isfull);
    }

}
