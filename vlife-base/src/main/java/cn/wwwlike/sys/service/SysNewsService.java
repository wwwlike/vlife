package cn.wwwlike.sys.service;

import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.dao.SysNewsDao;
import cn.wwwlike.sys.entity.SysNews;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysNewsService extends BaseService<SysNews, SysNewsDao> {


    public QueryWrapper qw(QueryWrapper qw, List<String> groupIds){
        for(String groupId:groupIds){
            qw.like("sysGroupIds","%"+groupId+"%");
        }
        return qw;
    }

    /**
     * 查询有权限且已经发布的通知
     */
    @Override
    public <E extends PageQuery<SysNews>> PageVo<SysNews> findPage(E req) {
        SecurityUser user= SecurityConfig.getCurrUser();
        if(user.getSuperUser()==null||user.getSuperUser()==false){


            req.qw().eq("state",true).or(e->qw(e,user.getGroupIds()).isNull("sysGroupIds"));
        }
        return super.findPage(req);
    }
}
