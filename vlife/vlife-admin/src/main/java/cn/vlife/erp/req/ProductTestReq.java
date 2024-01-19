package cn.vlife.erp.req;

import cn.vlife.erp.entity.Product;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

import java.util.List;

@Data
public class ProductTestReq extends PageQuery<Product> {
//    public String abcd;
    public String orderSaleDetail_orderSaleId;
}
