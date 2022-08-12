package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 字典表
 * 所有字典大类来源于CT及子类里的定义；
 * 字典
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Table(name = "sys_dict")
@Entity
public class Dict extends DbEntity {
    /**
     *编码
     */
    public String code;
    /**
     * 值
     */
    public String val;
    /**
     * 名称
     */
    public String title;
    /**
     * 系统级
     */
    public Boolean sys; //管理员不可见
    /**
     * 删除标志
     */
    public Boolean del;//来源于Java里字典定义的则都不能删除

}
