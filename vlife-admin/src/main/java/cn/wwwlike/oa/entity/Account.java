package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 员工用户
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Table(name = "sys_account")
@Entity
//@VClazz(clear = {Project.class})
public class Account extends DbEntity {
    /**
     * 密码
     */
    public String password;
    /**
     * 账号
     */
    public String account;
    /**
     * 姓名
     */
    public String name;
    /**
     * 电话号码
     */
    public String tel;
    /**
     * 年龄
     */
    public Integer age;
    /**
     * 性别(字典)
     */
    public String sex;

    /**
     * 所在部门
     */
    public String deptId;

}
