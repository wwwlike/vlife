package cn.wwwlike.sys.service;
import cn.wwwlike.sys.entity.*;
import cn.wwwlike.sys.dao.SysUserDao;
import cn.wwwlike.sys.vo.UserDetailVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.web.security.core.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
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
    @Autowired
    public SysDeptService deptService;
    @Autowired
    public FormFieldService fieldService;
    @Autowired
    public FormService formService;
    public static String encode(String str)  {
        return  new MessageDigestPasswordEncoder("MD5").encode(str);
    }
    @Autowired
    public ButtonService buttonService;
    @Autowired
    public SysTabVisitService tabVisitService;
    @Autowired
    public SysTabService tabService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<SysUser> users=find("username",username);
        if(users==null||users.size()==0||"".equals(username)){
            throw new UsernameNotFoundException(username+" is not exist");
        }else{
            SysUser user=users.get(0);
            UserDetailVo detailVo=queryOne(UserDetailVo.class,user.getId());
            if((user.getSuperUser()==null|| user.getSuperUser()==false)&&(detailVo.getSysUserGroup_sysGroup()==null||detailVo.getSysUserGroup_sysGroup().size()==0)){
                throw new AccessDeniedException("该用户权限组为空,无法登录");
            }
            String groupFilterLevel=groupService.maxDataLevel(detailVo.getSysUserGroup_sysGroup());
            SecurityUser securityUser = new SecurityUser(user.getId(),
                    user.getUsername(),user.getPassword(),user.getSysDeptId(),detailVo.getCodeDept(),detailVo.getSysUserGroup_sysGroup().stream().map(d->d.getId()).collect(Collectors.toList()), groupFilterLevel
            );
            securityUser.setSuperUser(user.getSuperUser());

            return securityUser;
        }
    }

    public UserDetailVo getUserDetailVo(SecurityUser currUser){
        UserDetailVo vo = queryOne(UserDetailVo.class, currUser.getId());
        if(vo!=null){
            List<SysMenu> allMenus=new ArrayList<>();
            if(vo.getSuperUser()!=null&&vo.getSuperUser()==true){
                allMenus=menuService.findAll();
            }else{
                List<SysMenu> lowcodeMenus=menuService.findMenusUser(vo);
                allMenus= menuService.findAllMenu(lowcodeMenus).stream().collect(Collectors.toMap(SysMenu::getId, Function.identity(), (existing, replacement) -> existing)).values().stream().collect(Collectors.toList());
            }
            vo.setMenus(allMenus); //可访问菜单对象数字
            vo.setDefaultLevel(currUser.getDefaultLevel());
            if(vo.getSuperUser()!=null&&vo.getSuperUser()==true){
                vo.setTabIds(tabService.findAll().stream().map(DbEntity::getId).collect(Collectors.toSet()));
            }else{
                vo.setTabIds(tabVisitService.tabIds(vo));//可访问页签id集合
            }
        }
        return vo;
    }

    //和该用户关联的数据
    public List<Item> realationData(String sourceUserId){
        List<Item> items=new ArrayList<>();
        QueryWrapper<FormField> qw=QueryWrapper.of(FormField.class);
        qw.eq("fieldName","sysUserId");
        List<FormField> fields=fieldService.find(qw);
        for(FormField field:fields){
            Form form=formService.findOne(field.getFormId());
            if(form!=null&&form.getItemType().equals("entity")){
                Class entity=GlobalData.entityDto(form.getEntityType()).getClz();
                QueryWrapper<SysUser> _qw=QueryWrapper.of(entity);
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
        if(targetUserId!=null){
            List<Item> items=realationData(sourceUserId);
             for(Item item:items){
                 ReflectionUtils.setFieldValue(item,"sysUserId",targetUserId);
                 dao.save(item);
             }
        }
    }

    @Override
    public SysUser save(SysUser sysUser) {
        if (sysUser.getPassword() == null && sysUser.getId() == null) {
            sysUser.setPassword(SysUserService.encode("123456"));
        }
        if (sysUser.getState() == null) {
            sysUser.setState("1");
        }
        return super.save(sysUser);
    }
}
