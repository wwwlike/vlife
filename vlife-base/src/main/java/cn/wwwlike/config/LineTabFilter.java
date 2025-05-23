package cn.wwwlike.config;

import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.dto.SysTabDto;
import cn.wwwlike.sys.entity.*;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysTabService;
import cn.wwwlike.sys.service.SysTabVisitService;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bi.ConditionGroup;
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
import com.alibaba.fastjson.JSON;
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
import java.util.stream.Collectors;


/**
 * 根据用户数据查询过滤
 */
@Aspect
@Component
public class LineTabFilter {
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
    private Conditions tabFilter(SysTabDto tab,Class entityClass,SecurityUser securityUser){
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
                //(sysUserId=? or createId=?)
                Conditions _userConditions=new Conditions();
                _userConditions.setOrAnd("or");
                _userConditions.setWhere(new ArrayList<>());
                String [] createId={securityUser.getId()};
                Where userWhere1=new Where();
                userWhere1.setValue(createId);
                userWhere1.setOpt(Opt.eq.optName);
                userWhere1.setFieldName("sysUserId");
                _userConditions.getWhere().add(userWhere1);
                Where userWhere2=new Where();
                userWhere2.setValue(createId);
                userWhere2.setOpt(Opt.eq.optName);
                userWhere2.setFieldName("createId");
                _userConditions.getWhere().add(userWhere2);
                conditions.getConditions().add(_userConditions);
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
                deptWhere.setEntityName(SysDept.class.getSimpleName());
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
     * 对所有post的查询进行拦截,增加必要的条件数据
     */
    @Before("pageMethodPointcut(req)")
    public void beforePageMethod(JoinPoint joinPoint,CustomQuery req) {
        Class<?> actionClazz = getClassOfJoinPoint(joinPoint);
        Class entityClass=getApiEntityClassGeneric(actionClazz);
        //a是in查询则不在进行任何过滤注入 || b系统极的list查询不进行任何过滤
        if((req.getConditions()!=null&&existInQuery(req.getConditions()))||(
                VlifeQuery.class.isAssignableFrom(req.getClass())&& entityClass.getName().indexOf(".sys.")!=-1
                )&&entityClass!=SysUser.class&&entityClass!= SysDept.class){
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
                boolean visit=securityUser.getSuperUser()!=null&&securityUser.getSuperUser()==true?true:tabVisitService.visit(tabId,securityUser.getId(),securityUser.getGroupIds(),securityUser.getDeptId());
                if(visit){
                    SysTabDto tab=tabService.queryOne(SysTabDto.class,tabId);//待->改从缓存取
                    if(tab!=null){
                        if (entityClass!=null) {
                            Conditions conditions=tabFilter(tab,entityClass,securityUser);
                            if((conditions.getWhere()!=null&&conditions.getWhere().size()>0)|| (conditions.getConditions()!=null&&conditions.getConditions().size()>0)) {
                                QueryUtils.conditions(queryWrapper, conditions);
                            }
                        }
                    }
                }else{
                    throw new AccessDeniedException("无权限访问");
                }
                //|| entityClass== SysGroup.class
            }else if(entityClass.getName().indexOf(".sys.")==-1|| entityClass==SysUser.class|| entityClass== SysDept.class){
                //请求业务数据(和部门用户角色)
                relationQuery(queryWrapper,entityClass,securityUser);
            }
        }
    }

    //非视图的分页列表查询场景的数据过滤
    private void relationQuery(AbstractWrapper qw,Class entityClass, SecurityUser securityUser){
        String userId=securityUser.getId();
        String deptCode=securityUser.getDeptCode();
        List<SysTabDto> userTabs=tabService.findUserModelTabs(securityUser,entityClass);
        //1. 用户拥有entityClass的视图访问权限,则根据拥有tab的多个视图数据进行合并(or关联)
        if(userTabs!=null&&userTabs.size()>0){
            List<Conditions> conditions=new ArrayList<>();
            for(SysTabDto tab:userTabs){
                conditions.add(tabFilter(tab,entityClass,securityUser));
            }
            if(conditions.size()>0){
                if(conditions.size()==1){
                    QueryUtils.conditions(qw, conditions.get(0));
                }else{
                    Conditions joinCondition=QueryUtils.conditionsJoin("or",conditions);
                    QueryUtils.conditions(qw, joinCondition);
                }
            }
        }
        //2.用户未有被授权访问该模块，则根据以下规则过滤数据
        else if(entityClass== SysUser.class){
            //2.1 查询用户表则只能查看自己
            qw.eq("id", userId);
        }else if(entityClass== SysDept.class){
            //2.2 查询部门则只能查看本部门以及下级部门
            qw.startsWith("code",deptCode);
        }else {
            //2.3 查询其他业务模块只能看自己创建的数据
            qw.eq("createId",userId);
        }
    }
}