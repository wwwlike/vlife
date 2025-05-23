package cn.wwwlike.sys.service;

import cn.wwwlike.sys.dao.SysTabButtonDao;
import cn.wwwlike.sys.entity.*;
import cn.wwwlike.sys.vo.SysTabButtonVo;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SysTabButtonService extends VLifeService<SysTabButton, SysTabButtonDao> {
    //获得crud视图内按钮对应接口与权限的授权映射关系
    public Map<String, Set<String>> curdMenuTabButtonVisits(){
        //所有启用权限(和视图绑定的)按钮信息查询
        List<SysTabButtonVo> all=queryAll(SysTabButtonVo.class);
        Map<String,Set<String>> map=new HashMap<>();// map->key：菜单列表的；value:菜单下所有页签支持的访问角色
        for(SysTabButtonVo buttonVo:all){
            String url=buttonVo.getButton_sysResources().getUrl();
            Set<String> set=map.get(url);
            if(set==null){
                set=new HashSet<>();
                map.put(url,set);
            }
            List<SysTabVisit> buttonVisits=buttonVo.getSysTab_sysTabVisit();
            if(buttonVisits!=null){
                for(SysTabVisit visit:buttonVisits){
                    //授权对象拥有该操作权限按钮接口id
                    if(visit.visitButtonIds!=null&&visit.visitButtonIds.indexOf(buttonVo.getButtonId())!=-1){
                        if(visit.getSysDeptId()!=null){
                            set.add(visit.getSysDeptId());
                        }
                        if(visit.getSysGroupId()!=null) {
                            set.add(visit.getSysGroupId());
                        }
                        if(visit.getSysUserId()!=null) {
                            set.add(visit.getSysUserId());
                        }
                    }
                }
            }
        }
        return map;
    }
}
