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
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.bi.Groups;
import cn.wwwlike.vlife.bi.ReportWrapper;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.Join;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.Getter;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.uncapitalize;

/**
 * 条件过来的查询模型
 *
 * @param <T>
 */
@Getter
public class VoModel<T extends Item> extends QueryHelper implements QModel<T> {
    /**
     * dsl的jpa查询factory
     */
    private JPAQueryFactory factory;
    /**
     * 查询结果vo的clz类型
     */
    private Class<? extends IdBean> vo;
    /**
     * 查询主表dsl的path表达式
     */
    private EntityPathBase main;
    /**
     * 最后一个join关联的表对象（目前没有用到） ???
     */
    private EntityPathBase lastEntityPath;
    /**
     * 初始化后产生的vo对应的左查询命名和dsl表达式map对象
     */
    private Map<String, EntityPathBase> voJoin = new HashMap<>();
    /**
     * vo+request 产生的左关联查询map表达式对象
     */
    private Map<String, EntityPathBase> alljoin = new HashMap<>();

    /**
     * vo的查询主语句
     */
    private JPAQuery voFromQuery;

    /**
     * 传入req产生包涵查询条件的query表达式
     */
    private JPAQuery filterQuery;
    private String prefix = "";


    public VoModel(JPAQueryFactory factory, Class<? extends IdBean> vo, String prefix) {
        this.prefix = prefix;
        this.factory = factory;
        this.vo = vo;
        this.voFromQuery = from(vo);
        //vo模型组装查询字段
        if (VoBean.class.isAssignableFrom(vo)) {
            Expression[] selects = selectExpression();
            if (selects.length > 1) {
                this.voFromQuery.select(selects);
            } else {
                this.voFromQuery.select(selects[0]);
            }
        }
        voJoin.putAll(alljoin);
    }

    public VoModel(JPAQueryFactory factory, Class<? extends IdBean> vo) {
        this(factory, vo, "");
    }

    public VoModel(JPAQueryFactory factory) {
        this.factory = factory;
    }

    /**
     * 本次主查询语句
     *
     * @return
     */
    @Override
    public JPAQuery getVoFromQuery() {
        return this.voFromQuery;
    }

    public JPAQuery from(Class<? extends IdBean> vo) {
        if (Item.class.isAssignableFrom(vo)) {
            this.main = getItemEntityPath(vo, getPrefix() + uncapitalize(vo.getSimpleName()));
            addJoin(main);
            return factory.from(this.main);
        } else {
            VoDto voDto = GlobalData.voDto((Class<? extends VoBean>) vo);
            return joinByVo(voDto.getLeftPathClz());
        }
    }


    public JPAQuery joinByVo(List<List<Class<? extends Item>>> lefts) {
        return joinByVo(null, null, getPrefix(), lefts.toArray(new List[lefts.size()]));
    }


    /**
     * 子查询的过滤条件拼接
     *
     * @param prefix  子查询左边main的名称
     * @param mainId  主表ID表达式
     * @param wrapper 子查询的查询条件
     * @return
     */
    private BooleanExpression subQueryFilter(String prefix, StringPath mainId, AbstractWrapper wrapper) {
        //子查询也需要查询状态有效的数据
        wrapper.eq("status", CT.STATUS.NORMAL);
        List<Class<? extends Item>> ls = (List) wrapper.allLeftPath().get(0);
        JPAQuery subMainQuery = joinByVo(null, null, prefix + "_", ls);
        BooleanBuilder subBuilder = whereByWrapper(wrapper);
        Class<? extends Item> mainClz = (Class<? extends Item>) wrapper.getMainClzPath().get(wrapper.getMainClzPath().size() - 1);
        Class subMain = wrapper.getEntityClz();
        String entityAlias = prefix + "__" + uncapitalize(subMain.getSimpleName());
        EntityPathBase subMainPath = getAlljoin().get(entityAlias);
        EntityDto subMainDto = GlobalData.entityDto(subMain);
        StringPath subId = (StringPath) ReflectionUtils.getFieldValue(subMainPath, subMainDto.getFkMap().get(mainClz));
        if (false) {
            if (subBuilder.hasValue()) {
                subMainQuery.where(mainId.eq(subId).and(subBuilder));
            } else {
                subMainQuery.where(mainId.eq(subId));
            }
            return subMainQuery.exists();
        } else {
            subMainQuery.select(subId);
            if (subBuilder.hasValue()) {
                subMainQuery.where(subBuilder);
            }
//            subMainQuery.where(subBuilder.and())
////            subMainQuery.eq("status",CT.STATUS.NORMAL);
            return mainId.in(subMainQuery);
        }
    }


    /**
     * 表左连接组装
     *
     * @param fromQuery 查询语句（为空说明不是递归）
     * @param entityDto 实体类info信息
     * @param lefts     字段左查询CLz数组（可能不同字段来源不同的左关联表）
     * @param prefix    别名前缀，传入时以下划线结尾，说明本次是子查询
     * @return
     */
    public JPAQuery joinByVo(JPAQuery fromQuery, EntityDto entityDto, String prefix, List<Class<? extends Item>>... lefts) {
        EntityPathBase rightPath = null;
        String entityAlias = "";
        Class mainClz = null;
        for (List<Class<? extends Item>> left : lefts) {
            mainClz = left.get(0);
            entityAlias =
                    ((StringUtils.isNotBlank(prefix) &&
                            !prefix.endsWith("$")) ? (prefix + "_") : prefix) +
                            uncapitalize(mainClz.getSimpleName());
            rightPath = getItemEntityPath(mainClz, entityAlias);
            if (fromQuery == null) {
                addJoin(rightPath);
                fromQuery = factory.from(rightPath);
            } else if (alljoin.get(entityAlias) == null) {
                addJoin(rightPath);
                String leftIdName = entityDto.getFkMap().get(mainClz);
                StringPath leftId = (StringPath) ReflectionUtils.getFieldValue(alljoin.get(prefix), leftIdName);
                StringPath rightId = (StringPath) ReflectionUtils.getFieldValue(rightPath, "id");
                fromQuery.leftJoin(rightPath).on(leftId.eq(rightId));
            }
            //给VO查询结果需要左关联的表含本表都加上status过滤,
            //屏蔽原因：左查询不应该关联status,如果status无效则也不会体现在 外键字段上
//            StringPath statusPath =(StringPath) ReflectionUtils.getFieldValue(rightPath, "status");
//            BooleanExpression expression=statusPath.eq(CT.STATUS.NORMAL);
//            fromQuery.where(expression);
            if (left.size() > 1) {
                fromQuery = joinByVo(fromQuery, GlobalData.entityDto(mainClz), entityAlias, left.subList(1, left.size()));
            }
        }
        return fromQuery;
    }

    public void addJoin(EntityPathBase path) {
        if (this.main == null) {
            this.main = path;
        }
        this.lastEntityPath = path;
        alljoin.put(path.toString(), path);
    }

    /**
     * vo查询字段与应查询未注入的id字段进行组合形成查询表达式
     *
     * @return 查询内容的表达式数组
     */
    public Expression[] selectExpression() {
        VoDto voDto = GlobalData.voDto((Class<? extends VoBean>) this.getVo());
        List<SimpleExpression> paths = new ArrayList<>();
        List<FieldDto> list = voDto.getFields().stream().filter(fieldDto -> {
            String type = fieldDto.getFieldType();
            return (VCT.ITEM_TYPE.BASIC.equals(type));
        }).collect(Collectors.toList());
        for (FieldDto fieldDto : list) {
            EntityPathBase fieldInPath = this.getAlljoin().get(fieldDto.leftJoinName());
            try {
                SimpleExpression fieldExpression = (SimpleExpression) ReflectionUtils.getFieldValue(fieldInPath, fieldDto.getEntityFieldName());
                if (fieldDto.getTran() != null) {
                    fieldExpression = fieldDto.getTran().tran(fieldExpression);
                }
                fieldExpression = fieldExpression.as(fieldDto.getFieldName());
                paths.add(fieldExpression);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        Expression voSxpression = Projections.bean(voDto.getClz(), paths.toArray(new ComparableExpressionBase[paths.size()]));
        Expression[] loseExpression = new Expression[voDto.getLoseIds().size()];
        for (String loseFieldName : voDto.getLoseIds().keySet()) {
            ComparableExpression fieldExpression = (ComparableExpression) ReflectionUtils.getFieldValue(getMain(), loseFieldName);
            loseExpression[voDto.getLoseIds().get(loseFieldName)] = fieldExpression;
        }
        Expression[] all = ArrayUtils.add(loseExpression, 0, voSxpression);
        return all;

    }

    public <W extends AbstractWrapper<T, String, QueryWrapper<T>>> BooleanBuilder whereByWrapper(W wrapper) {
//         wrapper.eq("status", CT.STATUS.NORMAL);
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        for (AbstractWrapper.Element element : wrapper.getElements()) {
            EntityPathBase path = alljoin.get(getPrefix() + element.queryPathNames());
            BooleanExpression filterExp = filter(path, (String) element.getColumn(), element);
            if (filterExp != null) {
                if (wrapper.getJoin() == Join.and) {
                    booleanBuilder.and(filterExp);
                } else {
                    booleanBuilder.or(filterExp);
                }
            }
        }

        for (AbstractWrapper subQueryWrapper : wrapper.getSubQuery()) {
            String mainLeftJoinName = subQueryWrapper.lethJoinName();
            EntityPathBase leftDslPath = alljoin.get(mainLeftJoinName);
            BooleanExpression booleanExpression = subQueryFilter(
                    mainLeftJoinName,
                    (StringPath) ReflectionUtils.getFieldValue(leftDslPath, "id"),
                    subQueryWrapper);
            if (wrapper.getJoin() == Join.and) {
                booleanBuilder.and(booleanExpression);
            } else {
                booleanBuilder.or(booleanExpression);
            }
        }

        for (AbstractWrapper sub : wrapper.getChilds()) {
            BooleanBuilder builder = whereByWrapper(sub);
            if (wrapper.getJoin() == Join.and) {
                booleanBuilder.and(builder);
            } else {
                booleanBuilder.or(builder);
            }
        }


        return booleanBuilder;
    }

    /**
     * 返回左查询的前缀对象名称
     *
     * @return
     */
    public String getPrefix() {
        if (StringUtils.isNotBlank(prefix)) {
            return prefix + "$";
        }
        return "";
    }

    /**
     * 组装查询条件产生的表关联
     *
     * @param fieldDtos
     * @param <R>
     * @return
     */
    public <R extends BaseRequest> JPAQuery addQueryFilterJoin(JPAQuery jpaQuery, List<FieldDto> fieldDtos) {
        for (FieldDto reqFieldDto : fieldDtos) {
            String leftJoinName = getPrefix() + reqFieldDto.leftJoinName();
            if (leftJoinName != null && alljoin.get(leftJoinName) == null) {
                Object o = reqFieldDto.getQueryPath().get(0);
                if (o instanceof Class) {
                    Class item = (Class) reqFieldDto.leftJoinPath().get(0);
                    joinByVo(jpaQuery, GlobalData.entityDto(item), getPrefix(), reqFieldDto.leftJoinPath());
                }
            }
        }
        return jpaQuery;
    }


    /**
     * 组装查询有值且关联到的表
     *
     * @param <R>
     * @return
     */
    public <R extends AbstractWrapper> JPAQuery addQueryFilterJoin(JPAQuery jpaQuery, R request) {
        List<List<Class<? extends Item>>> allReqLeftPath = request.allLeftPath();
        for (List<Class<? extends Item>> path : allReqLeftPath) {
            Class item = path.get(0);
            joinByVo(jpaQuery, GlobalData.entityDto(item), getPrefix(), path);
        }
        return jpaQuery;
    }

    /**
     * 一般查询流程组装以及表达式返回
     * synchronized ->处理连续2次查询查询条件覆盖的问题
     */
    public synchronized <R extends AbstractWrapper> JPAQuery fromWhere(R wrapper) {
        //主表需要有status
        wrapper.eq("status", CT.STATUS.NORMAL);
        // step1 query init
        filterQuery = (JPAQuery) getVoFromQuery().clone();// filterQuery 克隆赋值 初始化
        alljoin.clear();
        alljoin.putAll(voJoin); //map恢复到vo初始化完成后的状态（select里会用到的join）
        // step2 add  leftjoin
        filterQuery = addQueryFilterJoin(filterQuery, wrapper); //添加查询条件里需要做查询的leftPath到joins里
        // step3 filter(sub filter)
        filterQuery.where(whereByWrapper(wrapper));
        return filterQuery;
    }

    /**
     * 聚合查询query表达式返回
     *
     * @param wrapper
     * @param <R>
     * @return
     */
    public synchronized <R extends ReportWrapper> JPAQuery fromGroupWhere(R wrapper) {
        EntityPathBase entityPathBase = getMain();
        //1. 基本select from where 组装
        filterQuery = fromWhere(wrapper);
        //2. group by加入
        List<Groups> groups = wrapper.getGroups();
        SimpleExpression[] groupExpression = new SimpleExpression[groups.size()];
        int i = 0;
        for (Groups group : groups) {
            SimpleExpression groupException = (SimpleExpression) ReflectionUtils.getFieldValue(entityPathBase, group.getColumn());
            if (group.getFunc() != null) {
                groupException = QueryHelper.tran(groupException, group.getFunc());
                filterQuery.groupBy(groupException);//直接加入到fiulterQuery
            }
            groupExpression[i] = groupException; // 这里也加入了，会加入两次
            i++;
        }
        filterQuery.groupBy(groupExpression);//加入

        //2. select 分组 聚合的
        SimpleExpression fieldExpression = (SimpleExpression) ReflectionUtils.getFieldValue(entityPathBase, wrapper.getItemField());
        SimpleExpression[] selectExpression = selectExpression = ArrayUtils.addAll(groupExpression,
                QueryHelper.tran(fieldExpression, wrapper.getFunc()).as(wrapper.getCode()));//分组的字段和查询的字段（code）都加入进来
        filterQuery.select(selectExpression);

        //group by加入
        //having 加入
        return filterQuery;
    }

    @Override
    public ReqDto getReqDto(Class<? extends BaseRequest<T>> reqClz) {
        return GlobalData.reqDto(reqClz);
    }

    /**
     * 特定组装的EQ查询
     *
     * @param path
     * @param fieldName
     * @param val
     * @return
     */
    public BooleanExpression eqfilter(EntityPathBase path, String fieldName, Object val) {
        ComparableExpression fieldlDsl = (ComparableExpression) ReflectionUtils.getFieldValue(path, fieldName);
        return fieldlDsl.eq(val);
    }

    /**
     * @param path      查询关联的表DSL的表达式信息
     * @param fieldName 查询的字段(如果为空则查询id)why-> list<string> 类型注入查询可能存在entityFieldName为空的情况
     * @param element   查询指端的值（值信息里涵盖了匹配方式 like ,between ）
     * @return where条件的表达式
     */
    public static BooleanExpression filter(EntityPathBase path, String fieldName, AbstractWrapper.Element element) {

        SimpleExpression fieldlDsl = (SimpleExpression) ReflectionUtils.getFieldValue(path, fieldName == null ? "id" : fieldName);
        if (element.getTran() != null) {
            fieldlDsl = element.getTran().tran(fieldlDsl);
        }

        Opt opt = element.getOpt();
        Object[] vals = element.getVals();
        Method method = null;
        BooleanExpression re = null;
        if (fieldlDsl != null) {
            if (element.getVal() != null || element.getVals() != null) {
                if (opt == Opt.between) {
                    if(vals.length>1){
                        if(vals[0]!=null&&vals[1]!=null){
                            method = ReflectionUtils.findMethod(fieldlDsl.getClass(), opt.name(), vals[0].getClass(), vals[1].getClass());
                            re = (BooleanExpression) org.springframework.util.ReflectionUtils.invokeMethod(method, fieldlDsl, vals[0], vals[1]);
                        }else if(vals[0]==null&&vals[1]!=null){
                            method = ReflectionUtils.findMethod(fieldlDsl.getClass(), Opt.loe.name(), vals[1].getClass());
                            re = (BooleanExpression) org.springframework.util.ReflectionUtils.invokeMethod(method, fieldlDsl, vals[1]);
                        }else if(vals[1]==null&&vals[0]!=null){
                            method = ReflectionUtils.findMethod(fieldlDsl.getClass(), Opt.goe.name(), vals[0].getClass());
                            re = (BooleanExpression) org.springframework.util.ReflectionUtils.invokeMethod(method, fieldlDsl, vals[0]);
                        }
                    }
                } else if (opt == Opt.in) {
                    re = ((SimpleExpression) fieldlDsl).in(vals);
                } else {
                    method = ReflectionUtils.findMethod(fieldlDsl.getClass(), opt.name(), element.getVal().getClass());
                    re = (BooleanExpression) org.springframework.util.ReflectionUtils.invokeMethod(method, fieldlDsl, element.getVal());
                }
            } else if (opt == Opt.isNotNull || opt == Opt.isNull) {
                method = ReflectionUtils.findMethod(fieldlDsl.getClass(), opt.name());
                re = (BooleanExpression) org.springframework.util.ReflectionUtils.invokeMethod(method, fieldlDsl);
            }
        }
        return re;
    }

}
