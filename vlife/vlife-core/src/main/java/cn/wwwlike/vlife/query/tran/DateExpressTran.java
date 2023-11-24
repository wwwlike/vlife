package cn.wwwlike.vlife.query.tran;


import cn.wwwlike.vlife.query.DataExpressTran;
import com.querydsl.core.types.dsl.DatePath;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.SimpleExpression;

/**
 * 日期数据转换成年度(整型)
 */
public  class DateExpressTran extends DataExpressTran<SimpleExpression,NumberExpression> {
    public  NumberExpression tran(SimpleExpression expression,String dbType) {
        if(expression instanceof DatePath)
            return ((DatePath)expression).dayOfYear();
        else
            return ((DateTimePath)expression).dayOfYear();
    }
}
