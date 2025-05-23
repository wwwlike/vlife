package cn.wwwlike.sys.api;

import cn.wwwlike.sys.dto.MenuCrudDto;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysMenuService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/menuCrudDto")
public class MenuCrudDtoApi extends VLifeApi<MenuCrudDto, SysMenuService> {

    @Autowired
    FormService formService;

    /**
     * 新增crud页面
     */
    @PostMapping("/create")
    @Override
    public MenuCrudDto create(@RequestBody MenuCrudDto entity) {
        MenuCrudDto dto=super.create(entity);
        formService.createMenuRelation(dto.getId(),entity.getFormId());
        return dto;
    }
}
