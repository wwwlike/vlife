// Entity和DTO模型均对应生成一个接口类,研发可以在该类上进行二次开发请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.api;

import cn.vlife.erp.dto.ErpOrderInbound;
import cn.vlife.erp.dto.ErpOrderPurchaseDto;
import cn.vlife.erp.entity.ErpOrderPurchase;
import cn.vlife.erp.service.ErpOrderPurchaseService;
import cn.vlife.erp.service.ErpProductTotalService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 采购单接口
 */
@RestController
@RequestMapping("/erpOrderPurchase")
public class ErpOrderPurchaseApi extends VLifeApi<ErpOrderPurchase, ErpOrderPurchaseService> {

}
