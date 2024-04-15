package cn.wwwlike.vlife.bi;

import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class ConditionUtils {

   //条件组匹配判断
    public static <T> boolean groupsMatch(T obj,List<ConditionGroup> conditions){
        for(ConditionGroup conditionGroup:conditions){
           if( wheresMatch(obj,conditionGroup.getWhere())){
               return true;// ConditionGroup list数组满足一个即可 是逻辑或
           }
        }
        return false;
    }
    // 1大于 0等于  -小于
    public static Integer compareObjects(Object obj1, Object obj2) {
        try {
            Number number1 = NumberFormat.getInstance().parse(obj1.toString());
            Number number2 = NumberFormat.getInstance().parse(obj2.toString());
            return  ((Comparable) number1).compareTo((Comparable) number2);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        //不可比较
        return null;
    }

    public static <T> boolean wheresMatch(T obj, List<Where> wheres){
        for(Where where:wheres){
            if(obj instanceof Map){
                if(!match(((Map)obj).get(where.getFieldName()), where)){
                    return false;
                }
            } else if(obj instanceof ObjectNode){
                if(!match(((TextNode)((ObjectNode)obj).get(where.getFieldName())).asText(), where)){
                    return false;
                }
            } else {
                // Handle other types if needed
                return false;
            }
        }
        return true;
    }

    public static boolean match(Object fieldValue,Where where){
        if ((where.getOpt().equals(Opt.eq.optName) && !fieldValue.equals(where.getValue()[0])) ||
                (where.getOpt().equals(Opt.in.optName) && !Arrays.asList(where.getValue()).contains(fieldValue))) {
            return false;
        }else if (where.getOpt().equals(Opt.gt.optName)||where.getOpt().equals(Opt.goe.optName)||where.getOpt().equals(Opt.lt.optName)||where.getOpt().equals(Opt.loe.optName)){
            Integer comparableResult=compareObjects(fieldValue,where.getValue()[0]);
            if(where.getOpt().equals(Opt.gt.optName)&&comparableResult<=0){
                return false;
            }else if(where.getOpt().equals(Opt.goe.optName)&&comparableResult<0){
                return false;
            }else if(where.getOpt().equals(Opt.lt.optName)&&comparableResult>=0){
                return false;
            }else if(where.getOpt().equals(Opt.loe.optName)&&comparableResult>0){
                return false;
            }
        }else if (where.getOpt().equals(Opt.ne.optName) && fieldValue.equals(where.getValue()[0])) {
            return false;
        } else if (where.getOpt().equals(Opt.isNotNull.optName) && fieldValue == null) {
            return false;
        } else if (where.getOpt().equals(Opt.isNull.optName) && fieldValue != null) {
            return false;
        } else if (where.getOpt().equals(Opt.notIn.optName) && Arrays.asList(where.getValue()).contains(fieldValue)) {
            return false;
        }else if (where.getOpt().equals(Opt.like.optName) && !(fieldValue instanceof String && ((String)fieldValue).contains((String)where.getValue()[0]))) {
            return false;
        } else if (where.getOpt().equals(Opt.notLike.optName) && (fieldValue instanceof String && ((String)fieldValue).contains((String)where.getValue()[0]))) {
            return false;
        } else if (where.getOpt().equals(Opt.startsWith.optName) && !(fieldValue instanceof String && ((String)fieldValue).startsWith((String)where.getValue()[0]))) {
            return false;
        } else if (where.getOpt().equals(Opt.endsWith.optName) && !(fieldValue instanceof String && ((String)fieldValue).endsWith((String)where.getValue()[0]))) {
            return false;
        } else if (where.getOpt().equals(Opt.between.optName) && !(fieldValue instanceof Comparable && ((Comparable)fieldValue).compareTo((Comparable)where.getValue()[0]) >= 0 && ((Comparable)fieldValue).compareTo((Comparable)where.getValue()[1]) <= 0)) {
            return false;
        } else if (where.getOpt().equals(Opt.notBetween.optName) && (fieldValue instanceof Comparable && ((Comparable)fieldValue).compareTo((Comparable)where.getValue()[0]) >= 0 && ((Comparable)fieldValue).compareTo((Comparable)where.getValue()[1]) <= 0)) {
            return false;
        }
        return true;
    }
}
