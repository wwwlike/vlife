package cn.wwwlike.auth.service;
import cn.wwwlike.auth.common.Business;
import cn.wwwlike.auth.config.AuthDict;
import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dao.SysFilterDetailDao;
import cn.wwwlike.auth.entity.SysFilter;
import cn.wwwlike.auth.entity.SysFilterDetail;
import cn.wwwlike.auth.entity.SysFilterGroup;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.vo.SysFilterVo;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.entity.SysArea;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.entity.SysOrg;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.ReadCt;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.web.security.filter.PehrSecurityUser;
import lombok.Data;
import org.apache.commons.lang3.AnnotationUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SysFilterDetailService extends BaseService<SysFilterDetail, SysFilterDetailDao> {
    //sysUserId 与业务表字段对应的语句
    public static Map<String,FilterInfo> map=new HashMap<>();
    @Data
    public class FilterInfo{
        public String securityId;
        public String securityCode;
        public Class<?extends Item> dataClz;//数据来源
        public String fkField;
        public Integer likeScope;// like查询字段标志
        public Integer  eqScope;// eq查询时的标志
        public boolean busniess;// 只服务于busniess表

        public FilterInfo(String fkField, String securityId, String securityCode, Class dataClz, Integer likeScope, Integer eqScope,boolean busniess) {
            this.fkField = fkField;
            this.securityId = securityId;
            this.securityCode=securityCode;
            this.dataClz = dataClz;
            this.likeScope = likeScope;
            this.eqScope = eqScope;
            this.busniess=busniess;
        }
    }
    {
        // sysAreaId 表里的外键字段；
        // areaId-> security里对应的字段
        // codeArea->security里进行下级查询的code
        // SysArea.class id，code来源表
        // 6-> scope 查询级别（6，4，2都是查询下级）
        map.put("sysAreaId",new FilterInfo("sysAreaId","areaId","codeArea",SysArea.class, AuthDict.GROUP_SCOPE.AREAS, AuthDict.GROUP_SCOPE.AREA,false));
        map.put("sysOrgId",new FilterInfo("sysOrgId","orgId","codeOrg",SysOrg.class, AuthDict.GROUP_SCOPE.ORGS, AuthDict.GROUP_SCOPE.ORG,false));
        map.put("sysDeptId",new FilterInfo("sysDeptId","deptId","codeDept",SysDept.class, AuthDict.GROUP_SCOPE.DEPTS, AuthDict.GROUP_SCOPE.DEPT,false));
        map.put("createId",new FilterInfo("createId","id",null,SysUser.class,  null,AuthDict.GROUP_SCOPE.SELF,true));
    }


    /**
     * 返回实体支持的过滤方式
     * @param dto 需要进行行级数据过滤的模型信息
     */
    public List<SysFilterDetail> getDetails(EntityDto dto){
        List<SysFilterDetail> details=new ArrayList<>();
        for(String mapKey:map.keySet()){
            FilterInfo filterInfo=map.get(mapKey);
            //规则全适用(busniess),或者只适用于
                Class<? extends Item> item=filterInfo.getDataClz();
                Integer scope=  filterInfo.getEqScope();
                Optional<FieldDto> optional=dto.find(mapKey);

                if(optional.isPresent()&&//有外键字段
                        (filterInfo.busniess==false||//规则适用于全部表或者 规则适用于业务表，且当前是业务表
                        (filterInfo.busniess&& Business.class.isAssignableFrom(dto.getClz())))){
                  details.add(getDetails(mapKey,scope,false,false));
                  if(ITree.class.isAssignableFrom(item)&&filterInfo.getLikeScope()!=null)
                      details.add(getDetails(mapKey,filterInfo.getLikeScope(),true,false));
                }else if(item==dto.getClz()){ //表一致
                    details.add(getDetails(mapKey,scope,false,true));
                    if(ITree.class.isAssignableFrom(item)) {
                        details.add(getDetails(mapKey,filterInfo.getLikeScope(),true,true));
                  }
                }

        }
        return details;
    }

    /**
     * 生成查询配置的明细
     * @param scope
     * @return
     */
    private SysFilterDetail getDetails(String mapKey,Integer scope,boolean querySub,boolean querySelf){
        SysFilterDetail detail=new SysFilterDetail();
        detail.setScope(scope);
        detail.setQuerySub(querySub);
        detail.setFieldKey(mapKey);
        detail.setQuerySelf(querySelf);
        detail.setName(ReadCt.getLabel(AuthDict.class,AuthDict.GROUP_SCOPE.class,scope));
        return detail;
    }


    /**
     * 权限组单个模块行数据过滤信息MAP(行权限编辑后，该map需要重新new)
     * key=模块+权限组ID
     */
    protected static Map<String,SysFilterDetail> groupFilterMap=new HashMap<>();

    public void filterClear(){
        groupFilterMap=new HashMap<>();
    }
    /**
     * 得登录用户指定业务模块的的过滤规则,并存入缓存里
     * @param clz
     * @return
     */
    public SysFilterDetail filterRule(Class<?extends Item> clz,String groupId) {
        if (!isBusEntity(clz)) {
            return null;
        } else {
            String entityName = StringUtils.uncapitalize(clz.getSimpleName());
            String groupFilterKey = entityName + groupId;
            List<SysFilterDetail> rules = null;
            if (groupFilterMap.get(groupFilterKey) == null) {
                QueryWrapper<SysFilterDetail> qw = QueryWrapper.of(SysFilterDetail.class)
                        .eq("entityName", entityName, SysFilter.class).andSub(
                                SysFilterGroup.class,
                                subQw -> subQw.eq("sysGroupId", groupId));
                rules = filterDetailDao.find(qw);
                if(rules.size()==0){
                    return null;
                }
                groupFilterMap.put(groupFilterKey, rules.get(0));
            }
            return groupFilterMap.get(groupFilterKey);
        }
    }
}

