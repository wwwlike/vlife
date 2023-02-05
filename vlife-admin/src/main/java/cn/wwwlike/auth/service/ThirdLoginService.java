package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dto.ThirdAccountDto;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.login.GiteeHttpClient;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import static cn.wwwlike.auth.entity.HrConstants.sysUser.email;

/**
 * 第三方(GITEE)登录服务
 */
@Service
public class ThirdLoginService {
    @Autowired
    public SysUserService userService;
    @Value("${vlife.gitee.client_id}")
    public String client_id;
    @Value("${vlife.gitee.redirect_uri}")
    public String redirect_uri;
    @Value("${vlife.gitee.client_secret}")
    public String client_secret;
    @Value("${vlife.email.from}")
    public String emailFrom;
    @Value("${vlife.email.pwd}")
    public String emailPwd;


    public Boolean  openCheckCode(){
        if(StringUtils.isNotEmpty(emailFrom)&&StringUtils.isNotEmpty(emailPwd)) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * 获得第三方账号用户token
     * @param code
     */
    public String thirdToken(String code,String from){
        String gitToken=null;
        try {
            JSONObject jsonObject= GiteeHttpClient.getAccessToken("https://gitee.com/oauth/token?" +
                    "grant_type=authorization_code&code="+code+"&client_id="+client_id+"&redirect_uri="+redirect_uri+"&client_secret="+client_secret);
             gitToken=jsonObject.getString("access_token");
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return gitToken;
    }

    /**
     * 获得第三方用户信息
     */
    public ThirdAccountDto account(String thirdToken, String from){
        ThirdAccountDto account=null;
        try {
            JSONObject userObj=GiteeHttpClient.getUserInfo(thirdToken,"https://gitee.com/api/v5/user");
            account=new ThirdAccountDto();
            account.setId(userObj.getString("id"));
            account.setName(userObj.getString("name"));
            account.setEmail(userObj.getString("email"));
            account.setUsername(userObj.getString("login"));
            account.setThirdToken(thirdToken);
            account.setAvatar(userObj.getString("avatar_url"));
            account.setFrom(from);
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return account;
    }

    /**
     * 获得第三方用户信息
     */
    public String email(String token, String from){
        String email=null;
        try {
            JSONObject userObj=GiteeHttpClient.getArray(token,"https://gitee.com/api/v5/emails").getJSONObject(0);
            email= userObj.getString("email");
        }catch (Exception exception){
            exception.printStackTrace();
        }
        return email;
    }


    public SysUser createUser(ThirdAccountDto accountDto,String groupId,String sysOrgId){
        SysUser user=new SysUser();
        user.setSysOrgId(sysOrgId);
        user.setSysGroupId(groupId);
//        user.setUsername(accountDto.getUsername());
        user.setThirdId(accountDto.getId());
        user.setName(accountDto.getName());
        user.setEmail(accountDto.getEmail());
        user.setSource(accountDto.getFrom());
        user.setThirdToken(accountDto.getThirdToken());
        user.setAvatar(accountDto.getAvatar());
        return user;
    }

    /**
     * star本系统
     * @param thirdToken
     */
    public void  star( String  thirdToken){
        try{
            JSONObject t=new JSONObject();
            JSONObject userObj=GiteeHttpClient.put(thirdToken,"https://gitee.com/api/v5/user/starred/wwwlike/vlife", t);
        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    /* 发送验证信息的邮件 */
    public  String sendMail(String to,String code) {
        if( emailFrom==null|| emailPwd==null){
            return "邮件服务信息服务端未设置，不能发送邮件";
        }
        Properties props = new Properties();
        props.setProperty("mail.smtp.host", "smtp.163.com");
        props.put("mail.smtp.host", "smtp.163.com");
        props.put("mail.smtp.auth", "true");
        Session session = Session.getDefaultInstance(props);
        session.setDebug(true);
        MimeMessage message = new MimeMessage(session);
        try {
            message.setSentDate(new Date());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
            message.setFrom(new InternetAddress(emailFrom));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to)); // 加载收件人地址
            message.setSubject("vlife低代码平台验证码","utf-8");
            Multipart multipart = new MimeMultipart(); // 向multipart对象中添加邮件的各个部分内容，包括文本内容和附件
            BodyPart contentPart = new MimeBodyPart(); // 设置邮件的文本内容
            String str = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body><p style='font-size: 20px;font-weight:bold;'>尊敬的用户，您好！</p>"
                    + "<p style='text-indent:2em; font-size: 20px;'>欢迎您使用vlife低代码平台，您本次的注册码是 "
                    + "<span style='font-size:30px;font-weight:bold;color:red'>" + code + "</span>，10分钟之内有效，请尽快使用！</p>"
                    + "<p style='text-align:right; padding-right: 20px;'"
                    + "<a href='http://www.vlife.cc' style='font-size: 18px'>了解更多请访问vlife使用指南</a></p>"
                    + "<span style='font-size: 18px; float:right; margin-right: 60px;'>" + sdf.format(new Date()) + "</span></body></html>";
            contentPart.setContent(str, "text/html;charset=utf-8");
            multipart.addBodyPart(contentPart);
            message.setContent(multipart);
            message.saveChanges(); // 保存变化
            Transport transport = session.getTransport("smtp"); // 连接服务器的邮箱
            transport.connect("smtp.163.com", emailFrom, emailPwd); // 把邮件发送出去
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
        } catch (MessagingException e) {
            e.printStackTrace();
            return "发送失败："+e.getMessage();
        }
        return null;
    }

}
