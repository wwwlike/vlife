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

package cn.wwwlike.auth.config;

import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@Order(2)
public class AdminStartInitializer implements ApplicationRunner {
    @Autowired
    FormService service;
    @Autowired
    SysResourcesService resourcesService;

    @Autowired
    FormService formService;

    @Autowired
    SysDictService dictService;

    @Autowired
    SysDeptService sysDeptService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        //资源同步
        resourcesService.sync();
        //字典同步
        dictService.sync();
        //模型同步(移除的需要物理删除)
        GlobalData.allModels().stream().forEach(m->{
           if(service.syncOne(m.getType())){
              if(m.getFields()!=null){
                   m.getFields().stream().filter(f->((FieldDto)f).getDictCode()!=null).forEach(f->{
                       dictService.createByField(((FieldDto)f).getDictCode(),((FieldDto)f).getTitle());
                   });
              }
           }
        });
        List<Form> dbModels=formService.findAll();//干掉的删除
        dbModels.stream().filter(db->GlobalData.allModels().stream().filter(java->java.getType().equals(db.getType())).count()==0).forEach(m->{
            formService.remove(m.getId());
            //菜单也要物理删除
        });
        //部门初始化
        sysDeptService.initEmptyCodeDepts();
    }
}