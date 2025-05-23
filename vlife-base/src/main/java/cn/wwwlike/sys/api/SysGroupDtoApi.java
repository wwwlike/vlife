package cn.wwwlike.sys.api;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.sys.dto.SysGroupDto;
import cn.wwwlike.sys.service.SysGroupService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/sysGroupDto")
public class SysGroupDtoApi extends VLifeApi<SysGroupDto, SysGroupService> {
}
