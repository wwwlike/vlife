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

package cn.wwwlike.vlife.query;

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.OrderRequest;
import cn.wwwlike.vlife.bi.ConditionGroup;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.req.QueryUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * 支持lamdba链式数据过滤的查询模型
 * 另外支持简单分组（统计）和排序；
 */
@Data
public abstract class CustomQuery<T extends Item, Q extends AbstractWrapper> implements BaseRequest<T> {
    public CustomQuery() {
    }

    @JsonIgnore
    protected Class<T> entityClz;

    public void setEntityClz(Class entityClz) {
        this.entityClz = entityClz;
    }

    //@JsonIgnore 改为post提交后不需要该注解
    protected OrderRequest order = new OrderRequest();

    @JsonIgnore
    private Q queryWrapper;

    public abstract Q instance();

    public Q qw(Class<T> clz) {
        this.entityClz = clz;
        if (this.queryWrapper == null) {
            //1. 模型属性转queryWrapper查询对象
            queryWrapper = getJoinQueryWrapper(GlobalData.reqDto(this.getClass()));
            //2. 页面研发固定传condition支持嵌套的封装的复杂查询对象(ColumnFilter采用此,input列表搜索采用此)
            if(getConditions()!=null){
                QueryUtils.condition(queryWrapper,getConditions());
            }
            //3. 查询设计器传入的
            if(getConditionGroups()!=null){
                QueryUtils.condition(queryWrapper,getConditionGroups());
            }
        }
        return this.queryWrapper;
    }

    public Q qw() {
        if(this.queryWrapper!=null){
            return this.queryWrapper;
        }
        return qw(
                entityClz!=null&&Item.class.isAssignableFrom(entityClz)?
                        entityClz:getEntity());
    }

    /**
     * 将模型里简单属性方式传值的查询方式转换成为QueryWrapper的查询方式
     */
    protected Q getJoinQueryWrapper(ReqDto reqDto) {
        Q wrapper = null;
        if (reqDto != null && reqDto.getFields() != null) {
            List<FieldDto> fields = reqDto.getFields();
            for (FieldDto fieldDto : fields) {
                if (ReflectionUtils.getFieldValue(this, fieldDto.getFieldName()) != null
                &&(fieldDto.getVField()==null|| fieldDto.getVField().skip()==false)
                ) {
                    Object val = ReflectionUtils.getFieldValue(this, fieldDto.getFieldName());
                    wrapper = createWrapperFromQueryPath(wrapper, fieldDto, val);
                }
            }
        }
        if (wrapper == null) {
            wrapper = instance();
        }
        return wrapper;
    }

    /**
     * 根据字段信息(注解)和值进行转换成QueryWrapper的查询方式
     * 有注解且多字段联合or形式
     */
    private Q createWrapperFromQueryPath(Q qw, FieldDto fieldDto, Object val) {
        if (fieldDto.getVField() != null &&
                fieldDto.getVField().orReqFields().length > 0) {
            List<String> list = Arrays.stream(fieldDto.getVField().orReqFields()).collect(Collectors.toList());
            list.add(fieldDto.getEntityFieldName());//所有需要进行or查询的字段
            if (qw == null) {
                qw = instance();
            }
            qw.or(ww -> {
                createWrapperFromQueryPath((Q) ww, fieldDto.getQueryPath(), val,
                        fieldDto.getOpt(),
                        fieldDto.getTran(),
                        list.toArray(new String[list.size()]));
            });
            return qw;
        } else {
            return createWrapperFromQueryPath(qw, fieldDto.getQueryPath(), val, fieldDto.getOpt(), fieldDto.getTran(), fieldDto.getEntityFieldName());
        }
    }

    /**
     * 通过查询路径创建包裹条件,把查询条件传到最后一个对象上进行过滤???
     * @param qw                     已经存在的wrapper对象，未空的情况->1.无程序手工传入， 2是第一个req的字段需要转换
     * @param queryPath              字段的查询路径
     * @param lastQueryPathFieldName 主查询里的字段名称 是数组因为 有 fied1=1 feid2=1 feid3 =1 这种查询需求
     * @param val                    查询字段值
     */
    private Q createWrapperFromQueryPath(Q qw, List queryPath, Object val, Opt opt, DataExpressTran tran, String... lastQueryPathFieldName) {
        List<Class<? extends Item>> leftClz = new ArrayList();
        for (Object o : queryPath) {
            if (qw == null) {
                qw = instance();
            }
            if (o instanceof List) {
                Consumer<Q> subQuery = abc -> {
                    createWrapperFromQueryPath(abc, (List) o, val, opt, tran, lastQueryPathFieldName);
                };
                qw.andSub((Class<T>) ((List) o).get(0), subQuery, leftClz.toArray(new Class[leftClz.size()]));
            } else {
                leftClz.add((Class<T>) o);
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
                } else if (opt == Opt.isNotNull || opt == Opt.isNull) {
                    qw.isNotNull((Boolean) val, reqName, leftArray);
                } else if (opt == Opt.startsWith) {
                    qw.startsWith(true, reqName, val, tran, leftArray);
                }else if (opt == Opt.endsWith) {
                    qw.endsWith(true, reqName, val, tran, leftArray);
                }else if (opt == Opt.gt) {
                    qw.gt(true, reqName, val, tran, leftArray);
                }else if (opt == Opt.goe) {
                    qw.goe(true, reqName, val, tran, leftArray);
                }else if (opt == Opt.lt) {
                    qw.lt(true, reqName, val, tran, leftArray);
                }else if (opt == Opt.loe) {
                    qw.loe(true, reqName, val, tran, leftArray);
                }
            }
        }
        return qw;
    }

    /**
     * 正常简单的正向排序
     */
    public CustomQuery addOrder(String... field) {
        for (String f : field) {
            if (getOrder() == null) {
                order = new OrderRequest(f, Sort.Direction.ASC);
            } else {
                getOrder().addOrder(f, Sort.Direction.ASC);
            }
        }
        return this;
    }

    /**
     * 正常简单的反向排序
     *
     * @param field
     */
    public CustomQuery addDescOrder(String... field) {
        for (String f : field) {
            if (getOrder() == null) {
                order = new OrderRequest(f, Sort.Direction.DESC);
            } else {
                getOrder().addOrder(f, Sort.Direction.DESC);
            }
        }
        return this;
    }

    /**
     * queryBuild传入的查询条件(老的)
     * 支持嵌套的复杂型(当前查询设计器已经停用)，目前用来接收字段上的TagFilter
     */
    @VField(skip = true)
    private Conditions conditions;
    /**
     * 新的queryBuild的查询条件(简单方式) 不支持嵌套
     * list条件组与与之间是or查询 (a and b and c) or (aa and cc and dd)
     */
    @VField(skip = true)
    private List<ConditionGroup> conditionGroups;

    //流程页签
    @VField(skip = true,dictCode = "FLOW_TAB")
    private  String flowTab;
//    //流程下一级过滤条件
//    @VField(skip = true)
//    private String flowNextTab;
}
