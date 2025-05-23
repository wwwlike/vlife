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
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * 关联表编码查询
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AdminApplication.class)
public class RelationTableCodeQueryTest {

    private QueryWrapper<SysUser> qw;
    @Before
    public void qw(){
        qw=QueryWrapper.of(SysUser.class);
    }

    @Autowired
    SysUserDao dao;

    /*-----------  有直接表关系，用它表（外键表，关联表）字段作为查询条件  -----------------/
    /**
     * 外键表关联查询 （根据部门名称查询用户）
     * from sysUser a left join SysDept b on  a.SysDeptId=b.id where b.name='xxx'
     */
    @Test
    public  void queryByForeignField(){
        dao.find(qw.eq("name","部门名称", SysDept.class));
    }

    /**
     * 关联表做子查询（根据销售订单总金额大于1500查询销售员（用户））
     * 销售主里有外键字段销售员ID(sysUserId)
     * FROM sysUser user WHERE user.id IN ( SELECT sysUserId FROM  orderSale WHERE totalPrice > 1500)
     */
//    @Test
//    public  void queryByRelationField(){
//        dao.find(qw.andSub(OrderSale.class, qw1->qw1.gt("totalPrice",1500)));
//    }


    /*----------- 有非直接表关系（间隔,支持任意层级的间隔），它表字段作为查询条件  -----------------*/

    /**
     * 外键表的关联表字段做子查询（查询指定角色的用户信息）
     *  先 left然后 子查询
     * FROM
     * 	sys_user sysuser0_
     * 	LEFT OUTER JOIN sys_group sysgroup1_ ON ( sysuser0_.sys_group_id = sysgroup1_.id )
     * WHERE
     * 	sysgroup1_.id IN ( SELECT sysrolegro2_.sys_group_id FROM sys_role_group sysrolegro2_ WHERE sysrolegro2_.sys_role_id = 'xxx' )
     */
    @Test
    public  void mediateQueryTest(){
//        dao.find(qw.andSub(SysRoleGroup.class,qw1->qw1.eq("sysRoleId","xxx"),SysGroup.class));
    }

    /**
     * 间接外键表字段查询(最后一个是可变参数，依次传入外键的实体类class)
     * 根据机构名称查询用户信息
     * FROM
     * 	sys_user a
     * 	LEFT  JOIN sys_dept b ON ( a.sys_dept_id = b.id )
     * 	LEFT  JOIN sys_org c ON ( b.sys_org_id = c.id )
     * WHERE
     * 	c.NAME = '机构名称'
     */
//    @Test
//    public  void queryByMediateForeignField(){
//        dao.find(qw.eq("name","机构名称", SysDept.class, SysOrg.class));
//    }

    /**
     * 关联表的关联表字段做查询（有此需求就比较变态，但是vlife能打）
     * 根据销售明细里销售量大于5查询销售员关联的用户信息
     *  销售明细 是 销售主表的关联表， 销售主表是用户表的关联表
     * FROM
     * 	sys_user sysuser0_
     * WHERE
     * 		sysuser0_.id IN (
     * 		SELECT
     * 			ordersale1_.sys_user_id
     * 		FROM
     * 			erp_order_sale ordersale1_
     * 		WHERE
     * 			ordersale1_.id IN (
     * 			SELECT ordersaled2_.order_sale_id FROM erp_order_sale_detail ordersaled2_ WHERE ordersaled2_.total > 5  ))))
     */
//    @Test
//    public  void queryByMediateRelationField(){
//        dao.find(qw.andSub(OrderSale.class,qw->qw.andSub(OrderSaleDetail.class, qw1->qw1.gt("total",5))));
//    }

    /**
     * 4表关联查询
     * 查询角色名称为xxx的所有用户信息
     * 用户关联权限组，权限组和角色是多对多关联；现在通过角色表的字段查询用户信息
     * FROM
     * 	sys_user sysuser0_
     * 	LEFT OUTER JOIN sys_group sysgroup1_ ON ( sysuser0_.sys_group_id = sysgroup1_.id )
     * WHERE
     * 	(
     * 		sysgroup1_.id IN (
     * 		SELECT
     * 			sysrolegro2_.sys_group_id
     * 		FROM
     * 			sys_role_group sysrolegro2_
     * 			LEFT OUTER JOIN sys_role sysrole3_ ON ( sysrolegro2_.sys_role_id = sysrole3_.id )
     * 		WHERE
     * 		sysrole3_.NAME = 'roleName'
     * 	))
     *
     */

    @Test
    public  void btHardQueryTest(){
//        dao.find(qw.andSub(SysRoleGroup.class,qw->qw.eq("name","roleName",SysRole.class),SysGroup.class));
    }


    /** 以上是单个表的字段作为条件，下面的是查询条件来源于多个表的字段 */


    /**
     * 根据部门表和用户表的名称联合查询一个用户
     * from sys_user sysuser0_ left outer join sys_dept sysdept1_ on (sysuser0_.sys_dept_id=sysdept1_.id) where sysdept1_.name='部门名称' and sysuser0_.name='张三'
     */
    @Test
    public  void queryByManyTableField(){
        dao.find(qw.eq("name","部门名称", SysDept.class).eq("name","张三"));
    }


}
