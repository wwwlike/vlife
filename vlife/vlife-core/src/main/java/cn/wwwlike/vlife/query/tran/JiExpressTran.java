package cn.wwwlike.vlife.query.tran;
import cn.wwwlike.vlife.query.DataExpressTran;
import com.querydsl.core.types.dsl.*;
/**
 * 数据转换
 * 日期年月转换成年+季度
 */
public  class JiExpressTran extends DataExpressTran<SimpleExpression,StringExpression> {
    //年月转换成年+季度
    public  StringExpression tran(SimpleExpression expression) {
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
}
