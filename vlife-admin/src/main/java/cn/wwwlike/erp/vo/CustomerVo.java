package cn.wwwlike.erp.vo;

import cn.wwwlike.erp.entity.Customer;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

/**
 * 客户详情
 */
@Data
public class CustomerVo implements VoBean<Customer> {
   public String id;
   /**
    * 销售老大
    */
   public String sysUserId;
}

