/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.auth.test;

import cn.wwwlike.AdminApplication;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.req.SysResourcesPageReq;
import cn.wwwlike.auth.req.SysUserPageReq;
import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.auth.service.SysUserService;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.req.FormPageReq;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.sys.entity.SysArea;
import cn.wwwlike.sys.req.SysAreaPageReq;
import cn.wwwlike.sys.service.SysAreaService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * 新增为主的测试
 *
 * @author xiaoyu
 * @date 2022/6/25
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AdminApplication.class)
public class FormTest {
    @Autowired
    FormService service;


    @Test
    public void modelTest3() {
        FormPageReq req=new FormPageReq();
               List<FormDto> dtos=service.query(FormDto.class,req);

//      List<FormVo> dtos=service.query(FormVo.class,req);
//        List<Form> dtos=service.find(req);

    }


}
