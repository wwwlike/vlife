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
import cn.wwwlike.sys.dao.SysUserDao;
import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * 单表编码查询
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AdminApplication.class)
public class SigleTableCodeQueryTest {

    private QueryWrapper<SysUser> queryWrapper;
    @Before
    public void qw(){
        queryWrapper=QueryWrapper.of(SysUser.class);
    }

    @Autowired
    SysUserDao dao;

    /**
     * 基础查询
     * where name='xxxx'
     */
    @Test
    public void basic1Test() {
        dao.find(queryWrapper.eq("name","张三"));
    }

    /**
     * 基础查询
     * where username in ['xxa','xxb']
     */
    @Test
    public void basic2Test() {
        Object[] myArray = {"admin","manage"};
        dao.find(queryWrapper.in("username",myArray));
    }

    /**
     * 表达式成立查询
     * where {num>7&&name='xxx'}
     */
    @Test
    public void conditionTest() {
        //当第一个参数值为true时，能执行查询
        int num=6;
        dao.find(QueryWrapper.of(SysUser.class).eq(num>7,"name","张三"));
    }

    /**
     * 逻辑与
     */
    @Test
    public void andTest() {
        dao.find(QueryWrapper.of(SysUser.class).eq("name","张三").gt("age",5));
    }

    /**
     * 逻辑或
     *  where name='xxx' or age >5
     */
    @Test
    public void orTest() {
        dao.find(QueryWrapper.of(SysUser.class).or(qw->qw.eq("name","张三").gt("age",5)));
    }


    /**
     * 括号复杂逻辑查询一
     * where name='111' or (name='1' and username ='2')
     */
    @Test
    public void Test() {
        QueryWrapper<SysUser> queryWrapper=QueryWrapper.of(SysUser.class);
        dao.find(queryWrapper.or(qw ->
                qw.eq("name", "111")
                        .and(ww -> ww.eq("name", "1").eq("username", "2"))));
    }


    @Test
    /**
     * 括号复杂逻辑查询二
     *   where （name='XXX' and tel='xxx'） or (name='xxx' and name ='xx')
     */
    public void Test1() {
        QueryWrapper<SysUser> queryWrapper=QueryWrapper.of(SysUser.class);
        dao.find(queryWrapper.or(qw ->qw.and(ww->ww.eq("name","超级管理员").eq("username","manage"))
                .and(ww->ww.eq("name","超级管理员1").eq("username","manage2")))
             );
    }
}
