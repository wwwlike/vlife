package cn.wwwlike.oa.service;

import cn.wwwlike.auth.config.AuthDict;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.oa.dao.DictDao;
import cn.wwwlike.oa.entity.Dict;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.DictVo;
import cn.wwwlike.vlife.dict.ReadCt;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.inject.Named;
import java.lang.reflect.Field;
import java.util.List;

@Service
public class DictService extends BaseService<Dict, DictDao> {
    /**
     * 创建所有系统字典项和系统字典值
     * @return
     */
    public List<Dict> sync(){
        findAll().forEach(dict -> {
            delete(dict.getId());//待优化，做比对
        });
        List<DictVo> sysDict = ReadCt.getSysDict();
        saveByDictVo(sysDict,false,true);//是系统级的不可以维护
        List<DictVo> autiDict = ReadCt.read(AuthDict.class);
        saveByDictVo(autiDict,true,false);//不是系统级的，可以维护
        return findAll();
    }

    /**
     * 根据dictVO进行批量保存
     * @param dicts
     * @param del
     */
    public void saveByDictVo(List<DictVo> dicts,Boolean del,Boolean sys){
        dicts.forEach(dictVo -> {
            Dict dict=new Dict();
            BeanUtils.copyProperties(dictVo,dict);
            dict.setDel(del);
            dict.setSys(sys);
            save(dict);
        });
    }
}
