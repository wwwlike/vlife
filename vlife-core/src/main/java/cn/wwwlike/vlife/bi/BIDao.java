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

package cn.wwwlike.vlife.bi;

import cn.wwwlike.vlife.base.BiEntity;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.core.dsl.DslDao;
import cn.wwwlike.vlife.core.dsl.QModel;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQuery;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Constructor;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 难点是，
 * １.　数量统计
 * ２.　统计下下钻－＞　年—＞地区　　机构－＞医生　　地区－＞下级地区
 *
 * @param <T>
 */
public class BIDao<T extends Item> extends DslDao<T> {

    /**
     * 查询单个指标的统计
     * 1. 从数据库里提取已经定义的指标信息
     * 2. 从页面接收用户的分组，以及指定条件的数据过滤方式
     * GroupWrapper里封装了这些信息
     */
    public void report(GroupWrapper<T> wrapper) {
        QModel<T> model = select(entityClz);//查询主体
        JPAQuery query = model.fromWhere(wrapper); //过滤条件组装
        JPAQuery groupQuery = groupBy(model, query, wrapper); // 植入group By
        //select 组装
        SimpleExpression<T> expression[] = mainSelectExpression(model, "", null, wrapper);
        groupQuery.select(expression);
        //查询结果出来
        List<Tuple> list = groupQuery.fetch();
    }

    /**
     * 查询
     *
     * @param clz
     * @param wrapper
     * @param <E>
     * @return
     */
    public <E extends BiEntity<T>, R extends GroupWrapper<T>> List<E> report(Class<E> clz, final R wrapper) {
        List<E> reportList = new ArrayList<>();
        Arrays.stream(clz.getFields()).forEach(field -> {
            ItemInfo itemInfo = field.getAnnotation(ItemInfo.class);//读单个指标的注解
            QModel<T> model = select(entityClz);//查询主体
            GroupWrapper<T> mainReq = mainReq(itemInfo, wrapper, model);
            JPAQuery query = model.fromWhere(mainReq);
            JPAQuery groupQuery = groupBy(model, query, mainReq);
            SimpleExpression<T> expression[] = mainSelectExpression(model, field.getName(), itemInfo, mainReq);
            groupQuery.select(expression);
            GroupWrapper<T> subReq = subReq(itemInfo, wrapper, model);
            if (subReq != null && (subReq.getElements().size() > 0 || subReq.getGroups().size() > 0)) {
                groupQuery.where(subExistsQuery(model, subReq, mainReq));
            }
            List<Tuple> list = groupQuery.fetch();
            List<String> names = wrapper.getGroups().stream().map(GroupWrapper.Group::getColumn).collect(Collectors.toList());
            names.add(field.getName());
            tran(clz, reportList, list, names, expression);
        });
        return reportList;
    }

    ;

    /**
     * 子查询
     *
     * @param mainModel  主查询model
     * @param subWrapper 子查询 req对象
     * @param mainReq    主查询 req对象
     * @return
     */
    public BooleanExpression subExistsQuery(QModel<T> mainModel, GroupWrapper<T> subWrapper, GroupWrapper<T> mainReq) {
        String prefix = "field";
        QModel<T> model = selectNew(entityClz, prefix);
        JPAQuery query = model.fromWhere(subWrapper);
        JPAQuery groupQuery = groupBy(model, query, subWrapper, prefix + "$");
        SimpleExpression<T> expression[] = groupByExpression(model, subWrapper.getGroups(), true, prefix + "$");
        groupQuery.select(expression);
        for (GroupWrapper.Group group : subWrapper.getGroups()) {
            String name = VlifeUtils.fullPath("", group.getPath(), true);
            EntityPathBase mainPathBase = mainModel.getAlljoin().get(name);
            EntityPathBase fieldPathBase = model.getAlljoin().get(prefix + "$" + name);
            ComparableExpression mainExpress = (ComparableExpression) ReflectionUtils.getFieldValue(mainPathBase, group.getColumn());
            ComparableExpression fieldExpress = (ComparableExpression) ReflectionUtils.getFieldValue(fieldPathBase, group.getColumn());
            if (group.getTran() != null) {
                groupQuery.where(group.getTran().tran(mainExpress)
                        .eq(group.getTran().tran(fieldExpress))
                );
            } else {
                groupQuery.where(mainExpress.eq(fieldExpress));
            }
        }
        return groupQuery.exists();
    }

    /**
     * 子查询的条件 In条件（）
     *
     * @param mainExpression 主查询传入进行
     * @param subReq
     * @return
     * @since in的效率不行，屏蔽掉
     */
    private BooleanExpression subQuery(SimpleExpression<T> mainExpression[], GroupWrapper<T> subReq) {
        String prefix = "field";
        QModel<T> model = selectNew(entityClz, prefix);
        JPAQuery query = model.fromWhere(subReq);
        JPAQuery groupQuery = groupBy(model, query, subReq, prefix + "$");
        SimpleExpression<T> expression[] = groupByExpression(model, subReq.getGroups(), true, prefix + "$");
        groupQuery.select(expression);
        return Expressions.list(mainExpression).in(groupQuery);
    }

    /**
     * 明细钻取详情
     * 字段上有注解，注解field有值的，则查询该field外键所在的表
     * 1. 查询ID　通过ID去实体表找数据
     * 人次查询表
     * 人查询分组的字段对应的实体
     * 人次
     * 人
     *
     * @return
     */
    public <E extends BiEntity<T>, F extends Item> List<F> report(ItemInfo info, GroupWrapper<T> request) {
        return null;
    }

    /**
     * Tuple数据转成 E
     *
     * @param list
     * @param <E>
     * @return
     */
    private <E extends BiEntity<T>> List<E> tran(Class<E> clz, List<E> list, List<Tuple> tuples, List<String> names, Expression expression[]) {
        E biEntity = null;
        for (Tuple tuple : tuples) {
            Object val = tuple.get(expression[expression.length - 1]);
            Map<String, Object> title = new HashMap<>();
            for (int i = 0; i < names.size() - 1; i++) {
                Object obj = tuple.get(expression[i]);
                title.put(names.get(i), obj);
            }

            Optional<E> optional = list.stream().filter(line -> {
                for (int i = 0; i < names.size() - 1; i++) {
                    if (!tuple.get(expression[i]).toString().equals(line.getTitle().get(names.get(i)).toString())) {
                        continue;
                    }
                    if (i == names.size() - 2) {
                        return true;
                    }
                }
                return false;
            }).findAny();

            if (optional.isPresent()) {
                biEntity = optional.get();
            } else {
                try {
                    biEntity = clz.newInstance();
                    biEntity.setTitle(title);
                    list.add(biEntity);
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
            ReflectionUtils.setFieldValue(biEntity, names.get(names.size() - 1), val);
        }
        return list;
    }

    /**
     * 子查询条件进行组合
     *
     * @param itemInfo  注解信息
     * @param entityReq 外部入参的条件
     * @return
     */
    private GroupWrapper<T> subReq(ItemInfo itemInfo, GroupWrapper<T> entityReq, QModel<T> mainModel) {
        if (itemInfo == null)
            return null;
        if (itemInfo != null && itemInfo.condition() != AbstractBiCondition.class) {
            try {
                Constructor ct = itemInfo.condition().getDeclaredConstructor();
                ct.setAccessible(true);
                AbstractBiCondition biCondition = (AbstractBiCondition) ct.newInstance();

                GroupWrapper<T> fieldReq = biCondition.condition(entityReq, mainModel);
                GroupWrapper<T> subReq = new GroupWrapper<T>(entityClz);
                if (biCondition.isUseMainHaving()) {
                    subReq.getFilters().addAll(entityReq.getFilters());
                }
                if (biCondition.isUseMainReq()) {
                    subReq.getElements().addAll(entityReq.getElements());
                }
                if (biCondition.isUseMainGroup()) {
                    subReq.getGroups().addAll(entityReq.getGroups());
                }

                subReq.getGroups().addAll(fieldReq.getGroups());
                if (biCondition.isUseSelfHaving()) {
                    subReq.getFilters().addAll(fieldReq.getFilters());
                }
                if (biCondition.isUseSelfReq()) {
                    subReq.getElements().addAll(fieldReq.getElements());
                }
                return subReq;
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 主查询条件进行组合
     *
     * @param itemInfo  注解信息
     * @param entityReq 外部入参条件
     * @return
     */
    private GroupWrapper<T> mainReq(ItemInfo itemInfo, GroupWrapper<T> entityReq, QModel<T> mainModel) {
        if (itemInfo == null || itemInfo.condition() == AbstractBiCondition.class) {
            GroupWrapper<T> mainReq = new GroupWrapper<T>(entityClz);
            mainReq.getFilters().addAll(entityReq.getFilters());
            mainReq.getGroups().addAll(entityReq.getGroups());
            mainReq.getElements().addAll(entityReq.getElements());
            mainReq.getSubQuery().addAll(entityReq.getSubQuery());
            return mainReq;
        } else {
            try {
                Constructor ct = itemInfo.condition().getDeclaredConstructor();
                ct.setAccessible(true);
                AbstractBiCondition biCondition = (AbstractBiCondition) ct.newInstance();
                GroupWrapper<T> fieldReq = biCondition.condition(entityReq, mainModel);
                GroupWrapper<T> mainReq = new GroupWrapper<T>(entityClz);

                mainReq.getGroups().addAll(entityReq.getGroups());
                if (biCondition.isMainHaving()) {
                    mainReq.getFilters().addAll(entityReq.getFilters());
                }
                if (biCondition.isMainReq()) {
                    mainReq.getElements().addAll(entityReq.getElements());
                }

                if (biCondition.isUseSubHaving()) {
                    mainReq.getFilters().addAll(fieldReq.getFilters());
                }
                if (biCondition.isUseSubReq()) {
                    mainReq.getElements().addAll(fieldReq.getElements());
                }
                return mainReq;
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return entityReq;
    }

    /**
     * 分组条件的表达式(包含分组的转换关系)
     *
     * @param model1 查询模型
     * @param groups 分组的
     * @param tran   是否执行转换函数
     * @return
     */
    private SimpleExpression[] groupByExpression(QModel<T> model1, List<GroupWrapper<T>.Group> groups, boolean tran, String prefix) {
        List<SimpleExpression> expressions = new ArrayList<>();
        prefix = (prefix == null) ? "" : prefix;
        if (groups.size() > 0) {
            for (int i = 0; i < groups.size(); i++) {
                String pathName = VlifeUtils.fullPath("", groups.get(i).getPath(), true);
                pathName = prefix + pathName;
                EntityPathBase fieldPath = model1.getAlljoin().get(pathName);
                SimpleExpression expression = (SimpleExpression) ReflectionUtils.getFieldValue(fieldPath, groups.get(i).getColumn());
                if (groups.get(i).getTran() != null && tran) {
                    expressions.add(groups.get(i).getTran().tran(expression));
                } else {
                    expressions.add(expression);
                }
            }
        }
        return expressions.toArray(new SimpleExpression[expressions.size()]);
    }

    /**
     * 主表查询字段的表达式
     *
     * @param itemInfo 字段上的注解（可没有）
     * @param asName   定义指标上的名称 别名
     * @return
     */
    public SimpleExpression mainQueryFieldExpression(EntityPathBase mainPath, ItemInfo itemInfo, String asName) {
        String entityName = itemInfo == null ? "id" : itemInfo.field();
        FunctionEnum func = FunctionEnum.count;
        Expression fieldExpression = (Expression) ReflectionUtils.getFieldValue(mainPath, entityName);
        if (itemInfo != null) {
            func = itemInfo.func();
            if (fieldExpression instanceof NumberExpression
                    && itemInfo.func() != FunctionEnum.count && itemInfo.func() != FunctionEnum.distinctCount) {
                NumberExpression numberExpression = (NumberExpression) fieldExpression;
                if (itemInfo.func() == FunctionEnum.sum) {
                    return numberExpression.sum().as(asName);
                }
                return numberExpression.sum().as(asName);
            } else if (itemInfo.func() == FunctionEnum.count) {
                return ((ComparableExpression) fieldExpression).count().as(asName);
            } else if (itemInfo.func() == FunctionEnum.distinctCount) {
                return ((ComparableExpression) fieldExpression).countDistinct().as(asName);
            }
            return null;
        } else {
            return ((ComparableExpression) fieldExpression).count().as(asName);
        }

    }

    /**
     * 本次统计需要返回的字段
     * 1. group的字段
     * 2. 聚合查询的单一字段（如果是子查询则不必查询该值 目前是这样）
     *
     * @param model    查询主体对象model信息
     * @param asName
     * @param itemInfo 字段的附加信息
     * @param req      查询条件
     * @return
     */
    private SimpleExpression[] mainSelectExpression(QModel<T> model, String asName, ItemInfo itemInfo, GroupWrapper req) {

        SimpleExpression[] expressions = new SimpleExpression[req.getGroups().size() + 1];

        SimpleExpression[] groupExpression = groupByExpression(model, req.getGroups(), true, "");
        for (int i = 0; i < groupExpression.length; i++) {
            expressions[i] = groupExpression[i];
        }

        EntityPathBase fieldInPath = model.getAlljoin().get(StringUtils.uncapitalize(entityClz.getSimpleName()));
        expressions[expressions.length - 1] = mainQueryFieldExpression(fieldInPath, itemInfo, asName);
        return expressions;
    }

    /**
     * 分组条件set到query里
     *
     * @param model 查询模型
     * @param query 查询语句query对象
     * @param req   分组条件
     * @return
     */
    private JPAQuery groupBy(QModel<T> model, JPAQuery query, GroupWrapper<T> req) {
        return groupBy(model, query, req, "");
    }

    private JPAQuery groupBy(QModel<T> model, JPAQuery query, GroupWrapper<T> req, String prefix) {
        List<GroupWrapper<T>.Group> groups = req.getGroups();
        JPAQuery groupQuery = (JPAQuery) query.clone();
        groups.forEach(group -> {

            String pathName = VlifeUtils.fullPath("", group.getPath(), true);

            EntityPathBase entityPathBase = model.getAlljoin().get(prefix + pathName);
            SimpleExpression groupExpress = (SimpleExpression) ReflectionUtils.getFieldValue(entityPathBase, group.getColumn());
            if (group.getTran() != null) {
                groupQuery.groupBy(group.getTran().tran(groupExpress));
            } else {
                groupQuery.groupBy(groupExpress);
            }
        });
        req.getFilters().forEach(groupFilter -> {
            EntityPathBase main = model.getMain();
            SimpleExpression havingExpress = (SimpleExpression) ReflectionUtils.getFieldValue(main, groupFilter.getColumn());
            ComparableExpressionBase execFunExpress = (ComparableExpressionBase) ReflectionUtils.invokeMethod(havingExpress, groupFilter.getFunc().name(), null, null);
            if (groupFilter.getOpt() == Opt.eq) {
                groupQuery.having(execFunExpress.eq(groupFilter.getVal()));
            } else if (groupFilter.getOpt() == Opt.gt) {
                groupQuery.having(((NumberExpression) execFunExpress).gt(groupFilter.getVal()));
            }

        });
        return groupQuery;
    }


}
