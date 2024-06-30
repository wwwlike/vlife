package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 系统变量
 * 前端做数据展示和逻辑处理用到的变量(系统名称，分页数量，系统图标等)
 */
@Entity
@Data
@Table
public class SysVar extends DbEntity {
    //名称
    public String name;
    //标识
    public String varKey;
    //分组
    public String groupType;
    /**
     * 类型
     * (图片,字符串，数字，布尔，枚举，日期)
     */
    public String type;
    //系统级
    public boolean sys;
    //排序
    public Integer sort;
    //变量说明
    public String remark;
    /**
     * 变量值
     * 管理员设置的实际值
     */
    public String val;
}
