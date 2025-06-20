package cn.wwwlike.sys.service;
import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.sys.dao.SysTabDao;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.dto.SysTabDto;
import cn.wwwlike.sys.entity.*;
import cn.wwwlike.sys.vo.TabVo;
import cn.wwwlike.sys.vo.UserDetailVo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class SysTabService extends VLifeService<SysTab, SysTabDao> {
    @Autowired
    private SysTabButtonService sysTabButtonService;
    @Autowired
    private SysResourcesService resourcesService;
    @Autowired
    private SysTabVisitService visitService;
    @Autowired
    private  FormService formService;

    private Map<String,List<SysTabDto>> map;

    public void clear(){
        clear(null);
    }

    public void clear(String type){
        if(map!=null){
            if(map.get(type)!=null){
                map.remove(type);
            }else{
                map=null;
            }
        }
    }

    //查询指定用户自定模块可访问的视图
    public List<SysTabDto> findUserModelTabs(SecurityUser user,Class modelClass){
        String modelType=modelClass.getSimpleName();
        List<String> groupIds=user.getGroupIds();
        if(map==null){
            map=new HashMap<>();
        }
        if(map.get(modelType)==null){
            FormDto form= formService.getModelByType(modelClass.getSimpleName());
            map.put(modelType,query(SysTabDto.class, QueryWrapper.of(SysTab.class).eq("formId",form.getId())));
        }
        List<SysTabDto> tabs=map.get(modelType);
        if(tabs!=null&&tabs.size()>0){
            List<SysTabDto> userTabs=new ArrayList<>();
            for(SysTabDto tabDto:tabs){
                if(tabDto.getSysTabVisits()!=null){
                    for(SysTabVisit visit:tabDto.getSysTabVisits()){
                        if(groupIds!=null&&groupIds.contains(visit.getSysGroupId())){
                            userTabs.add(tabDto);
                        }
                    }
                }
            }
            return tabs;
        }
        return null;
    }

    //创建页签
    public SysTab initTab(String sysMenuId, String entityId, List<Button> sysBtns, FormDto listModel){
        QueryWrapper queryWrapper=QueryWrapper.of(SysTab.class).eq("sysMenuId",sysMenuId);
        List<SysTab> defTab=find(queryWrapper);
        if(defTab==null||defTab.size()==0){
            SysTab tab=new SysTab();
            tab.setTitle("全部数据");
            tab.setFormId(entityId);
            tab.setSort(1);
            tab.setDataLevel(CT.DATA_LEVEL.ALL);
            tab.setOrderType(CT.ORDER_TYPE.SYS);
            tab.setViewType("table");
            tab.setSysMenuId(sysMenuId);
            save(tab);
            //初始化页签绑定指定的系统按钮
            sysBtns.forEach(btn->{
                SysTabButton tabButton=new SysTabButton();
                tabButton.setSysTabId(tab.getId());
                tabButton.setButtonId(btn.getId());
                SysResources resources=resourcesService.findOne(btn.getSysResourcesId());
                Boolean multiple =
                        resources.paramWrapper.indexOf("[]") != -1 ||
                        resources.paramWrapper.equals( "List");
                tabButton.setButtonPosition(btn.actionType.equals("create")||multiple?"tableToolbar":"tableLine");
                sysTabButtonService.save(tabButton);
            });
            return tab;
        }
        return defTab.get(0);
    }

    /**
     * 判断用户是否有权限访问该页签
     */
    public boolean visit(SysTabDto tabDto,List<String> userGroupIds){
        List<String> tab_visit_groupIds=tabDto.getSysTabVisits().stream().filter(t->t.getSysGroupId()!=null).map(SysTabVisit::getSysGroupId).collect(Collectors.toList());
        return userGroupIds.stream().anyMatch(t->tab_visit_groupIds.contains(t));
    }



}
