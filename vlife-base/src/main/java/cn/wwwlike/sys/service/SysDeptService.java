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

package cn.wwwlike.sys.service;

import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.dao.SysDeptDao;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SysDeptService extends BaseService<SysDept, SysDeptDao> {

    @Autowired
    public SysUserService userService;

    //通过用户id查询所在部门
    public SysDept getByUserId(String userId){
        QueryWrapper<SysDept> qw= QueryWrapper.of(SysDept.class);
        qw.andSub(SysUser.class,qw2->qw2.eq("id",userId));
        return find(qw).get(0);
    }

    @Override
    public long remove(String... ids) {
//        for(String id:ids){
//            CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(userService.find("sysDeptId",id).size()==0 ,"不能删除"+findOne(id).getName()+"，该部门下还有用户");
//        }
        Long count = 0L;
        for(String id:ids){
            try {
                super.remove(id);
            }catch (Exception e){
                CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(false,e.getMessage());
            }
            count++;
        }
        return count;
    }
}
