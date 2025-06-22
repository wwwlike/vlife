package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 应用
 */
@Entity
@Data
@Table
@VClazz(unableRm = {Form.class})
public class SysApp  extends DbEntity {
    //应用名称
    public String name;
    //应用标识
    public String appKey;
    //图标
    public String icon;
    //描述
    public String remark;
    //排序号
    public Integer sort;
}
