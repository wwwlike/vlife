package cn.wwwlike.sys.service;

import cn.wwwlike.sys.entity.SysGroup;
import cn.wwwlike.sys.dao.SysGroupDao;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.dict.CT;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysGroupService extends BaseService<SysGroup, SysGroupDao> {

    //指定范围内的最大权限范围
    public String maxDataLevel(List<SysGroup> groups){
        if(groups.stream().filter(t->t.getDefaultLevel().equals(CT.DATA_LEVEL.ALL)).count()>0){
            return CT.DATA_LEVEL.ALL;
        }
        if(groups.stream().filter(t->t.getDefaultLevel().equals(CT.DATA_LEVEL.DEPT)).count()>0){
            return CT.DATA_LEVEL.DEPT;
        }
        return CT.DATA_LEVEL.USER;
    }


}
