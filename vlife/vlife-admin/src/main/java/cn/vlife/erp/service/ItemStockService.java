package cn.vlife.erp.service;
import cn.wwwlike.common.BaseService;
import cn.vlife.erp.dao.ItemStockDao;
import cn.vlife.erp.dto.OrderPurchaseDto;
import cn.vlife.erp.dto.OrderSendDto;
import cn.vlife.erp.entity.ItemStock;
import cn.vlife.erp.entity.OrderPurchaseDetail;
import cn.vlife.erp.entity.OrderSendRelation;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemStockService extends BaseService<ItemStock, ItemStockDao> {

    @Autowired
    OrderPurchaseDetailService purchaseDetailService;

    /**
     * 库存管理(出库入库)
     * @param productId 产品
     * @param warehouseId 仓库
     * @param num  数量(负数为出库)
     */
    public void stockManagement(String productId,String warehouseId,Integer num){
        QueryWrapper qw= QueryWrapper.of(ItemStock.class)
                .eq("productId",productId).eq("warehouseId",warehouseId);
        List<ItemStock> stocks=find(qw);
        ItemStock stock=null;
        if(stocks!=null&& stocks.size()>0){
            stock=stocks.get(0);
            stock.setTotal(stock.getTotal()+num);
        }else{
            stock=new ItemStock();
            stock.setWarehouseId(warehouseId);
            stock.setTotal(num);
            stock.setProductId(productId);
        }
        save(stock);
    }

    /**
     * 采购入库
     */
    public OrderPurchaseDto purchaseIn(OrderPurchaseDto purchase){
        purchase.getDetails().forEach(detail->{
            QueryWrapper qw= QueryWrapper.of(ItemStock.class)
                    .eq("productId",detail.getProductId()).eq("warehouseId",purchase.getWarehouseId());
            List<ItemStock> stocks=find(qw);
            ItemStock stock=null;
            if(stocks!=null&& stocks.size()>0){
                stock=stocks.get(0);
                stock.setTotal(stock.getTotal()+detail.getTotal());
                stock.setCostPrice(stock.getCostPrice()+detail.getTotal()* detail.getPrice());
            }else{
                stock=new ItemStock();
                stock.setWarehouseId(purchase.getWarehouseId());
                stock.setTotal(detail.getTotal());
                stock.setProductId(detail.getProductId());
                stock.setCostPrice(detail.getTotal()* detail.getPrice());
            }
            save(stock);
            detail.setStockTotal(detail.getTotal());
        });

        return purchase;
    }


    /**
     * 销售出库
     */
    public void saleOut(OrderSendDto send){
        send.getDetails().forEach(sendDetail->{
            QueryWrapper qw= QueryWrapper.of(ItemStock.class)
                    .eq("productId",sendDetail.getProductId()).eq("warehouseId",sendDetail.getWarehouseId());
            List<ItemStock> stocks=find(qw);
            //库存来源明细
            List<OrderPurchaseDetail> purchaseDetails= purchaseDetailService.getWareHouseStockDetail(sendDetail.getProductId(), sendDetail.getWarehouseId());
            Integer sendNum=sendDetail.getRealNum();
            Double sendPrice=new Double(0);//库存总额扣除
            for(OrderPurchaseDetail purchaseDetail:purchaseDetails){
                OrderSendRelation relation=new OrderSendRelation();
                relation.setOrderPurchaseDetaidId(purchaseDetail.getId());
                relation.setOrderSendDetailId(sendDetail.getId());
                if(purchaseDetail.getStockTotal()>=sendNum){
                    purchaseDetail.setStockTotal(purchaseDetail.getStockTotal()-sendNum);
                    sendPrice+=purchaseDetail.getPrice()*sendNum;
                    relation.setNum(sendNum);
                }else{
                    relation.setNum(purchaseDetail.getStockTotal());
                    sendPrice+=purchaseDetail.getPrice()*(purchaseDetail.getStockTotal());
                    purchaseDetail.setStockTotal(0);
                }
                purchaseDetailService.save(purchaseDetail);
                if(purchaseDetail.getStockTotal()>=sendNum){
                    break;
                }else{
                    sendNum=sendNum-purchaseDetail.getStockTotal();
                }
            }
            ItemStock stock=null;
            if(stocks!=null&& stocks.size()>0){
                stock=stocks.get(0);
                stock.setTotal(stock.getTotal()-sendDetail.getRealNum());
                stock.setCostPrice(stock.getCostPrice()- sendPrice);
            }else{
                //库存没有，不能出库，
            }
            save(stock);
        });
    }


    /**
     * 销售退货
     */
    public void saleBack(OrderSendDto send){
        send.getDetails().forEach(sendDetail->{
            QueryWrapper qw= QueryWrapper.of(ItemStock.class)
                    .eq("productId",sendDetail.getProductId()).eq("warehouseId",sendDetail.getWarehouseId());
            List<ItemStock> stocks=find(qw);
            //库存来源明细
            List<OrderPurchaseDetail> purchaseDetails= purchaseDetailService.getWareHouseStockDetail(sendDetail.getProductId(), sendDetail.getWarehouseId());
            Integer sendNum=sendDetail.getRealNum();
            Double sendPrice=new Double(0);//库存总额扣除
            for(OrderPurchaseDetail purchaseDetail:purchaseDetails){
                OrderSendRelation relation=new OrderSendRelation();
                relation.setOrderPurchaseDetaidId(purchaseDetail.getId());
                relation.setOrderSendDetailId(sendDetail.getId());
                if(purchaseDetail.getStockTotal()>=sendNum){
                    purchaseDetail.setStockTotal(purchaseDetail.getStockTotal()-sendNum);
                    sendPrice+=purchaseDetail.getPrice()*sendNum;
                    relation.setNum(sendNum);
                }else{
                    relation.setNum(purchaseDetail.getStockTotal());
                    sendPrice+=purchaseDetail.getPrice()*(purchaseDetail.getStockTotal());
                    purchaseDetail.setStockTotal(0);
                }
                purchaseDetailService.save(purchaseDetail);
                if(purchaseDetail.getStockTotal()>=sendNum){
                    break;
                }else{
                    sendNum=sendNum-purchaseDetail.getStockTotal();
                }
            }
            ItemStock stock=null;
            if(stocks!=null&& stocks.size()>0){
                stock=stocks.get(0);
                stock.setTotal(stock.getTotal()-sendDetail.getRealNum());
                stock.setCostPrice(stock.getCostPrice()- sendPrice);
            }else{
                //库存没有，不能出库，
            }
            save(stock);
        });
    }


}
