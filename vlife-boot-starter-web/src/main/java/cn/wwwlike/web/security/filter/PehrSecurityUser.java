package cn.wwwlike.web.security.filter;

import cn.wwwlike.web.security.core.SecurityUser;
import lombok.Data;

/**
 * 当前需要放置在token里面的对象数据；
 * 暴露和权限相关的一些idcode在里面，避免每次去请求
 */
@Data
public class PehrSecurityUser extends SecurityUser {
//    public String groupId; //权限id 父类有了
    public String orgId;   //用户机构的id
    public String areaId;  //用户地区id
    public String deptId;  // 部门id
    public String codeOrg;// 机构编号
    public String codeDept; //部门编号
    public String codeArea;//地区编号


//    public String orgcode;//所在医疗机构
//    public String orgtype;//机构类型
//    public String usertype;//用户类型
//    public String areacode;//机构所在地区编码

    public PehrSecurityUser(){
    }

    public PehrSecurityUser(String id,String username,String password, String groupId){
        super(id,username,password, groupId);
    }
}
