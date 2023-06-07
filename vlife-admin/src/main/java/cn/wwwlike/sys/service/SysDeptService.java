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

import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.dao.SysDeptDao;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.VlifeUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysDeptService extends BaseService<SysDept, SysDeptDao> {

    /**
     * 对没有编码的部门进行初始化
     */
    public void initEmptyCodeDepts(){
        int i=1;
        int j=2;
        while (j!=0&&i!=0&& j!=i){
            List<SysDept> depts=find(QueryWrapper.of(SysDept.class).isNull("code"));
            i=depts.size();
            for(SysDept dept:depts){
                if(dept.getParentId()==null||"".equals(dept.getParentId().trim())){
                    long subSize=count(QueryWrapper.of(SysDept.class).isNull("pcode").isNotNull("code"));
                    dept.setCode(VlifeUtils.code("",(subSize+1)+""));
                    save(dept);
                }else{
                    SysDept parent=findOne(dept.getParentId());
                    if(parent.getCode()!=null){
                        dept.setPcode(parent.getCode());
                        long subSize=count(QueryWrapper.of(SysDept.class).eq("pcode",parent.getCode()));
                        dept.setCode(VlifeUtils.code(parent.getCode(),(subSize+1)+""));
                        save(dept);
                    }
                }

            }
            j=  find(QueryWrapper.of(SysDept.class).isNull("code")).size();
        }


    }

}
