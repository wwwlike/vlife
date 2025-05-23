package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 视图按钮
 * 单个视图可用按钮
 */
@Table
@Data
@Entity
public class SysTabButton extends DbEntity {
    //视图
    public String sysTabId;
    //视图绑定按钮
    public String buttonId;
    //按钮排序
    public Integer buttonSort;
    //按钮位置
    public String buttonPosition;
}
