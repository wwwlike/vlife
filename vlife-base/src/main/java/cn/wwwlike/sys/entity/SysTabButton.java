package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 视图与按钮关联表
 */
@Table
@Data
@Entity
public class SysTabButton extends DbEntity {
    //视图
    public String sysTabId;
    //按钮
    public String buttonId;
    //排序
    public Integer buttonSort;
    //位置
    public String buttonPosition;
}
