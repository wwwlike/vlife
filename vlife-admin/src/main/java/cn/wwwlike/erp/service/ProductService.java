package cn.wwwlike.erp.service;

import cn.wwwlike.common.BaseService;
import cn.wwwlike.erp.dao.ProductDao;
import cn.wwwlike.erp.entity.Product;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class ProductService extends BaseService<Product, ProductDao> {
}
