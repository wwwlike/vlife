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
import cn.wwwlike.sys.dao.SysDictDao;
import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.DictVo;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SysDictService extends VLifeService<SysDict, SysDictDao> {

    public SysDict findLevel1ByCode(String code){
        List<SysDict> result = find(QueryWrapper.of(SysDict.class).eq("level",1).eq("code",code));
        return result.isEmpty() ? null : result.get(0);
    }


    /**
     * 创建业务型在字段上单独注解的业务型字典
     */
    public void createByField(String code,String name,String type){
        SysDict levelDict=findLevel1ByCode(code);
        if(levelDict==null){
            SysDict dict=new SysDict();
            dict.setCode(code);
            dict.setTitle(name);
            dict.setSys(true);
            dict.setLevel(1);
            dict.setType(type);
            save(dict);
        }else if (!name.equals(levelDict.getTitle())){
            levelDict.setTitle(name);
            save(levelDict);
        }
    }
    /**
     * 同步一个模块的字典信息
     * @param javaDicts
     */
    public void saveByDictVo(List<DictVo> javaDicts,List<SysDict> dbDicts,String type){
        //1 原先没有的新增，title改变了的进行修订
        javaDicts.forEach(dictVo -> {
            SysDict sysDict =null;
            QueryWrapper qw=null;
            if(dictVo.getVal()==null){
                qw=QueryWrapper.of(SysDict.class).isNull("val").eq("code",dictVo.getCode());
            }else{
                qw=QueryWrapper.of(SysDict.class).eq("val",dictVo.getVal()).eq("code",dictVo.getCode());
            }
            List<SysDict> dicts=find(qw);
            if(dicts==null||dicts.size()==0){
                sysDict =new SysDict();
                BeanUtils.copyProperties(dictVo, sysDict);
                sysDict.setSys(true);
                sysDict.setType(type);
                sysDict.setCreateDate(new Date());
                save(sysDict);
            }else {
                sysDict = dicts.get(0);
                if (!sysDict.getTitle().equals(dictVo.getTitle())) {
                    sysDict.setTitle(dictVo.getTitle());
                    sysDict.setModifyDate(new Date());
                    save(sysDict);
                }
            }
        });
    }

    public String dictVal(String dictCode){
        QueryWrapper<SysDict> qw=QueryWrapper.of(SysDict.class);
        qw.openFullData().eq("code",dictCode).eq("level",2);
        return dao.count(qw)+1+"";
    }
}
