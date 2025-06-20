package cn.vlife.utils;

import cn.vlife.common.IFormReaction;
import cn.wwwlike.vlife.bi.ConditionGroup;
import cn.wwwlike.vlife.bi.Where;
import com.google.common.reflect.TypeToken;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.objship.read.ItemReadTemplate.GSON;

public class FormRuleUtils {
    public static String objectArrayToString(Object[] values){
        return  Arrays.stream(values)
                .map(value -> "\"" + value + "\"") // 添加双引号
                .collect(Collectors.joining(", ", "[", "]")); // 连接成字符串
    }

    public static String convertTsToJs(String tsCode) {
        // 匹配参数的类型注释，例如 (user: User) => 改为 (user) =>
        String regex = "\\s*:\\s*\\w+\\s*";
        // 使用正则表达式替换
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(tsCode);
        // 将所有匹配的内容替换为空字符串
        String jsCode = matcher.replaceAll("");
        return jsCode;
    }

    public static String toVfEl(IFormReaction reaction){
        StringBuffer sb=new StringBuffer("VF.");
        sb.append(result(reaction));
        sb.append("then(`"+reaction.getFieldName()+"`).");
        if(reaction.getPropName()!=null&&!"true".equals(reaction.getPropValue())&&!"false".equals(reaction.getPropValue())){
            if("value".equals(reaction.getPropName())){
                // 给指定字段设置值
                sb.append(reaction.getPropName()+"("+convertTsToJs(reaction.getPropValue())+").getVF()");
            }else{
                //非value的属性设置
                sb.append(reaction.getPropName()+"(`"+reaction.getPropValue()+"`).getVF()");
            }
        }else{
            // 只读，隐藏，必填 等boolean类型
            sb.append(reaction.getPropName()+"().getVF()");
        }
        //所有点号之前如果没有点号则加一个问号，解决ts报错
        String result = sb.toString().replaceAll("(?<!\\?)\\.", "?.");
        return result;
    }




    //表单数据条件
    private static String dataConditionResult(IFormReaction reaction){
        List<ConditionGroup> groups= GSON.fromJson(reaction.getConditionJson(), new TypeToken<List<ConditionGroup>>() {}.getType());
        if((groups==null||groups.size()==0)&&reaction.getRegexStr()==null){
            return "";
        }
        StringBuffer buffer=new StringBuffer("result(_d=>{return ");
        if(reaction.getRegexStr()!=null){
            buffer.append("(!!_d."+reaction.getFieldName() +" && !/"+reaction.getRegexStr()+"/.test(_d."+reaction.getFieldName()+"))");
        }
        if(reaction.getRegexStr()!=null&& groups!=null&&groups.size()>0){
            buffer.append(" && ");
        }
        int i=0;
        if((groups!=null&&groups.size()>0)){
            buffer.append("(");
            for(ConditionGroup conditionGroup:groups){
                buffer.append(conditionEl(conditionGroup));
                i++;
                if(i<groups.size()){
                    buffer.append("||");
                }
            }
            buffer.append(")");
        }
        buffer.append("}).");
        return buffer.toString();
    }

    //Java数组转成TypeScript数组
    public static String convertToTypeScriptArray(String[] array) {
        StringBuilder tsArrayBuilder = new StringBuilder();
        tsArrayBuilder.append("[");
        for (int i = 0; i < array.length; i++) {
            tsArrayBuilder.append("\"").append(array[i]).append("\"");
            if (i < array.length - 1) {
                tsArrayBuilder.append(", ");
            }
        }
        tsArrayBuilder.append("]");
        return tsArrayBuilder.toString();
    }

    //用户数据条件,使用页面需要获取全局context的user对象
    private static String userConditionResult(IFormReaction reaction){
        String[] conditionArray= reaction.getConditionArray().split(",");
        String visitType=conditionArray[0];//授权对象类型
        String matchType=conditionArray[1]; //in not in 对比防水剂
        String[] visitIds=Arrays.copyOfRange(conditionArray, 2, conditionArray.length);//访问对象
        StringBuffer buffer=new StringBuffer("result((data,formDto,user)=>{return ");
        if(matchType.equals("notIn")){
            buffer.append("!");
        }
        buffer.append(convertToTypeScriptArray(visitIds));
        if(visitType.equals("sysUserIds")){
            buffer.append(".includes(user.id)");
        }else if(visitType.equals("sysDeptId")){
            buffer.append(".includes(user.sysDeptId)");
        }
        buffer.append("}).");
        return buffer.toString();
    }

    //判断条件
    private static String result(IFormReaction reaction){
        if(reaction.getConditionJson()!=null||reaction.getRegexStr()!=null){
            return dataConditionResult(reaction);
        }else if(reaction.getConditionArray()!=null){
            return userConditionResult(reaction);
        }
        return "";
    }


    //单个查询条件返回
    private static String conditionEl(ConditionGroup conditionGroup){
        StringBuffer buffer=new StringBuffer("(");
        int i=0;
        for(Where where:conditionGroup.getWhere()){
            buffer.append(singleEl(where));
            i++;
            if(i<conditionGroup.getWhere().size()){
                buffer.append("&&");
            }
        }
        buffer.append(")");
        return buffer.toString();
    }

    private static String singleEl(Where where){
        StringBuffer buffer=new StringBuffer();
        String fieldName="_d?."+where.getFieldName();
        String opt=where.getOpt();
        Object[] values=where.getValue();
        if(opt.equals("eq")){
            if(where.getFieldType().equals("string")){
                buffer.append(fieldName+"===\""+values[0]+"\"");
            }else{
                buffer.append(fieldName+"==="+values[0]);
            }
        } else if(opt.equals("ne")){
            if(where.getFieldType().equals("string")){
                buffer.append(fieldName+"!==\""+values[0]+"\"");
            }else{
                buffer.append(fieldName+"!=="+values[0]);
            }
        }else if(opt.equals("gt")){
            buffer.append(fieldName+">\""+values[0]+"\"");
        }else if(opt.equals("goe")){
            buffer.append(fieldName+">=\""+values[0]+"\"");
        }else if(opt.equals("lt")){
            buffer.append(fieldName+"<\""+values[0]+"\"");
        }else if(opt.equals("loe")){
            buffer.append(fieldName+"<=\""+values[0]+"\"");
        }else if(opt.equals("like")){
            buffer.append(fieldName+"?.includes(\"" + values[0] + "\")");
        }else if(opt.equals("notLike")){
            buffer.append("!"+fieldName+ "?.includes(\"" + values[0] + "\")");
        }else if(opt.equals("startsWith")){
            buffer.append(fieldName+"?.startsWith(\"" + values[0] + "\")");
        }else if(opt.equals("endsWith")){
            buffer.append(fieldName+"?.endsWith(\"" + values[0] + "\")");
        }else if(opt.equals("between")){
            buffer.append(fieldName+">=" + values[0] + " &&"+fieldName+"." + where.getFieldName() + "<=" + values[1]);
        }else if(opt.equals("notBetween")){
            buffer.append(fieldName+ "<" + values[0] + " ||"+fieldName + ">" + values[1]);
        }else if(opt.equals("in")){
            if(where.getFieldType().equals("string")){
                buffer.append(objectArrayToString(values)+".includes("+fieldName+")");
            }else{
                buffer.append(Arrays.toString(values)+".includes("+fieldName+")");
            }
        }else if(opt.equals("notIn")){
            if(where.getFieldType().equals("string")){
                buffer.append("!"+objectArrayToString(values)+".includes("+fieldName+")");
            }else{
                buffer.append("!"+Arrays.toString(values)+".includes("+fieldName+")");
            }
        }else if(opt.equals("isNotNull")){
            if(where.getFieldType().equals("number")){
                buffer.append(fieldName+"!==null&&"+fieldName+"!==undefined&&"+fieldName+"!==\"\"&& !isNaN("+fieldName+")");
            }else{
                buffer.append(fieldName+"?.length>0");
            }
        }else if(opt.equals("isNull")){
            if(where.getFieldType().equals("number")){
                buffer.append(fieldName+"===null||"+fieldName+"===undefined||"+fieldName+"===\"\"||isNaN("+fieldName+")");
            }else{
                buffer.append(fieldName+"===null||"+fieldName+"===undefined||"+fieldName+"?.length===0");
            }
        }else if(opt.equals("dynamic")){
            if(values[0].equals("today")){
                buffer.append("new Date("+fieldName+")?.toDateString()===new Date().toDateString()");
            }


        }
        return buffer.toString();
    }
}
