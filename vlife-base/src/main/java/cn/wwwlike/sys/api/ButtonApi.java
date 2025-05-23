package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.Button;
import cn.wwwlike.sys.service.ButtonService;
import cn.wwwlike.sys.vo.ButtonVo;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/button")
public class ButtonApi extends VLifeApi<Button, ButtonService> {

    @VMethod(permission = PermissionEnum.noAuth)
    @PostMapping("/list/buttonVo")
    public List<ButtonVo> listButtonVo(@RequestBody  VlifeQuery<Button> req){
        return service.query(ButtonVo.class,req);
    }

}