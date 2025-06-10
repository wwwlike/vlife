package cn.wwwlike.sys.api;

import cn.wwwlike.sys.dto.SysUserDto;
import cn.wwwlike.sys.entity.SysVar;
import cn.wwwlike.sys.service.SysUserService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.sys.service.SysVarService;
import cn.wwwlike.vlife.dict.CT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sysUserDto")
public class SysUserDtoApi extends VLifeApi<SysUserDto, SysUserService> {

    @Autowired
    public SysVarService varService;

    /**
     * 新增
     */
    @PostMapping("/create")
    public SysUserDto create(@RequestBody SysUserDto entity) {
        SysVar var=varService.findAll().get(0);
        entity.setSuperUser(false);
        entity.setState(CT.STATE.NORMAL);
        entity.setPassword(SysUserService.encode(var.getResetPwd()==null?"123456":var.getResetPwd()));
        return super.create(entity);
    }

    @PostMapping("/_tel")
    public String _tel(@RequestBody SysUserDto entity){
        if("123".equals(entity.getTel())){
            return "校验不通过";
        }
        return null;
    }
}
