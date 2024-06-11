package cn.wwwlike.auth.common;

/**
 * 部门用户查询实体
 * 存放用户id以及该用户所属部门code的实体
 */
public interface IDeptUser {
    public String  getSysUserId();
    public void setSysUserId(String sysUserId);
    public String getDeptCode();
    public void setDeptCode(String deptCode);
}
