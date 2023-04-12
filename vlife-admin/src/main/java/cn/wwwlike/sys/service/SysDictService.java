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

import cn.wwwlike.auth.config.AuthDict;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.dao.SysDictDao;
import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.vlife.dict.DictVo;
import cn.wwwlike.vlife.dict.ReadCt;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SysDictService extends BaseService<SysDict, SysDictDao> {
    /**
     * 创建所有系统字典项和系统字典值
     * sys 表示系统导入则不能删除、修改
     * edit 子类可以新增
     * insert
     * @return
     */
    public List<SysDict> sync(){
//        find("sys",true).forEach(dict -> {
//            delete(dict.getId());//待优化，做比对
//        });
        List<SysDict> dbs=findAll();
        List<DictVo> sysDict = ReadCt.getSysDict();
        saveByDictVo(sysDict,dbs);//是系统级的不可以维护
        List<DictVo> autiDict = ReadCt.read(AuthDict.class);
        saveByDictVo(autiDict,dbs);//导入的，可以维护
        return findAll();
    }

    /**
     * 同步一个模块的字典信息
     * @param javaDicts
     */
    public void saveByDictVo(List<DictVo> javaDicts,List<SysDict> dbDicts){
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

    /**
     * 删除
     */
    public void removeDict(){

    }
}
