package cn.wwwlike.erp.req;

import cn.wwwlike.erp.entity.Product;
import cn.wwwlike.erp.entity.Supplier;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.List;

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
     * 产品品牌
     */
    public  List<String> brand;

}
