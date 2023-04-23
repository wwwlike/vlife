package cn.wwwlike.erp.service;

import cn.wwwlike.common.BaseService;
import cn.wwwlike.erp.dao.CustomerDao;
import cn.wwwlike.erp.entity.Customer;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class CustomerService extends BaseService<Customer, CustomerDao> {
}
