package cn.wwwlike.demo.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 甲方客户
 */
@Data
@Table(name = "demo_customer")
@Entity
public class DemoCustomer extends DbEntity {
    //客户名称
    public String name;

}
