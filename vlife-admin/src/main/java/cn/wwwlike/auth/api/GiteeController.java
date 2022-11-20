/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.auth.api;

import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.vlife.gitee.GiteeHttpClient;
import cn.wwwlike.web.security.core.SecurityUser;
import cn.wwwlike.web.security.filter.PehrSecurityUser;
import cn.wwwlike.web.security.filter.TokenUtil;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/gitee")
public class GiteeController {
    @Autowired
    public SysUserService userService;
    /**
     * gitee授权中提供的 appid 和 appkey
     */
    @Value("${gitee.oauth.clientid}")
    public String CLIENTID;
    @Value("${gitee.oauth.clientsecret}")
    public String CLIENTSECRET;
    @Value("${gitee.oauth.callback}")
    public String URL;

    /**
     * 请求授权页面
     */
    @GetMapping(value = "/auth")
    public String qqAuth(HttpSession session) {
        // 用于第三方应用防止CSRF攻击
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        session.setAttribute("state", uuid);
        // Step1：获取Authorization Code
        String url = "https://gitee.com/oauth/authorize?response_type=code" +
                "&client_id=" + CLIENTID +
                "&redirect_uri=" + URLEncoder.encode(URL) +
                "&state=" + uuid +
                "&scope=user_info";
        //因为使用的是thymeleaf模板引擎，所以是无法解析一个网址的，只能重定向
        return url;
    }

    /**
     * 授权回调
     */
    @GetMapping(value = "/callback")
    public String qqCallback(String code) throws Exception {
        // Step2：通过Authorization Code获取Access Token
        String url = "https://gitee.com/oauth/token?grant_type=authorization_code" +
                "&client_id=" + CLIENTID +
                "&client_secret=" + CLIENTSECRET +
                "&code=" + code +
                "&redirect_uri=" + URL;
        JSONObject accessTokenJson = GiteeHttpClient.getAccessToken(url);
        // Step3: 获取用户信息
        url = "https://gitee.com/api/v5/user?access_token=" + accessTokenJson.get("access_token");
        JSONObject jsonObject = GiteeHttpClient.getUserInfo(url);
        /**
         * 获取到用户信息之后，就该写你自己的业务逻辑了
         */
        PehrSecurityUser user=userService.getPerhSecurityUser("manage");
        if(user==null){
            user=userService.createUserFromGitee(jsonObject);
        }else{
        }
        return TokenUtil.createTokenForUser(user, new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));

    }
}

