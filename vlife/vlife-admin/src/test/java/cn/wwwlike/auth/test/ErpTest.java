package cn.wwwlike.auth.test;

import cn.vlife.erp.service.ProductService;
import cn.wwwlike.AdminApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * 新增为主的测试
 *
 * @author xiaoyu
 * @date 2022/6/25
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AdminApplication.class)
public class ErpTest {

    @Autowired
    public ProductService productService;
    @Test
    public void test(){

    }
}
