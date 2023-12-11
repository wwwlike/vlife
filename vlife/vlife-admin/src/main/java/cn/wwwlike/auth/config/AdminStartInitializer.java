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
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.sys.service.SysResourcesService;
import cn.wwwlike.vlife.dict.DictVo;
import cn.wwwlike.vlife.dict.ReadCt;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.net.URL;
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

    private void printErrorMessage() {
        System.out.println("╔═══════════════════════════════════════════════════=═════════════╗");
        System.out.println("║          系统检测到没有运行maven install命令                     ║");
        System.out.println("║      运行后会产生title.ijson文件，该文件记录了模型信息            ║");
        System.out.println("║              please run 'mvn install' command.                 ║");
        System.out.println("╚════════════════════════════════════════════════════════════════╝");
    }


    public List<SysDict> dictSync(){
        List<SysDict> dbs=dictService.findAll();
        List<DictVo> sysDict = ReadCt.getSysDict();
        dictService.saveByDictVo(sysDict,dbs);//是系统级的不可以维护
        List<DictVo> autiDict = ReadCt.read(AuthDict.class);
        dictService.saveByDictVo(autiDict,dbs);//导入的，可以维护
        return dictService.findAll();
    }
    @Override
    public void run(ApplicationArguments args) throws Exception {
        //检查是否有title.json文件（是否运行过title.json）
        URL url = getClass().getClassLoader().getResource("title.json");
        if (url == null) {
            printErrorMessage();
            System.exit(0); // Exit without starting the application
        }
        //资源同步
        resourcesService.sync();
        //字典同步
        dictSync();
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