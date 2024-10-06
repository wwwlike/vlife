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

import cn.vlife.erp.common.ErpDict;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.vlife.dict.DictVo;
import cn.wwwlike.vlife.dict.ReadCt;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.List;

/**
 * 系统启动数据初始化
 * db数据与Java模型数据比对完成数据初始化和更新
 */
@Component
@Order(2)
public class AdminStartInitializer implements ApplicationRunner {
    @Autowired
    FormService service;
    @Autowired
    FormService formService;
    @Autowired
    SysDictService dictService;
    @Autowired
    private Environment env;

    public String getActiveProfile() {
        return env.getProperty("spring.profiles.active");
    }

    private void printErrorMessage() {
        System.out.println("╔════════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                                ║");
        System.out.println("║                please run 'mvn package' command.               ║");
        System.out.println("║                                                                ║");
        System.out.println("╚════════════════════════════════════════════════════════════════╝");
    }


    public void dictSync() {
        List<SysDict> dbs = dictService.findAll();
        List<DictVo> sysDict = ReadCt.getSysDict();
        dictService.saveByDictVo(sysDict, dbs, AuthDict.DICT_TYPE.VLIFE);//是框架级不可以维护
        List<DictVo> autiDict = ReadCt.read(AuthDict.class);
        dictService.saveByDictVo(autiDict, dbs, AuthDict.DICT_TYPE.ADMIN);//平台级字典同步
        List<DictVo> erpDict = ReadCt.read(ErpDict.class);
        dictService.saveByDictVo(erpDict, dbs, AuthDict.DICT_TYPE.FIELD);// erp字典
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
//       if(!getActiveProfile().equals("pro")){//做成开关
        URL url = getClass().getClassLoader().getResource("title.json");
        if (url == null) {
            printErrorMessage();
            System.exit(0); // Exit without starting the application
        }
        //1. 字典同步
        dictSync();
        //2. 模型同步
        GlobalData.allModels().stream().forEach(m -> {
            if (service.syncOne(m.getType())) {
                if (m.getFields() != null) {
                    m.getFields().stream().filter(f -> ((FieldDto) f).getDictCode() != null).forEach(f -> {
                        //通过字段创建字典field级字典
                        dictService.createByField(((FieldDto) f).getDictCode(), ((FieldDto) f).getTitle(), AuthDict.DICT_TYPE.FIELD);
                    });
                }
            }
        });
        List<Form> dbModels = formService.findAll();
        //非自定义(custom)的失效模型信息删除
        dbModels.stream().filter(db ->(db.getCustom()==null||db.getCustom()!=true)&&GlobalData.allModels().stream().filter(java -> java.getType().equals(db.getType())).count() == 0).forEach(m -> {
            formService.remove(m.getId());
        });
    }
//    }
}