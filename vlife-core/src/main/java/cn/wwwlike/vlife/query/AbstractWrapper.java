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

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.Join;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.utils.VlifeUtils;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * 自嵌套条件包裹类
 * 支持嵌套/子查询/条件分组/and&or
 */
@Getter
public abstract class AbstractWrapper<T extends Item, R, Children extends
        AbstractWrapper<T, R, Children>>
        extends Wrapper<T>
        implements Nested<Children, Children>, Compare<Children, R> {

    /**
     * 设置本业务过滤使用的“哪个业务模型”的过滤维度
     * 如查询“项目”模块，它的查看维度部门下的项目，但是部门表的维度是查看本机构的部门，再项目里过滤部门的维度就需要调整成和项目一致
     * 这里设置的filterRuleClz就是只我们查询部门表时可能会用到业务部门的行级数据过滤规则。
     */
    public Class filterRuleClz;

    /**
     * 占位符
     */
    protected final Children typedThis = (Children) this;
    /**
     * 上一级包裹查询对象信息，暂时未使用
     */
    protected Children parent;
    /**
     * 查询的根路径
     * 可以理解成本次查询from的主类就是他
     */
    protected Class<T> entityClz;
    /**
     * 如果本child作为*子查询*，那么子查询关联对象的主查询的路径，索引最后一位就是关联的表对象clz
     * (本查询的路径，如果是子查询不包含外层路径)
     */
    protected List<Class<? extends Item>> mainClzPath;
    /**
     * 默认本()里的连接方式
     */
    protected Join join = Join.and;
    /**
     * 嵌套条件的包裹对象->（）嵌套的括号
     * 嵌套的和本对象是同一级的，所以根路径 entityClz相同
     */
    protected List<Children> childs = new ArrayList<>();
    /**
     * 查询条件的子元素列表信息
     */
    protected List<Element> elements = new ArrayList<>();
    /**
     * 包括的子查询列表
     */
    protected List<Children> subQuery = new ArrayList<>();

    @Override
    public Class<T> getEntityClz() {
        return entityClz;
    }

    public String lethJoinName() {
        if (this.mainClzPath == null || this.mainClzPath.size() == 0)
            return null;

        String all = "";
        for (Class cz : this.mainClzPath) {
            all += "_" + StringUtils.uncapitalize(cz.getSimpleName());
        }
        String subName = all.substring(1);
        if (this.getParent().getParent() != null) {
            subName = this.getParent().lethJoinName() + "__" + subName;
        }
        return subName;
    }

    /**
     * 包裹的查询对象里包含的各left查询路径列表
     * 1. 包含子元素element，嵌套包裹child里的路径
     * 2. 包含去到子查询根路径的列表 subQuery
     *
     * @return
     */
    public List<List<Class<? extends Item>>> allLeftPath() {
        return allLeftPath(typedThis);
    }

    private List<List<Class<? extends Item>>> allLeftPath(Children child) {
        List<List<Class<? extends Item>>> list = new ArrayList();

        for (Children sub : child.getChilds()) {
            List<List<Class<? extends Item>>> subs = allLeftPath(sub);
            if (subs != null && subs.size() > 0) {
                for (List<Class<? extends Item>> ss : subs) {
                    list = VlifeUtils.addItemClzArray(list, ss);
                }
            }
        }
        for (Children sub : child.getSubQuery()) {
            list = VlifeUtils.addItemClzArray(list, sub.getMainClzPath());
        }
        for (AbstractWrapper.Element element : child.getElements()) {
            if (element.path != null) {
                list = VlifeUtils.addItemClzArray(list, element.path);
            } else if (element.getQueryPath() != null) {
                List lefts = (List) element.getQueryPath().stream().filter(e -> e instanceof Class).collect(Collectors.toList());
                list = VlifeUtils.addItemClzArray(list, lefts);
            }
        }
        return list;
    }

    public abstract Children instance(Children parent);

    /**
     * 添加一个查询条件
     *
     * @param condition
     * @param column
     * @param opt
     * @param val
     * @param leftPathClz
     * @return
     */
    public void addCondition(boolean condition, R column, Opt opt, Object val, DataExpressTran tran, Class<? extends Item>... leftPathClz) {
        if (condition) {
            List leftClz = new ArrayList<>();

            if (leftPathClz == null || leftPathClz.length == 0 || leftPathClz[0] != entityClz) {
                leftClz.add(entityClz);
            }
            if (leftPathClz != null) {
                for (Class clz : leftPathClz) {
                    leftClz.add(clz);
                }
            }
            if ((opt == Opt.between || opt == Opt.in || opt == Opt.notIn) && val.getClass().isArray()) {
                elements.add(new Element(column, leftClz, opt, (Object[]) val, tran));
            } else {
                elements.add(new Element(column, leftClz, val, opt, tran));
            }
        }
    }

    @Override
    public Children eq(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.eq, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children ne(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.ne, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children gt(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.gt, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children goe(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.goe, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children lt(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.lt, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children loe(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.loe, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children between(boolean condition, R column, Object val1, Object val2, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.between, new Object[]{val1, val2}, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children notBetween(boolean condition, R column, Object val1, Object val2, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.notBetween, new Object[]{val1, val2}, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children in(boolean condition, R column, Object[] val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.in, val, tran, leftClz);
        return typedThis;
    }


    @Override
    public Children notIn(boolean condition, R column, Object[] val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.notIn, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children like(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.like, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children notLike(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.notLike, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children isNotNull(boolean condition, R column, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.isNotNull, null, null, leftClz);
        return typedThis;
    }

    @Override
    public Children isNull(boolean condition, R column, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.isNull, null, null, leftClz);
        return typedThis;
    }

    @Override
    public Children startsWith(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.startsWith, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children endsWith(boolean condition, R column, Object val, DataExpressTran tran, Class<? extends Item>... leftClz) {
        addCondition(condition, column, Opt.endsWith, val, tran, leftClz);
        return typedThis;
    }

    @Override
    public Children and(boolean condition, Consumer<Children> consumer) {
        if (condition) {
            Children children = this.instance(typedThis);
            children.entityClz = this.entityClz;
            consumer.accept(children);
            childs.add(children);
        }
        return typedThis;
    }

    @Override
    public Children or(boolean condition, Consumer<Children> consumer) {
        if (condition) {
            Children children = this.instance(typedThis);
            children.join = Join.or;
            children.entityClz = this.entityClz;
            consumer.accept(children);
            childs.add(children);
        }
        return typedThis;
    }

    /**
     * 子查询里的搜索条件
     *
     * @param condition   执行条件
     * @param subMainClz  创建子查询的 主表entityClz
     * @param consumer    子查询语句
     * @param leftPathClz 子查询主表id所在类的路径，数组最后一个就是mainId 所在的类
     * @return
     */
    @Override
    public Children andSub(boolean condition, Class<? extends Item> subMainClz, Consumer<Children> consumer, Class<? extends Item>... leftPathClz) {
        Children children = this.instance(typedThis);
        children.entityClz = (Class<T>) subMainClz;
        consumer.accept(children);
        List leftClz = new ArrayList();

        if (leftPathClz == null || leftPathClz.length == 0 || leftPathClz[0] != entityClz) {
            leftClz.add(entityClz);
        }

        if (leftPathClz != null) {
            for (Class clz : leftPathClz) {
                leftClz.add(clz);
            }
        }
        children.mainClzPath = leftClz;
        subQuery.add(children);
        return typedThis;
    }


    /**
     * 单个条件元素信息
     */
    @Getter
    public class Element {
        public List<List<Class<? extends Item>>> queryPath;
        protected String source;
        protected R column;
        protected Opt opt;
        protected Object val;
        protected DataExpressTran tran;
        protected Object[] vals;

        public Object getVal() {
            return val;
//            if(opt==Opt.like){
//                return "%"+val+"%";
//            }else if(opt==Opt.startsWith){
//                return val+"%";
//            }else if(opt==Opt.endsWith){
//                return "%"+val;
//            }else{
//                return val;
//            }
        }

        /**
         * 找到该字段的左查询的全量路径
         * （如果element在子查询里则不包含父查询路径->可以全路径通过getQueryPath获取）
         */
        protected List<Class<? extends Item>> path;

        public Element(R column, List<Class<? extends Item>> path, Object val, Opt opt, DataExpressTran tran) {
            this.column = column;
            this.path = path;
            this.val = val;
            this.opt = opt;
            this.tran = tran;
        }

        public Element(R column, List<Class<? extends Item>> path, Opt opt, Object[] vals, DataExpressTran tran) {
            this.column = column;
            this.path = path;
            this.vals = vals;
            this.opt = opt;
            this.tran = tran;
        }

        public List<List<Class<? extends Item>>> getQueryPath() {
            return this.queryPath;
        }

        private <T extends AbstractWrapper> List getQueryPath(T thisRoot, List list) {
            List thisList = new ArrayList();
            thisList.addAll(thisRoot.getMainClzPath());
            thisList.add(list);
            if (thisRoot.getParent() != null && thisRoot.getParent().getMainClzPath() != null) {
                thisList = getQueryPath(thisRoot.getParent(), thisList);
            }
            return thisList;
        }

        /**
         * 字段的查询路径别名计算
         *
         * @return
         */
        public String queryPathNames() {
            if (getQueryPath() != null) {
                return VlifeUtils.fullPath("", getQueryPath(), true);
            }
            List list = this.getPath();
            if (typedThis.getParent() != null && typedThis.getMainClzPath() != null) {
                list = getQueryPath(typedThis, list);
            }
            return VlifeUtils.fullPath("", list, true);
        }
    }
}
