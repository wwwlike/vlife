package cn.wwwlike.sys.service;

import cn.wwwlike.sys.dao.SysTabVisitDao;
import cn.wwwlike.sys.entity.SysTab;
import cn.wwwlike.sys.entity.SysTabVisit;
import cn.wwwlike.sys.vo.UserDetailVo;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class SysTabVisitService extends VLifeService<SysTabVisit, SysTabVisitDao> {


    //页签开放对象map
    private static Map<String,List<SysTabVisit>> _tabVisitMap;

    //根据用户信息查询它可以访问的页签集合
    public Set<String> tabIds(UserDetailVo user){
        String[] groupIds=user.getSysUserGroup_sysGroup().stream().filter(t->t.getId()!=null).map(DbEntity::getId).collect(Collectors.toList()).toArray(new String[0]);
        List<SysTabVisit> visits= find(QueryWrapper.of(SysTabVisit.class).or(qw->qw.eq("sysUserId",user.getId()).in("sysGroupId",groupIds).eq("sysDeptId",user.getSysDeptId())));
        return visits.stream().map(SysTabVisit::getSysTabId).collect(Collectors.toSet());
    }

    //根据页签查询可以访问到的visit对象
    public boolean visit(String tabId,String sysUserId,List<String> sysGroupIds,String sysDeptId){
        if(_tabVisitMap==null){
            _tabVisitMap=new HashMap<>();
        }
        List<SysTabVisit> visits=_tabVisitMap.get(tabId);
        if(_tabVisitMap.get(tabId)==null){
            visits=find(QueryWrapper.of(SysTabVisit.class).eq("sysTabId",tabId));
            _tabVisitMap.put(tabId,visits);
        }
        for (SysTabVisit visit : visits) {
            if(visit.getSysUserId()!=null&&visit.getSysUserId().equals(sysUserId)){
                return true;
            }else if (visit.getSysGroupId()!=null&&sysGroupIds!=null&& sysGroupIds.contains(visit.getSysGroupId())){
                return true;
            }else if (visit.getSysDeptId()!=null&&visit.getSysDeptId().equals(sysDeptId)){
                return true;
            }
        }
        return false;
    }

    public void clear(String tabId){
        _tabVisitMap.remove(tabId);
    }
    public void clear(){
        _tabVisitMap=null;
    }


}
