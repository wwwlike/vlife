package cn.wwwlike.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KickOutService {
    @Autowired
    private SessionRegistry sessionRegistry;
    //所有用户下线
    public void kickOutAllUsers() {
        List<Object> principals = sessionRegistry.getAllPrincipals();
        for (Object principal : principals) {
            List<SessionInformation> sessions = sessionRegistry.getAllSessions(principal, false);
            for (SessionInformation session : sessions) {
                session.expireNow(); // 使会话失效
            }
        }
    }
}