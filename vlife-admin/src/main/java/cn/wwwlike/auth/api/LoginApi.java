package cn.wwwlike.auth.api;

import cn.wwwlike.auth.dto.ThirdAccountDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.auth.service.ThirdLoginService;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import cn.wwwlike.web.security.filter.TokenUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/git")
public class LoginApi {

    @Autowired
    public SysUserService service;

    @Autowired
    public ThirdLoginService thirdLoginService;

    @Autowired
    public SysUserService userService;
    @Value("${vlife.gitee.client_id}")
    public String client_id;
    @Value("${vlife.gitee.redirect_uri}")
    public String redirect_uri;
    @Value("${vlife.gitee.client_secret}")
    public String client_secret;

    @GetMapping("/giteeUrl")
    public String  giteeUrl(){
        if(StringUtils.isNotEmpty(client_id)&&StringUtils.isNotEmpty(redirect_uri)&&StringUtils.isNotEmpty(client_secret)) {
            return "https://gitee.com/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=code";
        }else{
           return null;
        }
    }

    /**
     * 邮箱校验
     * @return
     */
    @GetMapping("/openCheckCode")
    public Boolean  openCheckCode(){
      return thirdLoginService.openCheckCode();
    }

    @GetMapping("/token/{from}")
    public ThirdAccountDto  token(@PathVariable String from, String code) throws Exception {
        QueryWrapper userQueryWrapper = QueryWrapper.of(SysUser.class);
        //获得token`

       String gitToken=thirdLoginService.thirdToken(code,from);
       CommonResponseEnum.CANOT_CONTINUE.assertNotNull(gitToken,"授权失败");
       //第三方用户名
        ThirdAccountDto account=thirdLoginService.account(gitToken,from);
        CommonResponseEnum.CANOT_CONTINUE.assertNotNull(account,"token请求失败");
       //判断账号是否存在
        userQueryWrapper.eq("thirdId",account.getId());
        List<SysUser> users=service.find(userQueryWrapper);
        SysUser user=null;
        if(users==null||users.size()==0){  //创建用户
            if(account.getEmail()==null){
                account.setEmail(thirdLoginService.email(gitToken,from));
            }
           user=thirdLoginService.createUser(account,"40288a8183360b430183361553530037","4028b881857568ed01857590c3c40053");
            service.save(user);
        }else{
            user=users.get(0);
        }
        //star 需要的系统
        thirdLoginService.star(gitToken);
       // 返回本系统的token
       String token= TokenUtil.createTokenForUser(service.getPerhSecurityUser(user));
       account.setToken(token);
       return account;
    }

}
