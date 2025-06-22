package cn.wwwlike.sys.api;

import cn.wwwlike.sys.service.SysUserService;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 部门接口
 */
@RestController
@RequestMapping("/sysDept")
public class SysDeptApi extends VLifeApi<SysDept, SysDeptService> {
  @Autowired
  public SysUserService userService;

  public Long remove(@RequestBody String[] ids) {
    for(String id:ids){
      CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(userService.find("sysDeptId",id).size()==0 ,"不能删除"+service.findOne(id).getName()+"，该部门下还有用户");
    }
    return super.remove(ids);
  }

}
