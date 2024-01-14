package cn.vlife.erp.req;

import cn.vlife.erp.entity.Product;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

/**
 * 产品查询
 */
@Data
public class ProductPageReq extends PageQuery<Product> {
    /**
     * 产品名/编号
     */
    @VField(opt = Opt.like,orReqFields = {"productNo"})
    public String name;
    /**
     * 品牌
     */
    public  String brand;

}
