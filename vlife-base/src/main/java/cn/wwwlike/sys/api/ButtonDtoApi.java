package cn.wwwlike.sys.api;

import cn.wwwlike.sys.dto.ButtonDto;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.sys.service.ButtonService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 按钮配置dto接口
 */
@RestController
@RequestMapping("/buttonDto")
public class ButtonDtoApi extends VLifeApi<ButtonDto, ButtonService> {
    @Autowired
    public ButtonService buttonService;
    @Autowired
    public SysResourcesService resourcesService;

    @PostMapping("/create")
    public ButtonDto create(@RequestBody ButtonDto button) {
        if(button.getSysBtn()==null){
            button.setSysBtn(false);
        }else if(button.getSysBtn()==true){
            button.setSysMenuId(null);
        }
        if(button.getSysResourcesId()!=null){
            SysResources _resources=resourcesService.findOne(button.getSysResourcesId());
            if(_resources!=null&&button.getModel()==null){
                String _model = "entity".equals( _resources.paramType)  || "dto".equals(_resources.paramType)
                        ? _resources.paramWrapper
                        : null;
                button.setModel(_model);
            }
            if(_resources!=null&&button.getActionType()==null){
                if(_resources.getMethodName().equals("create")||_resources.getMethodName().equals("edit")){
                    button.setActionType(_resources.getMethodName());
                }else{
                    button.setActionType("api");
                }
            }
        }
        return buttonService.save(button,true);
    }

}