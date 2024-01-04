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

import cn.wwwlike.vlife.bi.ConditionGroup;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.bi.Where;
import cn.wwwlike.vlife.dict.DateRange;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.DataExpressTran;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.tran.DateExpressTran;
import cn.wwwlike.vlife.query.tran.MonthExpressTran;
import cn.wwwlike.vlife.query.tran.WeekExpressTran;
import cn.wwwlike.vlife.query.tran.YearExpressTran;
import com.querydsl.core.types.dsl.Expressions;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import java.sql.Date;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

/**
 * 查询工具类
 */
public class QueryUtils {

    /**
     * 将B端定义的查询转换成queryWrapper里
     * 支持嵌套的querybuild查询条件
     * @param qw        包裹数据对象
     * @param condition b端定义查询条件
     * @return
     */
    public static <T extends AbstractWrapper> T condition(T qw, Conditions condition) {
        if ("and".equals(condition.orAnd)) {
            //增加一组and过滤
            qw.and(ww -> where((T) ww, condition.getWhere())
                    .and(condition.conditions != null, (d -> {
                        for (Conditions cc : condition.getConditions()) {
                            ((AbstractWrapper<?, ?, ?>) ww).and(ee -> condition((T) ee, cc));//递归
                        }
                    })));
        }
        if ("or".equals(condition.orAnd)) {
            qw.or(ww -> where((T) ww, condition.getWhere()).or((condition.getConditions() != null), (d -> {
                for (Conditions cc : condition.getConditions()) {
                    ((AbstractWrapper<?, ?, ?>) ww).and(ee -> condition((T) ee, cc));//递归
                }
            })));
        }
        return qw;
    }

    public static <T extends AbstractWrapper> T condition(T qw, List<ConditionGroup> groups) {
        qw.or(ww -> groups.forEach(g->((T)ww).and(www->where((T) www,g.getWhere()))));

//        qw.and(ww -> groups.stream()
//                .map(g -> where((T) ww, g.getWhere()))
//                .reduce((g1, g2) -> g1.or((Consumer) g2))
//                .orElse(qw));

//        qw.and(ww -> qw.or(((T)ww) ->groups.forEach(g->((T)ww).and(www->where((T) www,g.getWhere())))));

//        qw.and(ww ->
//                ((T)ww).or(www->
//                        groups.forEach(g->((T)ww).and(www->where((T) www,g.getWhere())))));

        return qw;
    }


    /**
     * 进行一组查询
     * @param qw
     * @param wheres
     * @return
     */
    public static <T extends AbstractWrapper>T where(T qw, List<Where> wheres) {
        for (Where w : wheres) {
            if(StringUtils.isNotBlank(w.getFieldName()) && StringUtils.isNotBlank(w.getOpt())){
                if (!w.getOpt().equals("isNotNull")&&!w.getOpt().equals("isNull")&&w.getValue()!=null
                 &&w.getValue()!=null&& w.getValue().length > 0 && Arrays.stream(w.getValue()).filter(v->v!=null&&StringUtils.isNotBlank(v.toString())).count()==w.getValue().length
                ) {
                    //动态范围
                    if (w.getOpt().equals("dynamic")) {
                        LocalDate today = LocalDate.now();
                        Integer currentMonth = LocalDate.now().getMonthValue();
                        Integer currentYear = LocalDate.now().getYear();
                        DateRange dateRange = DateRange.valueOf(w.getValue()[0].toString().toUpperCase());
                        switch (dateRange) {
                            case TODAY:
                                qw.eq(w.getFieldName(), Date.valueOf(today));
                                break;
                            case YESTERDAY:
                                qw.eq(w.getFieldName(), Date.valueOf(today.minusDays(1)));
                                break;
                            case THIS_WEEK:
                                Integer currentWeek = LocalDate.now().get(WeekFields.ISO.weekOfWeekBasedYear());
                                qw.eq(true, w.getFieldName(), currentWeek, new WeekExpressTran());
                                break;
                            case LAST_WEEK:
                                Integer lastWeek = LocalDate.now().minusWeeks(1).get(WeekFields.ISO.weekOfWeekBasedYear());
                                qw.eq(true, w.getFieldName(), lastWeek, new WeekExpressTran());
                                break;
                            case THIS_MONTH:
                                Integer yearMonth = Integer.parseInt(String.format("%04d%02d", currentYear, currentMonth));
                                qw.eq(true, w.getFieldName(), yearMonth, new MonthExpressTran());
                                break;
                            case LAST_MONTH:
                                Integer lastMonth = Integer.parseInt(String.format("%04d%02d", currentYear, LocalDate.now().minusMonths(1).getMonthValue()));
                                qw.eq(true, w.getFieldName(), lastMonth, new MonthExpressTran());
                                break;
                            case THIS_YEAR:
                                qw.eq(true, w.getFieldName(), currentYear, new YearExpressTran());
                                break;
                            case LAST_YEAR:
                                Integer lastYear = LocalDate.now().minusYears(1).getYear();
                                qw.eq(true, w.getFieldName(), lastYear, new YearExpressTran());
                                break;
                            case LAST_7_DAYS:
                                LocalDate last7Days = today.minusDays(7);
                                qw.goe(w.getFieldName(), Date.valueOf(last7Days));
                                break;
                            case LAST_30_DAYS:
                                LocalDate last30Days = today.minusDays(30);
                                qw.goe(w.getFieldName(), Date.valueOf(last30Days));
                                break;
                            case LAST_90_DAYS:
                                LocalDate last90Days = today.minusDays(90);
                                qw.goe(w.getFieldName(), Date.valueOf(last90Days));
                                break;
                            case LAST_1_YEAR:
                                LocalDate last1Year = today.minusYears(1);
                        }
                    }  else {
                        Object value = w.getValue()[0];
                        try {
                            if ("number".equals(w.getFieldType())) {
                                value = NumberFormat.getInstance().parse(value.toString());
                            }else if ("date".equals(w.getFieldType())) {
                                value = DateUtils.parseDate(value.toString(),"yyyy/MM/dd");
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        if (w.getOpt().equals(Opt.eq.optName)) {
                            qw.eq(w.getFieldName(), value,w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.gt.optName)) {
                            qw.gt(w.getFieldName(), value,w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.goe.optName)) {
                            qw.goe(w.getFieldName(), value,w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.lt.optName)) {
                            qw.lt(w.getFieldName(), value,w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.loe.optName)) {
                            qw.loe(w.getFieldName(), value,w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.like.optName)) {
                            qw.like(w.getFieldName(), "%" + w.getValue()[0] + "%",w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.startsWith.optName)) {
                            qw.startsWith(w.getFieldName(), w.getValue()[0] + "%",w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.endsWith.optName)) {
                            qw.endsWith(w.getFieldName(), "%" + w.getValue()[0],w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.ne.optName)) {
                            Object finalValue = value;
                            qw.or(d->{
                                ((AbstractWrapper)d).isNull(w.getFieldName(),w.getClazz());
                                ((AbstractWrapper)d).ne(w.getFieldName(), finalValue,w.getClazz());
                            });//递归
                        }
                        if (w.getOpt().equals(Opt.notIn.optName)) {
                            qw.notIn(w.getFieldName(), w.getValue(),w.getClazz());
                        }
                        if (w.getOpt().equals(Opt.in.optName)) {
                            qw.in(w.getFieldName(), w.getValue(),w.getClazz());
                        }
                    }
                }else if (w.getOpt().equals(Opt.isNotNull.optName)) {
                    qw.isNotNull(w.getFieldName(),w.getClazz());
                } else if (w.getOpt().equals(Opt.isNull.optName)) {
                    qw.isNull(w.getFieldName(),w.getClazz());
                }
            }
        }
//        }
        return qw;
    }

}
