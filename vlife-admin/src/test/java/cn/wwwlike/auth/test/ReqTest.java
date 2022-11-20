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
public class ReqTest {
    @Autowired
    SysUserService service;

    @Autowired
    SysAreaService areaService;


    @Autowired
    SysResourcesService resourcesService;

    @Test
    public void modelTest() {
        SysUserPageReq req = new SysUserPageReq();
        req.setSearch("abcd");
        req.qw().eq("name", "zhangsan")
                .eq(true, "tel", "138");
        List<SysUser> user = service.find(req);
        System.out.println(user.size());
    }

    @Test
    public void modelTest4() {
        SysUserPageReq req = new SysUserPageReq();
        req.qw().or(qw ->
                qw.eq("name", "111")
                        .eq("tel", "123")
                        .and(ww -> ww.eq("name", "1").eq("name", "2")));
        List<SysUser> user = service.find(req);
    }

    /**
     * 间隔外键表的数据查询
     */
    @Test
    public void modelTest1() {
        SysUserPageReq req = new SysUserPageReq();
        List<SysUser> user = service.find(req);
    }

    @Test
    public void modelTest2() {
        SysAreaPageReq req = new SysAreaPageReq();
//        req.setPid("40288a81828ac3bf01828acf55930024");
//        req.qw().eq("code","42000", VSysUser.SysUser_SysOrg_SysArea);
        List<SysArea> user = areaService.find(req);

        System.out.println(user.size());
    }

    @Test
    public void modelTest3() {
        SysResourcesPageReq req = new SysResourcesPageReq();
//        req.getQueryWrapper().eq("name","role1",SysRole.class);

//        req.qw().eq("name", "111",  SysRole.class);
        resourcesService.find(req);
    }


}
