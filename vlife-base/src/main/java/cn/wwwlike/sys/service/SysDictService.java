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

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysDictService extends VLifeService<SysDict, SysDictDao> {

    //查询字典类
    public SysDict findLevel1ByCode(String code){
        List<SysDict> result = find(QueryWrapper.of(SysDict.class).eq("level",1).eq("code",code));
        return result.isEmpty() ? null : result.get(0);
    }

    //查询字典项
    public List<SysDict> listByCode(String code){
        return find(QueryWrapper.of(SysDict.class).eq("code",code).eq("level",2));
    }

    /**
     * 通过字段注解来创建业务字典类目
     * ct,vct类里没有定义的，直接在field上定义dictCode的字段
     */
    public void createByField(String code,String name){
        SysDict levelDict=findLevel1ByCode(code);
        if(levelDict==null){
            SysDict dict=new SysDict();
            dict.setCode(code);
            dict.setTitle(name);
            dict.setSys(false);//业务字典
            dict.setLevel(1);
            save(dict);
        }
    }

    /**
     * 同步一个模块的字典信息
     * 只做新增和修改，全局进行统一删除
     */
    public List<SysDict>  saveByDictVo(List<DictVo> javaDicts,List<SysDict> dbDicts){
        List<SysDict> lastSysDicts=new ArrayList<>();
        javaDicts.forEach(dictVo -> {
            //查询数据库里是否存在这样的字典
            List<SysDict> dicts = dbDicts.stream()
                    .filter(d -> d.getCode().equals(dictVo.getCode()))
                    .filter(d -> {
                        return dictVo.getVal() == null ? d.getVal() == null : dictVo.getVal().equals(d.getVal());
                    }).collect(Collectors.toList());

            SysDict sysDict =null;
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
            lastSysDicts.add(sysDict);
        });
        return lastSysDicts;
    }

    /**
     * 选项值计算
     */
    public String dictVal(String dictCode){
        QueryWrapper<SysDict> qw=QueryWrapper.of(SysDict.class);
        //openFullData 被删除的也计算个数，确保选项值不重复
        qw.openFullData().eq("code",dictCode).eq("level",2);
        return dao.count(qw)+1+"";
    }

    /**
     * 移除失效的字典
     */
    public void clearExpire(List<String> existLevel1Dict){
       List<SysDict> dbDicts = findAll();
        dbDicts.stream().filter(db->!existLevel1Dict.contains(db.getCode())
        ).forEach(db->{
            delete(db.getId());
        });
    }

    @Override
    public SysDict save(SysDict dto) {
        if(dto.getSys()==null){
            dto.setSys(false);
        }
        if(dto.getVal()==null&&2==dto.getLevel()){
            dto.setVal(dictVal(dto.getCode()));
        }
        return super.save(dto);
    }

    //
    private String getVal(String code){
        List<SysDict> dbDicts = find(QueryWrapper.of(SysDict.class).eq("code",code).openFullData());
        if(dbDicts.stream().filter(d->d.level==1).count()==0){
            SysDict level1=new SysDict();
            level1.setLevel(1);
            level1.setSys(false);
            level1.setCode(code);
            level1.setTitle(code);
            save(level1);
        }
        return  String.valueOf(
                dbDicts.stream()
                        .map(SysDict::getVal) // 获取 val 值
                        .filter(val -> {
                            try {
                                Integer.valueOf(val); // 尝试转换为整数
                                return true; // 如果转换成功，返回 true 以保留该值
                            } catch (NumberFormatException e) {
                                return false; // 转换失败，过滤掉该值
                            }
                        })
                        .map(Integer::valueOf) // 转换为 Integer
                        .max(Integer::compareTo) // 找到最大值
                        .map(val -> val + 1) // 加 1
                        .orElse(1)); // 若没有有效的 val，默认返回 1
    }
    /**
     *保存指定类型下的字典，并删除失效字典
     */
    public List<SysDict> batchSave(List<SysDict> dicts){
        List<String> codes=dicts.stream().map(SysDict::getCode).distinct().collect(Collectors.toList());
        List<SysDict> list=new ArrayList<>();
        for(String code:codes){
            List<SysDict> dbDicts = listByCode(code);
            List<SysDict> lastDicts= dicts.stream().filter(d->code.equals(d.getCode())).collect(Collectors.toList());
            //删除失效字典
            List<SysDict> expireDicts = dbDicts.stream().filter(d->!lastDicts.stream().map(SysDict::getId).collect(Collectors.toList()).contains(d.getId())).collect(Collectors.toList());
            if(expireDicts.size()>0) {
                try{
                    remove(expireDicts.stream().map(SysDict::getId).collect(Collectors.toList()).toArray(new String[expireDicts.size()]));
                }catch (Exception ex){
                    ex.printStackTrace();
                }
            }
            lastDicts.forEach(dict->{
                if(dict.getId()==null){
                    dict.setVal(getVal(dict.getCode()));      //查询该code的最大val包含已经删除的
                }
                save(dict);
            });
            list.addAll(lastDicts);
        }
        return list;
    }

}
