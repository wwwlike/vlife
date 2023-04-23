package cn.wwwlike.erp.service;

import cn.wwwlike.erp.dao.OrderSaleDao;
import cn.wwwlike.erp.entity.OrderSale;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class OrderSaleService extends VLifeService<OrderSale, OrderSaleDao> {
}