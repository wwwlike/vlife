package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysResources;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysRoleService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
     *
     * @param dto 权限资源;
     * @return 权限资源;
     */
    @PostMapping("/save")
    public SysResources save(@RequestBody SysResources dto) {
        return service.save(dto);
    }

    /**
     * 明细查询权限资源;
     *
     * @param id 主键id;
     * @return 权限资源;
     */
    @GetMapping("/detail/{id}")
    public SysResources detail(@PathVariable String id) {
        return service.findOne(id);
    }


    /**
     * 全量的资源数据/指定菜单的资源
     */
    @GetMapping("/list/all")
    public List<SysResources> listAll(String menuCode) {
        if (menuCode == null)
            return service.findAll();
        else
            return service.find(QueryWrapper.of(SysResources.class).eq("menuCode", menuCode));
    }

    /**
     * 全量的菜单数据
     */
    @GetMapping("/list/menu")
    public List<SysResources> listMenu() {
        return service.find(QueryWrapper.of(SysResources.class).eq("resourcesType", VCT.SYSRESOURCES_TYPE.MENU));
    }

    /**
     * 逻辑删除;
     *
     * @param id 主键id;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }

    @GetMapping("/page")
    public PageVo<SysResources> page(SysResourcesPageReq req) {
        return service.findPage(req);
    }

    /**
     * 获得待导入的所有接口和菜单的信息
     * @return
     */
    @GetMapping("/page/import")
    public PageVo<SysResources> pageImport(SysResourcesPageReq req) throws IOException {
        PageVo<SysResources> page = new PageVo<>();
        List list = service.imports( req.getSearch());
        //手工分页
        int pageSize = req.getPager().getSize();
        page.setTotal(Long.parseLong(list.size() + ""));
        page.setSize(pageSize);
        page.setTotalPage((page.getTotal() / pageSize + new Long(page.getTotal() % pageSize == 0 ? 0 : 1)));
        page.setResult(list.subList((req.getPager().getPage() - 1) * pageSize,
                req.getPager().getPage() * pageSize > page.getTotal() ? Integer.parseInt(page.getTotal() + "") : req.getPager().getPage() * pageSize));
        page.setPage(req.getPager().getPage());
        return page;
    }


    /**
     * 单个模块的所有接口&菜单（数据库+title结合)
     * @param menuCode
     * @return
     * @throws IOException
     */
    @GetMapping("/menuResources/{menuCode}")
    public List<SysResources> menuResources(@PathVariable String menuCode) throws IOException {
        //数据库
       List<SysResources> rs= service.find("code",menuCode);
       List list = service.imports(menuCode);
       if(rs!=null&&rs.size()>0){
           rs.addAll(service.find("code",menuCode));
           rs.addAll(list);
           return rs;
       }
       return list;
    }

    /**
     * 数据导入
     *
     * @return
     */
    @PostMapping("/save/import")
    public SysResources saveImport(@RequestBody SysResources dto) throws IOException {
        List<SysResources> list = service.imports( dto.getCode());
        SysResources data = list.stream().filter(l -> l.getCode().equals(dto.getCode())).findFirst().get();
        data.setId(null);
        return service.save(data);
    }

    /**
     * 一次批量保存资源
     * @return
     */
    @PostMapping("/save/resources")
    public Integer saveResources(@RequestBody List<SysResources> resources) {
        for(SysResources bean:resources){
            service.save(bean);
        }
        return  resources.size();
    }
}
