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
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysDictService extends BaseService<SysDict, SysDictDao> {
    /**
     * 创建所有系统字典项和系统字典值
     * @return
     */
    public List<SysDict> sync(){
        find("sys",true).forEach(dict -> {
            delete(dict.getId());//待优化，做比对
        });
        List<DictVo> sysDict = ReadCt.getSysDict();
        saveByDictVo(sysDict,false,true);//是系统级的不可以维护
        List<DictVo> autiDict = ReadCt.read(AuthDict.class);
        saveByDictVo(autiDict,true,true);//不是系统级的，可以维护
        return findAll();
    }

    /**
     * 根据dictVO进行批量保存
     * @param dicts
     * @param del
     */
    public void saveByDictVo(List<DictVo> dicts,Boolean del,Boolean sys){
        dicts.forEach(dictVo -> {
            SysDict sysDict =new SysDict();
            BeanUtils.copyProperties(dictVo, sysDict);
            sysDict.setDel(del);
            sysDict.setSys(sys);
            save(sysDict);
        });
    }
}
