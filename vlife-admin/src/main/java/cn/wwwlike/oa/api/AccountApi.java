package cn.wwwlike.oa.api;

import cn.wwwlike.oa.dto.AccountDto;
import cn.wwwlike.oa.entity.Account;
import cn.wwwlike.oa.req.AccountPageReq;
import cn.wwwlike.oa.req.AccountTestReq;
import cn.wwwlike.oa.req.LoginReq;
import cn.wwwlike.oa.service.AccountService;
import cn.wwwlike.oa.vo.AccountVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 员工用户接口;
 */
@RestController
@RequestMapping("/account")
public class AccountApi extends VLifeApi<Account, AccountService> {
  /**
   * 分页查询类说明;
   * @param req 查询条件;
   * @return 类说明;
   */
  @GetMapping("/page")
  public PageVo<AccountVo> page(AccountPageReq req) {
    return service.queryPage(AccountVo.class,req);
  }

  /**
   * 列表查询员工用户;
   * @param req 类说明;
   * @return 员工用户;
   */
  @GetMapping("/list/test")
  public List<Account> listTest(AccountTestReq req) {
    return service.find(req);
  }

  /**
   * 类说明;
   * @param bean 登录入参;
   * @return 类说明;
   */
  @PostMapping("/login")
  public AccountVo login(@RequestBody LoginReq bean) {
    List<AccountVo> list=service.query(AccountVo.class,bean);
    return list.get(0);
  }

  /**
   * 保存登录元素;
   * @param dto 登录元素;
   * @return 登录元素;
   */
  @PostMapping("/save")
  public AccountDto save(@RequestBody AccountDto dto) {
    return service.save(dto);
  }

  /**
   * 明细查询类说明;
   * @param id 主键id;
   * @return 类说明;
   */
  @GetMapping("/detail/{id}")
  public AccountVo detail(@PathVariable String id) {
    return service.queryOne(AccountVo.class,id);
  }

  /**
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
  @DeleteMapping("/remove/{id}")
  public Long remove(@PathVariable String id) {
    return service.remove(id);
  }
}
