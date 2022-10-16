package cn.wwwlike.auth.service;

import cn.wwwlike.auth.common.Business;
import cn.wwwlike.auth.config.AuthDict;
import cn.wwwlike.auth.dao.SysFilterDao;
import cn.wwwlike.auth.dto.FilterDto;
import cn.wwwlike.auth.dto.GroupFilterDto;
import cn.wwwlike.auth.entity.SysFilter;
import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.auth.entity.SysFilterGroup;
import cn.wwwlike.auth.vo.GroupVo;
import cn.wwwlike.auth.vo.SysFilterDetailVo;
import cn.wwwlike.auth.vo.SysFilterVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysFilterService extends BaseService<SysFilter, SysFilterDao> {
    @Autowired
    SysFilterDetailService detailService;

    @Autowired
    SysGroupService groupService;
    @Autowired
    SysResourcesService resourcesService;

    /**
     * 通过实体名查询对应的所有过滤条件
     * @param entityNames
     * @return
     */
    public List<SysFilterVo> findGroupFilter(String... entityNames){
        List<SysFilterVo> list=dao.query(SysFilterVo.class,QueryWrapper.of(entityClz)
                .in("entityName",entityNames),null);


        return list;
    }

    /**
     * 初始化查询规则
     */
    public void initData(){
        //已经存在的规则
        List<SysFilterDetail> details=detailService.findAll();
        //所有实体
        Map<Class,EntityDto> dtos=GlobalData.getEntityDtos();
        for(Class entity: dtos.keySet()){
            if(isBusEntity(entity)){//业务实体
                EntityDto entityDto=dtos.get(entity);
                //查询是否已存在过滤规则
                List<SysFilterVo> filters=findGroupFilter(entityDto.getType());
                //新增加一个
                if(filters==null||filters.size()==0||filters.get(0).getDetailList()==null
                        ||filters.get(0).getDetailList().size()==0){
                    FilterDto dto=new FilterDto();
                    dto.setEntityName(entityDto.getType());
                    dto.setName(entityDto.getTitle());
                    dto.setBusniess(Business.class.isAssignableFrom(entity)?true:false);
                    dto.setDetails(detailService.getDetails(entityDto));
                    if(dto.getDetails().size()>0){
                        save(dto);
                    }
                }
            }
        }
        // 新拉取的需要分配给group权限组上
    }
//
//    /**
//     * 获得范围对应的规则
//     * @param scope
//     * @return
//     */
//    public List<SysFilterDetail> getScopeRule(String scope){
//
//
//
//
//
//    }

    /**
     * 权限组保存后；会对关联规则进行计算后在保存；
     * 1：新增权限组
     * 所有规则根据
     * 如之前已经有相关设置，则将当前全局的scope与detail的scope进行比对。
     * 全局范围它低，那么之前的设置会按照全局的进行调整；
     */
    public List<SysFilterVo> support(String groupId,boolean gtFilter){
        GroupVo vo=groupService.queryOne(GroupVo.class,groupId);
        Integer scope=vo.getScope();
        List<String> roleids =vo.getSysRoleGroup_sysRoleId();
        Set<String> entityNames=resourcesService.getMenuCode(roleids.toArray(new String[roleids.size()]));
        String[] names=entityNames.toArray(new String[entityNames.size()]);
        List<SysFilterVo> vos=findGroupFilter(names);
        if(gtFilter) {
            //过滤掉规则里比group的scope大的规则，因为他们不参与到设置；
            vos.stream().forEach(vv -> {
                vv.setDetails(vv.getDetails().stream().filter(
                        d -> d.getScope() <= scope).collect(Collectors.toList()));
                vv.setDetailList(vv.getDetailList().stream().filter(
                        d -> d.getScope() <= scope).collect(Collectors.toList()));
            });
        }
        return vos;
    }

    /**
     * 返回权限组最新支持的查询权限计算结果
     * @param dto
     * @param scope 用户设置的权限组整体权限等级
     * @return
     */
    public GroupFilterDto ruleSettings(GroupFilterDto dto,Integer scope){
        List<String> detailIds=new ArrayList<>();//待与group进行绑定的id集合
        //1查询规则初始化一遍
        initData();
        //2权限组支持的规则提取
        List<SysFilterVo> support=support(dto.getId(),false);
        //匹配规则计算(优先级：相等，小于scope的最大值，大于scope的最小值(area,org会用到))
        support.stream().forEach(vo->{
            List<SysFilterDetail> details=vo.getDetails();
            Optional<SysFilterDetail> optional=details.stream().filter(s->s.getScope()==scope).findFirst();
            if(optional.isPresent()){//有相等匹配的scope
                detailIds.add(optional.get().getId());
            }else{ //找到小于它且最大的scope 优先成为设置条件
                List<SysFilterDetail> less=details.stream().filter(s->s.getScope()<scope).sorted(Comparator.comparing(e -> e.getScope())).collect(Collectors.toList());
                if(less.size()>0){
                    detailIds.add(less.get(less.size()-1).getId());
                }else{ //找到大于它且最小的
                    Optional<SysFilterDetail> gt=details.stream().filter(s->s.getScope()>scope).sorted(Comparator.comparing(e -> e.getScope())).findFirst();
                    detailIds.add(gt.get().getId());
                }
            }
        });
        dto.setFilterDetailIds(detailIds);
        return dto;
    }

}
