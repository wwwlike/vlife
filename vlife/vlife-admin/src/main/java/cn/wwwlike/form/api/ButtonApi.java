package cn.wwwlike.form.api;

import cn.wwwlike.form.entity.Button;
import cn.wwwlike.form.service.ButtonService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/button")
public class ButtonApi extends VLifeApi<Button, ButtonService> {

    @PostMapping("/save")
    public Button save(@RequestBody Button dto) {
        return service.save(dto);
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

}