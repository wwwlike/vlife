package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.CustomerDao;
import cn.wwwlike.oa.entity.Customer;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class CustomerService extends VLifeService<Customer, CustomerDao> {
}
