package cn.wwwlike.oa.req;

import cn.wwwlike.base.common.RequestTypeEnum;
import cn.wwwlike.oa.entity.Account;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import lombok.Data;


/**
 * 登录入参
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@VClazz(requestType = RequestTypeEnum.POST_ONE)//
public class LoginReq extends VlifeQuery<Account> {
    /**
     * 用户名
     */
    public String name;
    /**
     * 密码
     */
    public String password;

}
