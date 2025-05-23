// 请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.api;

import cn.vlife.erp.dto.ErpOrderSaleSendDto;
import cn.vlife.erp.service.ErpOrderSaleSendService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 发货单接口
 */
@RestController
@RequestMapping("/erpOrderSaleSendDto")
public class ErpOrderSaleSendDtoApi extends VLifeApi<ErpOrderSaleSendDto, ErpOrderSaleSendService> {

}
