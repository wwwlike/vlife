// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.service;

import cn.vlife.erp.dao.ErpOrderSaleSendDao;
import cn.vlife.erp.dto.ErpOrderSaleDto;
import cn.vlife.erp.dto.ErpOrderSaleSendDto;
import cn.vlife.erp.entity.*;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.core.DataProcess;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.UnaryOperator;

@Service
public class ErpOrderSaleSendService extends BaseService<ErpOrderSaleSend, ErpOrderSaleSendDao> {
    @Autowired
    private ErpOrderSaleService saleService;
    @Autowired
    private ErpProductTotalService productTotalService;
    @Autowired
    private ErpProductService productService;
    @Autowired
    private ErpOrderSaleItemService orderSaleItemService;
    @Autowired
    private ErpOrderSaleSendItemService saleSendItemService;



    private ErpOrderSaleSendDto save(ErpOrderSaleSendDto dto){
        //发货目前一步完成，不需要审核，所以id有值的就是已发货的，不能进入下面逻辑
        if(dto.getId()==null&&dto.getErpOrderSaleId()!=null){
            //1发货单对应的销售单
            ErpOrderSaleDto saleDto=saleService.queryOne(ErpOrderSaleDto.class,dto.getErpOrderSaleId());
            String  saleState=saleDto.getState();
            //2. 判断销售单状态(为待发货或者发货中)
            if(saleState.equals("4")||saleState.equals("5")){
                //1. 判断库存是否够
                for (ErpOrderSaleSendItem send:dto.getErpOrderSaleSendItem()) {
                    ErpProductTotal total= productTotalService.findOne(send.getErpProductTotalId());//产品库存
                    ErpOrderSaleItem saleItem=orderSaleItemService.findOne(send.getErpOrderSaleItemId());//发货明细对应的销售明细
                    List<ErpOrderSaleSendItem> itemSends=saleSendItemService.find("erpOrderSaleItemId",saleItem.getId());//销售明细对应的发货单
                    Integer orderNum=saleItem.getTotalNum();//应发数量
                    Integer realNum=itemSends==null?0:itemSends.stream()
                            .mapToInt(ErpOrderSaleSendItem::getTotalSend)
                            .sum();//已发数量
                    Integer productWarehouseTotal=total.getTotalNum();//仓库指定产品库存数量
                    Integer sendNum=send.getTotalSend();//本次发货数量
                    //1. 判断应发数量是否大于当前发货数量(应发数量+已发数量 应该<=销售单明细数量)
                    CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(realNum+sendNum<=orderNum,productService.findOne(total.getErpProductId()).getName()+"超过订单应发货数量");
                    //2.判断库存是否够
                    CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(productWarehouseTotal>sendNum,productService.findOne(total.getErpProductId()).getName()+"库存不足");
                }
                //二次遍历更新库存,更新订单明细待发货数量
                for (ErpOrderSaleSendItem send:dto.getErpOrderSaleSendItem()) {
                    ErpProductTotal total= productTotalService.findOne(send.getErpProductTotalId());
                    ErpOrderSaleItem saleItem=orderSaleItemService.findOne(send.getErpOrderSaleItemId());//发货明细对应的销售明细
                    Integer productWarehouseTotal=total.getTotalNum();//仓库指定产品库存
                    Integer sendNum=send.getTotalSend();
                    total.setTotalNum(productWarehouseTotal-sendNum);
                    saleItem.setWait(saleItem.getWait()-sendNum);
                    orderSaleItemService.save(saleItem);
                    productTotalService.save(total);
                }
                //3. 更新销售单状态 所有发货明细数量之和是否等于销售明细之和 全等就是发货完毕，其余是发货中
                saleService.updateState(saleDto.getId());
            }
        }else{
            CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(dto.getId()==null,"该单据产品已出库，不能修改");
        }
        return dto;
    }






    @Override
    public <E extends IdBean> E saveBean(E idBean, boolean isFull) {
        //发货单逻辑处理
        if(ErpOrderSaleSendDto.class==idBean.getClass()){
            idBean= (E) save((ErpOrderSaleSendDto)idBean);
            return super.saveBean(idBean, isFull);
        }

        return idBean;

    }
}
