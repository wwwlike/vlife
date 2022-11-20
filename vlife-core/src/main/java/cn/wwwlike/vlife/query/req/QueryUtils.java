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

package cn.wwwlike.vlife.query.req;

import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.bi.Where;
import cn.wwwlike.vlife.query.AbstractWrapper;

import java.util.List;

/**
 * 查询工具类
 */
public class QueryUtils {

    /**
     * 将B端定义的查询转换成queryWrapper里
     *
     * @param qw        包裹数据对象
     * @param condition b端定义查询条件
     * @return
     */
    public static <T extends AbstractWrapper> T condition(T qw, Conditions condition) {
        if (condition.getWhere() != null && condition.getWhere().size() > 0) {
//            BiConsumer<List<Conditions>, AbstractWrapper> childa = (x, b) -> {
//                System.out.println(x);
//            };
            if (condition.orAnd.equals("and")) {
                //增加一组and过滤
                qw.and(ww -> where((T) ww, condition.getWhere())
//                        .and((condition.getConditions() != null), qq -> condition((T) qq, condition.getConditions().get(0))));
                        .and(condition.conditions != null, (d -> {
                            for (Conditions cc : condition.getConditions()) {
                                ((AbstractWrapper<?, ?, ?>) ww).and(ee -> condition((T) ee, cc));//递归
                            }
                        })));
                //                if(condition.getConditions()!=null&&condition.getConditions().size()>0){
//                    for(Conditions cc:condition.getConditions()){
//                        qw.and(ww->condition((T) ww,cc));//递归
//                    }
//                }
            }
            if (condition.orAnd.equals("or")) {
                qw.or(ww -> where((T) ww, condition.getWhere()).or((condition.getConditions() != null), (d -> {
                    for (Conditions cc : condition.getConditions()) {
                        ((AbstractWrapper<?, ?, ?>) ww).and(ee -> condition((T) ee, cc));//递归
                    }
                })));
//                if(condition.getConditions()!=null&&condition.getConditions().size()>0){
//                    for(Conditions cc:condition.getConditions()){
//                        qw.or(ww->condition((T) ww,cc));//递归
//                    }
//                }
            }
//        if(condition.getConditions()!=null&&condition.getConditions().size()>0){
//
//        }
        }
        return qw;
    }

    public static AbstractWrapper where(AbstractWrapper qw, List<Where> wheres) {
        for (Where w : wheres) {
            if (w.getOpt().equals("eq")) {
                qw.eq(w.getFieldName(), w.getValue()[0]);
            }
        }
        return qw;
    }

}
