package cn.wwwlike.config;

import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.dto.SysTabDto;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.sys.entity.SysTab;
import cn.wwwlike.sys.entity.SysTabVisit;
import cn.wwwlike.sys.entity.SysUser;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysTabService;
import cn.wwwlike.sys.service.SysTabVisitService;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bi.ConditionUtils;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.bi.Where;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.QueryUtils;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import cn.wwwlike.web.security.core.SecurityUser;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;


/**
 * 视图数据过滤
 */
//@Aspect
//@Component
public class LineTabFilter11 {
    @Autowired
    public SysTabService tabService;
    @Autowired
    public SysTabVisitService tabVisitService;
    @Autowired
    public FormService formService;
    //实现的子类主要有注解： @annotation(org.springframework.web.bind.annotation.PostMapping)
    @Pointcut("execution(* *(..)) && args(req) && @annotation(org.springframework.web.bind.annotation.PostMapping)")
    public void pageMethodPointcut(CustomQuery req) {
    }

    private Class<?> getClassOfJoinPoint(JoinPoint joinPoint) {
        Object targetObject = joinPoint.getTarget(); // 获取目标对象
        return targetObject.getClass();  // 获取目标对象的具体类信息
    }

    // 获取api对应的实体class信息
    private Class<Item> getApiEntityClassGeneric(Class<?> actionClazz){
        Type genericSuperclass = actionClazz.getGenericSuperclass();
        if (genericSuperclass instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) genericSuperclass;
            Class<Item> clazz = (Class) parameterizedType.getActualTypeArguments()[0]; //提取action上泛型实体信息
            if (!Item.class.isAssignableFrom(clazz)) { //dto的api取出entity
                Type superClass = clazz.getGenericSuperclass();
                ParameterizedType dtoParameterizedType = (ParameterizedType) superClass;
                Type[] actualTypeArguments = dtoParameterizedType.getActualTypeArguments();
                Type typeArgument = actualTypeArguments[0]; // 获取
                clazz = (Class<Item>) typeArgument;
            }
            return clazz;
        }
        return null;
    }

    /**
     * 是否存在In的条件查询
     */
    private boolean existInQuery(Conditions conditions){
        if(conditions.getWhere()!=null){
            for(Where where:conditions.getWhere()){
                if(where.getOpt().equals("in")){
                    return true;
                }
            }
        }
        if(conditions.getConditions()!=null){
            for(Conditions _condition:conditions.getConditions()){
                return existInQuery(_condition);
            }
        }
        return false;
    }

    //返回空表示没有查询条件
    private Conditions tabFilter(SysTab tab,Class entityClass,SecurityUser securityUser){
        Conditions conditions=new Conditions();
        conditions.setOrAnd("and");
        conditions.setConditions(new ArrayList<>());
        Conditions queryBuilderCondition=null;
        if(tab.getConditionJson()!=null){
            String tranConditionJson=ConditionUtils.condtionJsonElTran(tab.conditionJson,securityUser.getId(),securityUser.getDeptId(),securityUser.getDeptCode());
            queryBuilderCondition=QueryUtils.conditionJsonToConditions(tranConditionJson);
            conditions.getConditions().add(queryBuilderCondition);
        }
        String dataLevel=tab.getDataLevel();
        //查询本人||根据角色组权限(角色组是查本人)
        if(CT.DATA_LEVEL.USER.equals(dataLevel)
                ||(CT.DATA_LEVEL.BY_GROUP.equals(dataLevel)&&CT.DATA_LEVEL.USER.equals(securityUser.getDefaultLevel()))){
            if(entityClass==SysUser.class){
                //用户表查看本人
                Where userWhere=new Where();
                String [] createId={securityUser.getId()};
                userWhere.setValue(createId);
                userWhere.setOpt(Opt.eq.optName);
                userWhere.setFieldName("id");
                conditions.getWhere().add(userWhere);
            }else if(entityClass==SysDept.class){
                //部门表查看本人部门
                Where deptWhere=new Where();
                String [] deptId={securityUser.getDeptId()};
                deptWhere.setValue(deptId);
                deptWhere.setOpt(Opt.eq.optName);
                deptWhere.setFieldName("id");
                conditions.getWhere().add(deptWhere);
            }else if(ReflectionUtils.getAccessibleFieldByClass(entityClass,"sysUserId")!=null){
                Where userWhere=new Where();
                String [] createId={securityUser.getId()};
                userWhere.setValue(createId);
                userWhere.setOpt(Opt.eq.optName);
                userWhere.setFieldName("sysUserId");
                conditions.getWhere().add(userWhere);
                //其他业务表里有用户ID的数据过滤
                //创建人或者业务人为当前用户
//                queryWrapper.or(qw->qw.eq("sysUserId", securityUser.getId()).eq("createId", securityUser.getId()));
            }else{
                Where userWhere=new Where();
                String [] createId={securityUser.getId()};
                userWhere.setValue(createId);
                userWhere.setOpt(Opt.eq.optName);
                userWhere.setFieldName("createId");
                conditions.getWhere().add(userWhere);
            }
        }else if(CT.DATA_LEVEL.DEPT.equals(dataLevel)
                ||(CT.DATA_LEVEL.BY_GROUP.equals(dataLevel)&&CT.DATA_LEVEL.DEPT.equals(securityUser.getDefaultLevel()))){
            CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(securityUser.getDeptCode()!=null,"当前用户没有关联部门");
            if(entityClass==SysDept.class){
                //查看部门表->本部门以及下级部门
                Where deptWhere=new Where();
                String [] deptCode={securityUser.getDeptCode()};
                deptWhere.setValue(deptCode);
                deptWhere.setOpt(Opt.startsWith.optName);
                deptWhere.setFieldName("code");
                conditions.getWhere().add(deptWhere);
            }else if(ReflectionUtils.getAccessibleFieldByClass(entityClass,"sysDeptId")!=null){
                //其他业务表里有部门ID的数据过滤(如用户表)
                Where deptWhere=new Where();
                String [] deptCode={securityUser.getDeptCode()};
                deptWhere.setEntityName(entityClass.getSimpleName());
                deptWhere.setValue(deptCode);
                deptWhere.setOpt(Opt.startsWith.optName);
                deptWhere.setFieldName("code");
                conditions.getWhere().add(deptWhere);
            }else{
                Where deptWhere=new Where();
                String [] deptCode={securityUser.getDeptCode()};
                deptWhere.setValue(deptCode);
                deptWhere.setOpt(Opt.startsWith.optName);
                deptWhere.setFieldName("createDeptcode");
                conditions.getWhere().add(deptWhere);
            }
        }


        return conditions;

    }

    /**
     * 对所有有post请求的查询ap进行拦截
     * 1. 有tabId
     *  判断当前用户角色visit属性(userId,deptId,groupId)是否关联tab视图；已经关联表示可以查询
     * 2. 无tabId
     * 2.1 有当前模块的视图权限
     * 2.2 无当前模块的视图权限
     */
    @Before("pageMethodPointcut(req)")
    public void beforePageMethod(JoinPoint joinPoint,CustomQuery req) {
        Class<?> actionClazz = getClassOfJoinPoint(joinPoint);
        Class entityClass=getApiEntityClassGeneric(actionClazz);
        //a是in查询则不在进行任何过滤注入 || b系统极的list查询不进行任何过滤
        if((req.getConditions()!=null&&existInQuery(req.getConditions()))||(
                VlifeQuery.class.isAssignableFrom(req.getClass())&& entityClass.getName().indexOf(".sys.")!=-1
                )){
            return ;
        }
        QueryWrapper<SysUser> queryWrapper= (QueryWrapper) req.qw(entityClass);
        SecurityUser securityUser = SecurityConfig.getCurrUser();
        if(entityClass!=null){
            req.setEntityClz(entityClass);
            String tabId=req.getTabId();
            //tabId不为空->主视图查询
            if(tabId!=null){
//                验证当前用户是否有该tabId的访问权限
                boolean visit=securityUser.getSuperUser()?true:tabVisitService.visit(tabId,securityUser.getId(),securityUser.getGroupIds(),securityUser.getDeptId());
                if(visit){
                    SysTab tab=tabService.findOne(tabId);//待->改从缓存取
                    if(tab!=null){
                        String dataLevel=tab.getDataLevel();
                        if (entityClass!=null) {
                            Conditions conditions=tabFilter(tab,entityClass,securityUser);
                            QueryUtils.conditions(queryWrapper,conditions);
                            //查看本人数据(1. 本人创建 2. 本人业务相关(sysUserId是当前用户))
//                            if(CT.DATA_LEVEL.USER.equals(dataLevel)// 根据实体的数据范围查询
//                                    ||(CT.DATA_LEVEL.BY_GROUP.equals(dataLevel)&&CT.DATA_LEVEL.USER.equals(securityUser.getDefaultLevel()))){//根据用户所在角色的数据范围查询(这样做到动态)
//                                if(entityClass==SysUser.class){
//                                    queryWrapper.or(qw->qw.eq("id", securityUser.getId()).eq("createId", securityUser.getId()));
//                                }else if(entityClass==SysDept.class){
//                                    queryWrapper.or(qw->qw.eq("id", securityUser.getId()).eq("id", securityUser.getDeptId()));
//                                }else if(ReflectionUtils.getAccessibleFieldByClass(entityClass,"sysUserId")!=null){
//                                    //创建人或者业务人为当前用户
//                                    queryWrapper.or(qw->qw.eq("sysUserId", securityUser.getId()).eq("createId", securityUser.getId()));
//                                }else{
//                                    queryWrapper.eq("createId", securityUser.getId());
//                                }
//                            }else if(CT.DATA_LEVEL.DEPT.equals(dataLevel)||(CT.DATA_LEVEL.BY_GROUP.equals(dataLevel)&&CT.DATA_LEVEL.DEPT.equals(securityUser.getDefaultLevel()))){
//                                CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(securityUser.getDeptCode()!=null,"当前用户没有关联部门");
//                                if(entityClass==SysDept.class){
//                                    queryWrapper.startsWith("code",securityUser.getDeptCode());
//                                }else if(ReflectionUtils.getAccessibleFieldByClass(entityClass,"sysDeptId")!=null){
//                                    queryWrapper.startsWith("code",securityUser.getDeptCode(),SysDept.class);
//                                }else{
//                                    queryWrapper.startsWith("createDeptcode",securityUser.getDeptCode());
//                                }
//                            }
//                            if(tab.getConditionJson()!=null){
//                                //自定义查询
//                                QueryUtils.conditionGroup(queryWrapper, JSON.parseArray(
//                                        ConditionUtils.condtionJsonElTran(tab.conditionJson,securityUser.getId(),securityUser.getDeptId(),securityUser.getDeptCode()),ConditionGroup.class));
//                            }
//                            req.setQueryWrapper(queryWrapper);
                        }
                    }
                }else{
                    throw new AccessDeniedException("无权限访问");
                }
                //|| entityClass== SysGroup.class
            }else if(entityClass.getName().indexOf(".sys.")==-1|| entityClass==SysUser.class|| entityClass== SysDept.class){
                //请求业务数据(和部门用户角色)
                relationQuery(queryWrapper,entityClass,securityUser.getDeptCode(),securityUser.getId(),securityUser.getGroupIds());
            }
        }
    }






    //非视图的分页列表查询场景的数据过滤
    private void relationQuery(AbstractWrapper qw,Class entityClass,String deptCode,String userId,List<String> groupIds){
        FormDto form= formService.getModelByType(entityClass.getSimpleName());
        List<SysTabDto> tabs =tabService.query(SysTabDto.class, QueryWrapper.of(SysTab.class).eq("entityId",form.getId()));
        List<SysTabDto> userTabs=new ArrayList<>();
        for(SysTabDto tabDto:tabs){
            if(tabDto.getSysTabVisits()!=null){
                for(SysTabVisit visit:tabDto.getSysTabVisits()){
                    if(deptCode.equals(visit.getSysDeptId()) ||userId.equals(visit.getSysUserId())|| (groupIds!=null&&groupIds.contains(visit.getSysGroupId()))){
                        userTabs.add(tabDto);
                    }
                }
            }
        }
        //1. 用户拥有entityClass的视图访问权限,则根据拥有tab的多个视图数据进行合并(or关联)
        if(userTabs.size()>0){
            //如果包含CT.DATA_LEVEL.ALL 表示不需要进行过滤
            if(userTabs.stream().filter(tab->tab.getDataLevel().equals(CT.DATA_LEVEL.ALL)).count()==0){
                List<Conditions> conditions=new ArrayList<>();
                Conditions deptUserCondition=new Conditions();
                deptUserCondition.setOrAnd("or");
                ArrayList<Where> wheres=new ArrayList<>();
                deptUserCondition.setWhere(wheres);
                boolean deptFilter=false;
                boolean userFilter=false;
                //将多组查询进行or关联
                for(SysTabDto tab:userTabs){
                    String dataLevel=tab.getDataLevel();
                    //根据过滤条件
                    if(tab.getConditionJson()!=null){
                        conditions.add(QueryUtils.conditionJsonToConditions(tab.getConditionJson()));
                    }
                    //根据tab视图权限范围
                    if(CT.DATA_LEVEL.DEPT.equals(dataLevel)&&deptFilter==false){
                        if(entityClass==SysDept.class){
                            Where deptWhere=new Where();
                            deptWhere.setFieldName("code");
                            String [] code={deptCode};
                            deptWhere.setValue(code);
                            deptWhere.setOpt(Opt.startsWith.optName);
                            wheres.add(deptWhere);
                        }else if(ReflectionUtils.getAccessibleFieldByClass(entityClass,"sysDeptId")!=null){
                            Where deptWhere=new Where();
                            deptWhere.setEntityName("sysDept");
                            deptWhere.setFieldName("code");
                            String [] code={deptCode};
                            deptWhere.setValue(code);
                            deptWhere.setOpt(Opt.startsWith.optName);
                            wheres.add(deptWhere);
                        }else{
                            Where deptWhere=new Where();
                            deptWhere.setFieldName("createDeptcode");
                            String [] deptId={deptCode};
                            deptWhere.setValue(deptId);
                            deptWhere.setOpt(Opt.startsWith.optName);
                            wheres.add(deptWhere);
                        }
                        deptFilter=true;
                    }else if(dataLevel.equals(CT.DATA_LEVEL.USER)&&userFilter==false){
                        if(entityClass==SysUser.class){
                            Where userWhere=new Where();
                            userWhere.setFieldName("id");
                            String [] createId={userId};
                            userWhere.setValue(createId);
                            userWhere.setOpt(Opt.eq.optName);
                            wheres.add(userWhere);
                        }else if(ReflectionUtils.getAccessibleFieldByClass(entityClass,"sysUserId")!=null){
                            Where userWhere=new Where();
                            userWhere.setFieldName("sysUserId");
                            String [] createId={userId};
                            userWhere.setValue(createId);
                            userWhere.setOpt(Opt.eq.optName);
                            wheres.add(userWhere);
                        }
                        Where userWhere=new Where();
                        userWhere.setFieldName("createId");
                        String [] createId={userId};
                        userWhere.setValue(createId);
                        userWhere.setOpt(Opt.eq.optName);
                        wheres.add(userWhere);
                        userFilter=true;
                    }

                    if(deptFilter||userFilter){
                        conditions.add(deptUserCondition);
                    }
                    if(conditions.size()>0){
                       Conditions joinConditions= QueryUtils.conditionsJoin("or",conditions);
                       QueryUtils.conditions(qw,joinConditions);
                    }
                }
            }
        }else if(entityClass== SysUser.class){
            //没有user权限，查看该模块关联数据时只能查看自己
            qw.eq("id", userId);
        }else if(entityClass== SysDept.class){
            //没有dept权限，查看该模块关联数据时只能查看当前部门以及当前部门的下级部门
            qw.startsWith("code",deptCode);
        }else {
            //业务模块只能看自己的数据
            qw.eq("createId",userId);
        }
    }
}