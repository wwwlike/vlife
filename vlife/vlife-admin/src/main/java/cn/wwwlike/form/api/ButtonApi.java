package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.Button;
import cn.wwwlike.form.service.ButtonService;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.PageQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/button")
public class ButtonApi extends VLifeApi<Button, ButtonService> {

    @Autowired
    public  SysResourcesService resourcesService;

    @PostMapping("/save")
    public Button save(@RequestBody Button button) {
        if(button.getSysResourcesId()!=null){
            SysResources _resources=resourcesService.findOne(button.getSysResourcesId());
            String _model = "entity".equals( _resources.paramType)  || "dto".equals(_resources.paramType)
                        ? _resources.paramWrapper
                        : null;
            button.setModel(_model);
        }
        QueryWrapper<Button> qw=QueryWrapper.of(Button.class);
        qw.eq("sysMenuId",button.getSysMenuId()).eq("position",button.getPosition());
        if(button.getId()==null){
            button.setSort(service.getSort(button));
        }
        return service.save(button);
    }

    @PostMapping("/page")
    public PageVo<Button> page(@RequestBody PageQuery<Button> req) {
        return service.findPage(req);
    }

    @GetMapping("/detail/{id}")
    public Button detail(@PathVariable String id) {
        return service.findOne(id);
    }

    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }

    @PostMapping("/list")
    public List<Button> list(PageQuery<Button> req){
        return service.find(req);
    }

    //按钮前移
    @PostMapping("/moveUp")
    public Button moveUp(@RequestBody Button button) {
        service.move(button,"up");
         return button;
    }
    //按钮后移
    @PostMapping("/moveDown")
    public Button moveDown(@RequestBody Button dto){
        service.move(dto,"down");
        return dto;
    }
}