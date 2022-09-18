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
import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.SaveDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.tran.LengthTran;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.DELETE_TYPE;
import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE;

/**
 * 数据逻辑处理封装service
 */
@Transactional
public class VLifeService<T extends Item, D extends VLifeDao<T>> {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

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

    //模型信息返回
    public BeanDto modelInfo(String modelName){
        BeanDto<T> dto=null;
        Optional<Class> t= GlobalData.getEntityDtos().keySet().stream().filter(clz->clz.getSimpleName().equalsIgnoreCase(modelName)).findAny();
        if(t.isPresent()) {
            dto = (BeanDto<T>) GlobalData.entityDto(t.get());
            return dto;
        }
        t= GlobalData.getSaveDtos().keySet().stream().filter(clz->clz.getSimpleName().equalsIgnoreCase(modelName)).findAny();
        if(t.isPresent()){
            dto= (BeanDto)GlobalData.getSaveDtos().get(t.get());
            return dto;
        }
        t= GlobalData.getVoDtos().keySet().stream().filter(clz->clz.getSimpleName().equalsIgnoreCase(modelName)).findAny();
        if(t.isPresent()){
            dto= (BeanDto)GlobalData.getVoDtos().get(t.get());
            return dto;
        }
        t= GlobalData.getReqDtos().keySet().stream().filter(clz->clz.getSimpleName().equalsIgnoreCase(modelName)).findAny();
        if(t.isPresent()){
            dto= (BeanDto)GlobalData.getReqDtos().get(t.get());
            return dto;
        }
        return dto;
    }



    /**----------------------------实体类查询(单体数据逻辑查询)--------------------------*/
    // ？id查询是否也应该addQueryFilter 根据用户的查询权限组进行一层过滤？，目前没有
    /**
     * 1.根据id查询单个实体
     */
    public T findOne(String id) {
        if(id==null){
            logger.error("findOne-> id is null");
          return null;
        }
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).eq("id", id);
        List<T> list = dao.find(wrapper);
        if (list.size() > 0) {
            return list.get(0);
        }
        return null;
    }

    /**
     * 2.根据id数组进行实体集合查询
     */
    public List<T> findByIds(String... ids) {
        if(ids==null || ids.length==0){
            logger.error("findByIds-> ids is null or length=0");
           return null;
        }
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).in("id", ids);
        return dao.find(wrapper);
    }

    /**
     * 3.查询全部实体
     */
    public List<T> findAll() {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz);
        wrapper=addQueryFilter(wrapper);
        return dao.find(wrapper);
    }

    /**
     * 4.查询全部实体(排序)
     * @return
     */
    public List<T> findAll(OrderRequest order) {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz);
        wrapper=addQueryFilter(wrapper);
        return dao.query(entityClz, wrapper, order);
    }

    /**
     * 5.单个属性查询实体列表
     */
    public List<T> find(String property, Object val) {
        QueryWrapper queryWrapper=QueryWrapper.of(entityClz).eq(property, val);
        queryWrapper=addQueryFilter(queryWrapper);
        return dao.find(queryWrapper);
    }

    /**
     * 6.条件包装对象查询实体列表
     */
    public <S extends QueryWrapper, E extends CustomQuery<T, S>> List<T> find(E request) {
        request=addQueryFilter(request);
        return dao.find(request);
    }

    /**
     * 根据包装对象查询实体
     */
    public List<T> find(QueryWrapper<T> qw){
        return dao.find(qw);
    }

    /**
     * 7.条件包装对象查询总数
     */
    public <S extends QueryWrapper, E extends CustomQuery<T, S>> long count(E request) {
        return dao.count(request.qw());
    }

    /**
     * 8.条件包装对象实体分页查询
     */
    public <E extends PageQuery<T>> PageVo<T> findPage(E pageRequest) {
        pageRequest=addQueryFilter(pageRequest);
        return dao.findPage(pageRequest);
    }

    /**--VO对象查询(包含数据逻辑处理，能实现定义VO的模型只要符合规则，就能查询的出来)---*/
    /**
     * 9. 根据ID和Vo类信息来查询单个Vo类对象
     */
    public <E extends VoBean<T>> E queryOne(Class<E> voClz, String id) {
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).eq("id", id);
        List<E> list = dao.query(voClz, wrapper, null);
        if (list != null && list.size() == 1) {
            return list.get(0);
        }
        return null;
    }


    /**
     * 9. vo根据ids集合查询
     */
    public <E extends VoBean<T>> List<E> queryByIds(Class<E> voClz,String... ids) {
        if(ids==null || ids.length==0){
            logger.error("findByIds-> ids is null or length=0");
            return null;
        }
        QueryWrapper<T> wrapper = QueryWrapper.of(entityClz).in("id", ids);
        List<E> list = dao.query(voClz, wrapper, null);
        return list;
    }

    /**
     * 10. 根据条件包装对象和Vo类信息来查询List<Vo>的集合数据
     */
    public <D extends VoBean<T>, S extends QueryWrapper, E extends CustomQuery<T, S>> List<D> query(Class<D> vo, E request) {
        request=addQueryFilter(request);
        return dao.query(vo, request.qw(entityClz), request.getOrder());
    }

    /**
     *11. 根据条件分页包装对象和Vo类信息来查询PageVO<Vo>的分页数据
     */
    public <E extends VoBean<T>, N extends PageQuery<T>> PageVo<E> queryPage(Class<E> vo, N request) {
        request=addQueryFilter(request);
        return dao.queryPage(vo, request);
    }


    /**---------------------------- remove 逻辑删除，delete 物理删除（建议不使用）--------------------------*/

    /**
     * 12 根据ID逻辑删除<T>类实体对象，以及能递归以<T>为外键的关联实体数据根据规则进行操作（逻辑删除，清除外键关系，不做操作）
     */
    public long remove(String id) {
        if(id==null){
            logger.error("remove-> id is null");
            return 0;
        }
        return remove(entityClz, id);
    }

    /**
     * 13 物理删除
     */
    public long delete(String id) {
        if(id==null){
            logger.error("delete-> id is null");
            return 0;
        }
        return dao.delete(id);
    }

    /**
     * 14 批量物理删除
     */
    public long batchDel(String... ids) {
        if(ids==null || ids.length==0){
            logger.error("batchDel-> ids is null or length=0");
            return 0;
        }
        long i = 0;
        for (String id : ids) {
            i += delete(id);
        }
        return i;
    }

    /**
     * 15 批量逻辑删除
     */
    public long batchRm(String... ids) {
        if(ids==null || ids.length==0){
            logger.error("batchRm-> ids is null or length=0");
            return 0;
        }
        long i = 0;
        for (String id : ids) {
            i += remove(entityClz, id);
        }
        return i;
    }

    /**----------------------------  dto数据保存 -----------------------------**/

    /**
     * 16 实体类对象保存
     * @param
     * @return
     */
    public T save(T beanDto) {
        DataProcess masterProcess =  createProcess(beanDto);
        return save(beanDto,masterProcess);
    }


    /**
     * 16-1 实体item保存
     * @param ignores 必须忽略不处理的字段
     */
    public T saveWithIgnore(T t,String ... ignores) {
        DataProcess masterProcess =  createProcess(t);
        masterProcess.setIgnores(ignores);
        return save(t,masterProcess);
    }

    /**
     * 16-2 实体item保存
     * @param assigns 指定保存的字段，指定之外的不需要处理
     */
    public T saveWithAssign(T t,String ... assigns) {
        DataProcess masterProcess =  createProcess(t);
        masterProcess.setAssigns(assigns);
        return save(t,masterProcess);
    }

    /**
     *  17 包装复杂dto模型保存(递归)
     * @param saveBean 复杂模型 模型数据入库(存在有新增与修改删除同时出现的情况)
     * @param isFull 为TRUE会对未提交的关联数据进行逻辑删除;
     */
    public <E extends SaveBean<T>> E save(E saveBean, boolean isFull) {
        return saveBean(saveBean, isFull);
    }

    /**
     * 18 dto对象保存（默认本次传入的是非全量数据）
     */
    public <E extends SaveBean<T>> E save(E saveBean) {
        return saveBean(saveBean, false);
    }

    /**
     * 19 保存之前调用callBackMethod方法进行逻辑处理后在save
     */
    public <E extends SaveBean<T>> E save(E t, UnaryOperator<DataProcess> callBackMethod, boolean isfull) {
        return saveBean(t, null, null, callBackMethod, isfull);
    }

    /**
     * 20 保存之前调用callBackMethod方法进行逻辑处理后在save (默认非全量数据)
     */
    public <E extends SaveBean<T>> E save(E t, UnaryOperator<DataProcess> callBackMethod) {
        return saveBean(t, null, null, callBackMethod, false);
    }



    /** -------------------------------------数据处理逻辑的封装方法(私有)-----------------------------------------------------

    /**
     * 支持VO，DO的保存方法
     */
    private <E extends IdBean> E saveBean(final E idBean, boolean isFull) {
        return saveBean(idBean, null, null, null, isFull);
    }


    /**
     * 删除逻辑，递归逻辑
     */
    private long remove(Class<? extends Item> itemClz, String id) {
        String[] ids= id.split(",");
        EntityDto entityDto = GlobalData.entityDto(itemClz);
        List<Class<? extends Item>> relationClz = entityDto.getRelationTableClz();
        //检查关联表，查看是否有作为外键字段的关联数据，且该表设置了不能删除的则删除结束
        for (Class<? extends Item> clz : relationClz) {
//            EntityDto delEntityDto = GlobalData.entityDto(clz);
            String delType = entityDto.getDeleteMap().get(clz);
            if(DELETE_TYPE.UNABLE.equals(delType)){
                QueryWrapper wrapper = QueryWrapper.of(clz)
                        .eq(ids.length==1,entityDto.getType()+"Id",id)
                        .in(ids.length>1,entityDto.getType()+"Id",ids);
                if(dao.query(clz, wrapper, null).size()>0){
                    return -1; //没有给出原因
                }
            }
        }
        for (Class<? extends Item> clz : relationClz) {
            EntityDto delEntityDto = GlobalData.entityDto(clz);
            QueryWrapper wrapper = new QueryWrapper(clz);
            String fkName = delEntityDto.getFkMap().get(itemClz);
            if(ids.length>1){
                wrapper.in(fkName,ids);
            }else{
                wrapper.eq(fkName, id);
            }
            List<? extends Item> data = dao.query(clz, wrapper, null);
            if (data != null && data.size() > 0) {
                String deltype = delRelation(entityDto, delEntityDto);
                for (Item item : data) {
                    if (DELETE_TYPE.REMOVE.equals(deltype)) {
                         long num=remove(clz, item.getId());
                         if(num==-1){//递归调用子集有不能删除的则整个都不能删除
                             return num;
                         }
                    } else if (DELETE_TYPE.CLEAR.equals(deltype)) {
                        ReflectionUtils.setFieldValue(item, fkName, null);
                        dao.save(item);
                    }
                }
            }
        }
        if(ids.length>1){
            int num=0;
            for(String i:ids){
                num+=dao.remove(itemClz, i);
            }
            return num;
        }else{
            return dao.remove(itemClz, id);
        }
    }

    /**
     * 实体类保存
     * 保存之前将数据处理类的设置关属值补充上去
     */
    protected  <I extends Item >I save(I beanDto,DataProcess masterProcess) {
        EntityDto entityDto = GlobalData.entityDto((Class<? extends Item>) beanDto.getClass());
        masterProcess.getColumnValMap().forEach((k, v) -> {
            ReflectionUtils.setFieldValue(beanDto, k, v);
        });
        dao.save(beanDto,masterProcess);
        return beanDto;
    }
    /**
     * 保存递归的核心逻辑处理
     *   1. 保存本表的外键表
     *   2. 保存本表
     *   3. 保存关联表
     */
    protected  <E extends IdBean> E saveBean(final E beanDto, Class<? extends Item> fkItemClz, String fkItemId, UnaryOperator<DataProcess> callBackMethod, boolean subIsFull) {
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
            //1.外键表
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
            //2. 本表保存
            String masterId = dao.save(saveBean, masterProcess.getColumnValMap()).getId();
            //3. 关联数据保存
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
                                List<? extends Item> list = dao.query(saveClz, req, null);
                                if (list == null || list.size() == 0) {
                                    saveBean(m2mItem, null, null, callBackMethod, false);
                                }
                            } else {
                                QueryWrapper wrapper = QueryWrapper.of(fieldDto.getEntityClz());
                                wrapper.eq("id", b);

                                List<? extends Item> list = dao.query(fieldDto.getEntityClz(), wrapper, null);
                                if (list != null && list.size() > 0) {

                                    saveBean(list.get(0), entityClz, masterId, callBackMethod, false);
                                }
                            }
                        }
                    }
                }
            });
            //多对多保存
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
                            existDbItem = dao.query(m2mDto.getClz(), wrapper, null);
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
        } else if (beanDto instanceof Item) {//递归进来的是实体模型
            EntityDto entityDto = GlobalData.entityDto((Class<? extends Item>) beanDto.getClass());
            if (fkItemClz != null) {//递归时候外键设置
                ReflectionUtils.setFieldValue(beanDto, entityDto.getFkMap().get(fkItemClz), fkItemId);
            }
            save((Item)beanDto,masterProcess);
        }
        return beanDto;
    }

    private List<String> getIds(IdBean... idBeans) {
        return getIdList(Arrays.asList(idBeans), "id");
    }

    /**
     * step1 将本次提交的子表数据与库里存在的数据进行分析，本次没提交但是又存在数据库里的将要被删除
     * 修改问题：不在saveBean里的子表，关联表数据不能删除
     * step2 调用删除方法->   remove(subItem, db2.getId());
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
        List<? extends Item> existDb = dao.query(subItemClz, wrapper, null);
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
     */
    private List getIdList(List<? extends IdBean> idBeans, String fkIdName) {
        return idBeans.stream().map(bean -> {
            return ReflectionUtils.getFieldValue(bean, fkIdName);
        }).filter(str -> str != null).collect(Collectors.toList());
    }

    /**
     * 取得删除规则
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

    protected DataProcess createProcess(IdBean bean) {
        return new HealthDataProcess(bean);
    }


    /**
     * 加入查询过滤条件，待改成抽象类
     */
    public < S extends QueryWrapper, E extends CustomQuery<T, S>> E addQueryFilter(E request){
        addQueryFilter(request.qw(entityClz));
//        request.setQueryWrapper(addQueryFilter(request.getQueryWrapper()));
        return request;
    }

    /**
     * 加入查询过滤的条件
     */
    public < S extends QueryWrapper> S addQueryFilter(S queryWrapper){
        //该方法由继承类来实现
        return queryWrapper;
    }

}
