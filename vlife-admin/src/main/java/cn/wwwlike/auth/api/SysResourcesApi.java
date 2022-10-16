package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.FileUtil;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 权限资源接口;
 * 1. 实现从前端菜单json读取菜单信息
 * 2. 实现从api里能自动读取所有操作接口信息
 * 3. 在页面能对这些信息进行CRUD操作
 */
@RestController
@RequestMapping("/sysResources")
public class SysResourcesApi extends VLifeApi<SysResources, SysResourcesService> {
  @Autowired
  public SysRoleService roleService;
  /**
   * 保存权限资源;
   * @param dto 权限资源;
   * @return 权限资源;
   */
  @PostMapping("/save")
  public SysResources save(@RequestBody SysResources dto) {
    return service.save(dto);
  }

  /**
   * 明细查询权限资源;
   * @param id 主键id;
   * @return 权限资源;
   */
  @GetMapping("/detail/{id}")
  public SysResources detail(@PathVariable String id) {
    return service.findOne(id);
  }

  /**
   * 角色应该有的资源权限，因该去掉，交给前端过滤
   * @param sysRoleId
   * @return
   */
  @GetMapping("/roleAllResources/{sysRoleId}")
  public List<SysResources> roleAllResources(@PathVariable String sysRoleId) {
    return  service.findRoleAllResources(
            (StringUtils.isEmpty(sysRoleId)
                    ||"undefiend".equals(sysRoleId)
                    ||"null".equals(sysRoleId))?new ArrayList<>():
            service.find("sysRoleId",sysRoleId));
  }

  /**
   * 全量的资源数据
   */
  @GetMapping("/list/all")
  public List<SysResources> listAll() {
    return service.findAll();
  }


  /**
   * 全量的菜单数据
   */
  @GetMapping("/list/menu")
  public List<SysResources> listMenu() {
    return service.find(QueryWrapper.of(SysResources.class).eq("type", VCT.SYSRESOURCES_TYPE.MENU));
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

  @GetMapping("/page")
  public PageVo<SysResources> page(SysResourcesPageReq req){
    return service.findPage(req);
  }

  /**
   * 获得待导入的接口信息
   * @return
   */
  @GetMapping("/page/import")
  public PageVo<SysResources> pageImport(SysResourcesPageReq req) throws IOException {
    PageVo<SysResources> page=new PageVo<>();
    Resource resource = new ClassPathResource("title.json");
    InputStream is = resource.getInputStream();
    String json = FileUtil.getFileContent(is);
    Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
    List<ClzTag> allTag = gson.fromJson(json, new TypeToken<List<ClzTag>>(){}.getType());
    List list= service.imports(allTag,req.getSearch());
    //手工分页
    int pageSize=req.getPager().getSize();
    page.setTotal(Long.parseLong(list.size()+""));
    page.setSize(pageSize);
    page.setTotalPage((page.getTotal()/pageSize+new Long(page.getTotal()%pageSize==0?0:1)));
    page.setResult(list.subList((req.getPager().getPage()-1)*pageSize,
            req.getPager().getPage()*pageSize>page.getTotal()?  Integer.parseInt(page.getTotal()+"") :req.getPager().getPage()*pageSize));
    page.setPage(req.getPager().getPage());
    return page;
  }

  /**
   * 数据导入
   * @return
   */
  @PostMapping("/save/import")
  public SysResources saveImport(@RequestBody SysResources dto) throws IOException {
    PageVo<SysResources> page=new PageVo<>();
    Resource resource = new ClassPathResource("title.json");
    InputStream is = resource.getInputStream();
    String json = FileUtil.getFileContent(is);
    Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
    List<ClzTag> allTag = gson.fromJson(json, new TypeToken<List<ClzTag>>(){}.getType());
    List<SysResources> list= service.imports(allTag,dto.getResourcesCode());
    SysResources data=list.stream().filter(l->l.getResourcesCode().equals(dto.getResourcesCode())).findFirst().get();
    data.setId(null);
    return service.save(data);
  }
}
