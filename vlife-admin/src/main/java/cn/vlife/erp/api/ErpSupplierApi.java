// Entity和DTO模型均对应生成一个接口类,研发可以在该类上进行二次开发请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版
package cn.vlife.erp.api;

import cn.vlife.erp.entity.ErpSupplier;
import cn.vlife.erp.service.ErpSupplierService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 供应商接口
 */
@RestController
@RequestMapping("/erpSupplier")
public class ErpSupplierApi extends VLifeApi<ErpSupplier, ErpSupplierService> {
}
