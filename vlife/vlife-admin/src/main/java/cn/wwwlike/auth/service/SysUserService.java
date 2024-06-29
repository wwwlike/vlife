package cn.wwwlike.auth.service;

import cn.wwwlike.auth.entity.SysMenu;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.dao.SysUserDao;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.auth.vo.MenuVo;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.form.service.FormFieldService;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SysUserService extends BaseService<SysUser, SysUserDao> implements UserDetailsService {
    @Autowired
    public SysResourcesService resourcesService;
    @Autowired
    public SysGroupService groupService;
    @Autowired
    public SysMenuService menuService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<SysUser> users=find("username",username);
        if(users==null||users.size()==0){
            throw new UsernameNotFoundException(username+"is not exist");
        }else{
            SysUser user=users.get(0);
            UserDetailVo detailVo=queryOne(UserDetailVo.class,user.getId());
            SecurityUser securityUser = new SecurityUser(user.getId(),
                    user.getUsername(),user.getPassword(),user.getSysGroupId()
            );
            securityUser.setUseDetailVo(detailVo);
            securityUser.setGroupId(user.getSysGroupId());
            return securityUser;
        }
    }
    public SecurityUser getSecurityUser(SysUser user){
        UserDetailVo detailVo=queryOne(UserDetailVo.class,user.getId());
        SecurityUser securityUser = new SecurityUser(user.getId(),
                user.getUsername(),user.getPassword(),user.getSysGroupId()
        );
        securityUser.setUseDetailVo(detailVo);
        securityUser.setGroupId(user.getSysGroupId());
        return securityUser;
    }
    /**
     * 用户在客户端里需要的所有详情信息
     */
    public UserDetailVo getUserDetailVo(SecurityUser currUser){
        UserDetailVo vo = queryOne(UserDetailVo.class, currUser.getId());
        List<String> codes =null;
        List<MenuVo> menus=new ArrayList<>();
        //权限提取
        if(vo.getSuperUser()!=null&&vo.getSuperUser()==true){
            //超级用户所有的菜单和权限和权限组无关了，开发使用
            menus=menuService.queryAll(MenuVo.class);
            QueryWrapper qw=QueryWrapper.of(SysResources.class);
            qw.isNotNull("sysRoleId");
            List<SysResources> resources=resourcesService.find(qw);
            codes=resources.stream().map(f->f.getId()).collect(Collectors.toList());
        }else{
            //权限组用户
            codes = groupService.findGroupResourceCodes(vo.getSysGroupId());
            if(codes!=null){//资源关联的菜单
                menus.addAll(menuService.findAllMenusByResources(resourcesService.find(QueryWrapper.of(SysResources.class).in("code",codes.toArray(new String[codes.size()])))));
            }
            GroupVo groupVo=groupService.queryOne(GroupVo.class,vo.getSysGroupId());
            //角色直接关联的菜单
            menus.addAll(
                    menuService.findAllMenu(
                menuService.query(MenuVo.class,QueryWrapper.of(SysMenu.class).in("sysRoleId",groupVo.getSysRoleGroup_sysRoleId().toArray(new Object[groupVo.getSysRoleGroup_sysRoleId().size()])))));
            //去重
           menus= menus.stream().collect(Collectors.toMap(MenuVo::getId, Function.identity(), (existing, replacement) -> existing)).values().stream().collect(Collectors.toList());
        }
        vo.setMenus(menus);
        vo.setResourceCodes(codes);
        return vo;
    }

    public static String encode(String str)  {
        return  new MessageDigestPasswordEncoder("MD5").encode(str);
    }


    @Autowired
    public FormFieldService fieldService;

    @Autowired
    public FormService formService;

    //和该用户关联的数据
    public List<Item> realationData(String sourceUserId){
        List<Item> items=new ArrayList<>();
        QueryWrapper<FormField> qw=QueryWrapper.of(FormField.class);
        qw.eq("fieldName","sysUserId");
        List<FormField> fields=fieldService.find(qw);
        for(FormField field:fields){
            Form form=formService.findOne(field.getFormId());
            if(form.getItemType().equals("entity")){
                Class entity=GlobalData.entityDto(form.getEntityType()).getClz();
                QueryWrapper _qw=QueryWrapper.of(entity);
                _qw.eq("sysUserId",sourceUserId);
                List<? extends Item> _items=dao.query(entity,_qw,null);
                for(Item item:_items){
                    items.add(item);
                }
            }
        }
        return items;
    }

    //离职数据迁移
    public void dataMove(String sourceUserId,String targetUserId){
        List<Item> items=realationData(sourceUserId);
         for(Item item:items){
             ReflectionUtils.setFieldValue(item,"sysUserId",targetUserId);
             dao.save(item);
         }
    }

}
