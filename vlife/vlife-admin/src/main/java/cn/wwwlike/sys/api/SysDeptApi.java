package cn.wwwlike.sys.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.req.SysDeptPageReq;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

/**
 * 部门接口
 */
@RestController
@RequestMapping("/sysDept")
public class SysDeptApi extends VLifeApi<SysDept, SysDeptService> {
  @Autowired
  public SysUserService userService;
  /**
   * 部门分页
   * @return
   */
  @PostMapping("/page")
  public PageVo<SysDept> page(@RequestBody SysDeptPageReq req) {
    return service.findPage(req);
  }
  /**
   * 部门保存
   */
  @PostMapping("/save")
  public SysDept save(@RequestBody SysDept dto) {
   return service.save(dto);
  }
  /**
   * 部门列表
   */
  @PostMapping("/list")
  public List<SysDept> list(@RequestBody PageQuery req) {
    return service.find(req);
  }
  /**
   * 部门详情
   */
  @GetMapping("/detail/{id}")
  public SysDept detail(@PathVariable String id) {
    return service.findOne(id);
  }
  /**
   * 删除部门
   */
  @DeleteMapping("/remove")
  public Long remove(@RequestBody String[] ids) {
    for(String id:ids){
        CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(userService.find("sysDeptId",id).size()==0 ,"不能删除"+service.findOne(id).getName()+"，该部门下还有用户");
    }
    //当前只能删除没有员工的部门
    Long count = 0L;
    for(String id:ids){
      if(userService.find("sysDeptId",id).size()==0){
        count++;
        service.remove(id);
      }
    }
    return count;
  }

}
