
package cn.wwwlike.auth.test;

import cn.wwwlike.AdminApplication;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.dto.FormFieldDto;
import cn.wwwlike.sys.service.FormService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

/**
 * 新增为主的测试
 * @author xiaoyu
 * @date 2022/6/25
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AdminApplication.class)
public class SaveTest {
    @Autowired
    private FormService formService;

    @Test
    public void saveBean5Test(){
        FormDto vo=new FormDto();
        FormFieldDto fieldVo=new FormFieldDto();
        List list=new ArrayList<>();
        list.add(fieldVo);
        vo.setFields(list);
        vo=formService.save(vo);
        System.out.println(vo.getFields().get(0).getFormId());
    }



    @Test
    public void saveBean4Test(){
        FormDto vo=new FormDto();
        FormFieldDto fieldVo=new FormFieldDto();
        List list=new ArrayList<>();
        list.add(fieldVo);
        vo.setFields(list);
        vo=formService.save(vo);
        System.out.println(vo.getFields().get(0).getFormId());
    }

}
