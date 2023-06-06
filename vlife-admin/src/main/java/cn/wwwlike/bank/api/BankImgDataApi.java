package cn.wwwlike.bank.api;

import cn.wwwlike.bank.entity.BankImgData;
import cn.wwwlike.bank.req.BankImgDataPageReq;
import cn.wwwlike.bank.service.BankImgDataService;
import cn.wwwlike.bank.vo.BankImgDataVo;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import java.lang.Long;
import java.lang.String;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 图片信息表接口;
 */
@RestController
@RequestMapping("/bankImgData")
public class BankImgDataApi extends VLifeApi<BankImgData, BankImgDataService> {
  /**
   * 分页查询图片信息表;
   * @param req 图像查询;
   * @return 图片信息表;
   */
  @GetMapping("/page")
  public PageVo<BankImgData> page(BankImgDataPageReq req) {
    return service.findPage(req);
  }


  /**
   * 分页查询图片信息表;
   * @param req 图像查询;
   * @return 图片信息表;
   */
  @GetMapping("/page/bankImgDataVo")
  public PageVo<BankImgDataVo> pageBankImgDataVo(BankImgDataPageReq req) {
    return service.queryPage(BankImgDataVo.class,req);
  }

  /**
   * 保存图片信息表;
   * @param dto 图片信息表;
   * @return 图片信息表;
   */
  @PostMapping("/save")
  public BankImgData save(@RequestBody BankImgData dto) {
    return service.save(dto);
  }

  /**
   * 明细查询图片信息表;
   * @param id 主键id;
   * @return 图片信息表;
   */
  @GetMapping("/detail/{id}")
  public BankImgData detail(@PathVariable String id) {
    return service.findOne(id);
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
