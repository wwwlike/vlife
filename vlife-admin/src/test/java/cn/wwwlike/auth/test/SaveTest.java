
package cn.wwwlike.auth.test;

import cn.wwwlike.AdminApplication;
import cn.wwwlike.auth.dto.ResourcesDto;
import cn.wwwlike.auth.dto.RoleDto;
import cn.wwwlike.auth.service.SysResourcesService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * 新增为主的测试
 * @author xiaoyu
 * @date 2022/6/25
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AdminApplication.class)
public class SaveTest {
    @Autowired
    private SysResourcesService resourcesService;

    @Test
    public void saveBean5Test(){
        ResourcesDto res=new ResourcesDto();
        res.setName("resourceName");
        RoleDto role=new RoleDto();
        role.setName("role");
        res.setSysRole(role);
        resourcesService.save(res);
    }

}
