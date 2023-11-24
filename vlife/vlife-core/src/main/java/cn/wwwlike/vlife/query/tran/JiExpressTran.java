package cn.wwwlike.vlife.query.tran;
import cn.wwwlike.vlife.query.DataExpressTran;
import com.querydsl.core.types.dsl.*;
/**
 * 数据转换
 * 日期年月转换成年+季度
 */
public  class JiExpressTran extends DataExpressTran<SimpleExpression,SimpleExpression> {
    //年月转换成年+季度 老式方式，转成字符串，但是oracle不支持这种方式分组
    public  StringExpression tran1(SimpleExpression expression) {
        if(expression instanceof DatePath ==false && expression instanceof DateTimePath ==false){
            return null;// 入参错误
        }
        NumberExpression yearExpression=null;
        NumberExpression monthExpression=null;
        if(expression instanceof DatePath){
            yearExpression=((DatePath)expression).year();
            monthExpression=((DatePath)expression).month();
        }else{
            yearExpression=((DateTimePath)expression).year();
            monthExpression=((DateTimePath)expression).month();
        }
        NumberExpression year = yearExpression;
        NumberExpression ji = (NumberExpression) new CaseBuilder()
                .when(monthExpression.in(1,2,3)).then(1)
                .when(monthExpression.in(4,5,6)).then(2)
                .when(monthExpression.in(7,8,9)).then(3)
                .otherwise(4);
        //字符串表达式累加
        return Expressions.asString("").append(year).append("_").append(ji);
    }


    //按季度分组
    public SimpleExpression tran(SimpleExpression expression,String dbType) {
        if (!(expression instanceof DatePath) && !(expression instanceof DateTimePath)) {
            return null; // 入参错误
        }
        if(dbType.equals("Oracle")){
            return Expressions.numberTemplate(Integer.class, "TO_CHAR(TRUNC({0}, 'MM'), 'YYYY_Q')", expression);
        }else{//mysql数据库 MySQL
            return Expressions.stringTemplate("YEAR({0}) || '_' || QUARTER({0})", expression);
        }
    }
}
