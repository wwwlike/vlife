package cn.wwwlike.auth.service;

import cn.wwwlike.auth.dao.SysResourcesDao;
import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysResourcesService extends BaseService<SysResources, SysResourcesDao> {

    public List<SysResources> findMenuResources(String[] codes){
        if(codes!=null&&codes.length>0){
            VlifeQuery<SysResources> req= new VlifeQuery(SysResources.class);
            req.qw().eq("onlyMenu",true).in("pcode",codes);
            return find(req);
        }
        return null;
    }
}
