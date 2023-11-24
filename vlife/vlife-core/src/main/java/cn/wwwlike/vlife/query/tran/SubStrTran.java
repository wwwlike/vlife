package cn.wwwlike.vlife.query.tran;

import cn.wwwlike.vlife.query.DataExpressTran;
import com.querydsl.core.types.dsl.SimpleExpression;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import lombok.AllArgsConstructor;


@AllArgsConstructor
public  class SubStrTran extends DataExpressTran<SimpleExpression,StringExpression> {
    /**
     * 截取的长度
     */
    private Integer len;


    public  StringExpression tran(SimpleExpression expression,String dbType) {
        if(expression instanceof StringPath ==false ){
            return null;// 入参错误
        }
        StringExpression  areaExpression= ((StringPath) expression).substring(0,len);
        //数据截取
        return areaExpression;
    }
}
