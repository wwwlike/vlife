package cn.wwwlike.sys.api;

import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.sys.dto.SysDeptDto;
import cn.wwwlike.sys.service.SysDeptService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 部门员工接口
 */
@RestController
@RequestMapping("/sysDeptDto")
public class SysDeptDtoApi  extends VLifeApi<SysDeptDto, SysDeptService> {
}
