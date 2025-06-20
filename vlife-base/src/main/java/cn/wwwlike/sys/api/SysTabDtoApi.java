package cn.wwwlike.sys.api;

import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.config.VlifeFilterInvocationSecurityMetadataSource;
import cn.wwwlike.sys.dto.SysTabDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.SysMenu;
import cn.wwwlike.sys.entity.SysTab;
import cn.wwwlike.sys.entity.SysTabVisit;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.sys.service.SysTabService;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sysTabDto")
public class SysTabDtoApi extends VLifeApi<SysTabDto, SysTabService> {
    @Autowired
    private SysMenuService menuService;

    @Autowired
    private FormService formService;
    /**
     * 保存DTO
     */
    @PostMapping("/save")
    public SysTabDto save(@RequestBody SysTabDto dto) {
        long count=service.count(QueryWrapper.of(SysTab.class).eq("sysMenuId",dto.getSysMenuId()));

        if(dto.getId()==null){
            dto.setSort((int) count+1);
        }
        //实体模型(非菜单关联的表单模型)
        if(dto.getFormId()==null&&dto.getSysMenuId()!=null){
            SysMenu menu=menuService.findOne(dto.getSysMenuId());
            Form form=formService.findOne(menu.getFormId());
            if(form.getEntityId()!=null){
                dto.setFormId(form.getEntityId());
            }else{
                dto.setFormId(form.getId());
            }
        }

        dto=service.save(dto,true);
        //动态权限置空
        VlifeFilterInvocationSecurityMetadataSource.urlVisits=null;
        //lineTabFilter的缓存清理
        service.clear();
        return dto;
    }

    /**
     * 请求指定菜单用户可以访问的页签
     * 性能不好|页签信息应该导入到
     */
    @Override
    @VMethod(permission = PermissionEnum.noAuth)
    @PostMapping("/list")
    public List<SysTabDto> list(@RequestBody VlifeQuery req) {
        List<SysTabDto> dtos= service.query(SysTabDto.class,req);
        SecurityUser user= SecurityConfig.getCurrUser();
        if(user.getSuperUser()!=null&&user.getSuperUser()==true){
            return dtos;
        }else{
            //普通用户过滤权限组满足的页签
            return  dtos.stream().filter(dto->{
                if(dto.getSysTabVisits()==null||dto.getSysTabVisits().size()==0){
                    return false;
                }
                List<String> groupIds= dto.getSysTabVisits().stream().filter(r->r.getSysGroupId()!=null).map(SysTabVisit::getSysGroupId).collect(Collectors.toList());
                if(groupIds!=null&&groupIds!=null&&groupIds.stream().anyMatch(s -> user.getGroupIds().contains(s))){
                    return true;
                }
                List<String> deptIds= dto.getSysTabVisits().stream().filter(r->r.getSysDeptId()!=null).map(SysTabVisit::getSysDeptId).collect(Collectors.toList());
                if(deptIds!=null&&deptIds.contains(user.getDeptId())){
                    return true;
                }
                List<String> userIds= dto.getSysTabVisits().stream().filter(r->r.getSysUserId()!=null).map(SysTabVisit::getSysUserId).collect(Collectors.toList());
                if(userIds!=null&&userIds.contains(user.getId())){
                    return true;
                }
                return false;
            }).collect(Collectors.toList());
        }
    }
}
