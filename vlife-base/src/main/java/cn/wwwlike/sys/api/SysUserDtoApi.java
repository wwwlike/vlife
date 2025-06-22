package cn.wwwlike.sys.api;

import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.sys.dto.SysUserDto;
import cn.wwwlike.sys.entity.SysVar;
import cn.wwwlike.sys.service.SysUserService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.sys.service.SysVarService;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/sysUserDto")
public class SysUserDtoApi extends VLifeApi<SysUserDto, SysUserService> {

    @Autowired
    public SysVarService varService;

    /**
     * 新增
     */
    public SysUserDto create(@RequestBody SysUserDto entity) {
        SysVar var=varService.findAll().get(0);
        entity.setSuperUser(false);
        entity.setPassword(SysUserService.encode(var.getResetPwd()==null?"123456":var.getResetPwd()));
        return super.create(entity);
    }


    /**
     * 删除
     */
    public Long remove(@RequestBody String[] ids) {
        String userId= SecurityConfig.getCurrUser().getId();
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(!Arrays.asList(ids).contains(userId),"不允许删除自己");////每个人检查，数据删除之前先转移
        Arrays.stream(ids).forEach(id->{
            List<Item> items=service.realationData(id);
            CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(items.size()==0,"请先对"+service.findOne(id).getName()+"的数据进行转移");////每个人检查，数据删除之前先转移
        });
        return super.remove(ids);
    }

}
