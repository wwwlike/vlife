package cn.vlife.erp.service;

import cn.vlife.erp.dao.OrderPurchaseDetailDao;
import cn.vlife.erp.entity.OrderPurchase;
import cn.vlife.erp.entity.OrderPurchaseDetail;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderPurchaseDetailService extends BaseService<OrderPurchaseDetail, OrderPurchaseDetailDao> {
    //查询指定仓库的指定产品的采购明细表里还未售罄的记录
    public List<OrderPurchaseDetail> getWareHouseStockDetail(String productId, String warehouseId){
        QueryWrapper<OrderPurchaseDetail> qw=QueryWrapper.of(OrderPurchaseDetail.class);
        qw.eq("warehouseId",warehouseId, OrderPurchase.class);//主表关联仓库
        qw.eq("productId",productId);
        qw.gt("stockTotal",0);
        return find(qw);
    }
}
