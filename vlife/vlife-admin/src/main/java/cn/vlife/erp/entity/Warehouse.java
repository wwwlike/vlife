package cn.vlife.erp.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 仓库
 */
@Data
@Entity
@Table(name = "erp_ware_house")
public class Warehouse extends DbEntity {
    //仓库名称
    public String name;
    //仓库地址
    public String address;
    //仓库负责人
    public String sysUserId;
    //仓库面积
    public Double area;
}
