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

package cn.wwwlike.config;
import cn.vlife.generator.TitleJson;
import cn.vlife.utils.VlifePathUtils;
import cn.wwwlike.sys.common.AuthDict;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.service.FormFieldService;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.DictVo;
import cn.wwwlike.vlife.dict.ReadCt;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import java.net.URL;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * 系统启动数据初始化(在 Spring 应用程序的上下文已完全被加载并准备好后调用)
 * db数据与Java模型数据比对完成数据初始化和更新
 */
@Component
@Order(2)
public class AdminStartInitializer implements ApplicationRunner {
    @Autowired
    FormService formService;
    @Autowired
    SysDictService dictService;
    @Autowired
    FormFieldService formFieldService;


    private void printErrorMessage() {
        System.out.println("╔════════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                                ║");
        System.out.println("║                please run 'mvn package' command.               ║");
        System.out.println("║                                                                ║");
        System.out.println("╚════════════════════════════════════════════════════════════════╝");
    }

    /**
     * 返回定义的类目录字典code
     * @return
     */
    public List<String> dictSync() {
        List<SysDict> dbs = dictService.find("sys",true);
        //读取系统字典(框架\平台\业务字典)
        List<DictVo> javaDicts = ReadCt.read(CT.class,VCT.class, AuthDict.class);
        List<SysDict> lastSysDicts =dictService.saveByDictVo(javaDicts, dbs);//导入后最新
        List dbIds=dbs.stream().map(DbEntity::getId).collect(Collectors.toList());
        List lastIds=lastSysDicts.stream().map(DbEntity::getId).collect(Collectors.toList());
        String[] result =(String[]) dbIds.stream()
                .filter(id -> !lastIds.contains(id))  // 过滤出不在 lastIds 中的 ID
                .toArray(String[]::new);
        //删除失效字典
        try{
        dictService.remove(result);
        }catch (Exception e){
            e.printStackTrace();
        }
        return javaDicts.stream().filter(j->j.getLevel()==1&&j.getCode()!=null).map(javaDict->javaDict.getCode()).collect(Collectors.toList());
    }

    @Autowired
    private Environment env;

    public String getActiveProfile() {
        return env.getProperty("spring.profiles.active");
    }
    /**
     * 零代码启动
     * 进行启动时二次同步(避免模型手动改动不同步)
     * 生产环境启动不进行同步
     */
    public void run(ApplicationArguments args) throws Exception {
        if (!VlifePathUtils.isRunningFromJar()) {
            //1. 系统字典同步
            dictSync();
            //2. 更新模型状态，数据库同步(表删除，字段大小同步)
            List<FormDto> dbModels = formService.query(FormDto.class,QueryWrapper.of(Form.class).ne("state",VCT.MODEL_STATE.CREATING));
            List<String> classNames=GlobalData.allModels().stream().map(BeanDto::getClz).map(Class::getName).collect(Collectors.toList());
            for(FormDto form:dbModels.stream().filter(m->!m.getType().startsWith("act")).collect(Collectors.toList())){
                if(!classNames.contains(form.getTypeClass())){
                    formService.remove(form.getId());
                }else if(form.getState().equals(VCT.MODEL_STATE.WAIT_START)||form.getState().equals(VCT.MODEL_STATE.RESTART)){
                    //物理数据库字段同步，数据库同步;
                    if(form.getItemType().equals("entity")){
                        formFieldService.dbFieldsSync(form);
                    }
                    form.setState(VCT.MODEL_STATE.PUBLISHED);
                    formService.save(form);
                }
            }
        }
    }
}