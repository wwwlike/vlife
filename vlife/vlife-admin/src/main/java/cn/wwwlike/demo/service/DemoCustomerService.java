package cn.wwwlike.demo.service;

import cn.wwwlike.demo.dao.DemoCustomerDao;
import cn.wwwlike.demo.entity.DemoCustomer;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class DemoCustomerService extends VLifeService<DemoCustomer, DemoCustomerDao> {
}
