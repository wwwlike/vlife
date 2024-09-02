package cn.wwwlike.auth.config;

import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.base.IFilter;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.web.security.core.SecurityUser;
import com.alibaba.fastjson.JSONObject;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;


/**
 * 行级数据查询拦截器
 */
@Aspect
@Component
public class LineDataFilter {
    @Autowired
    private FormService formService;

    @Autowired
    public SysGroupService sysGroupService;

    @Pointcut("(execution(* cn.wwwlike..*(..)) || execution(* cn.vlife..*(..))) && args(req)&& @annotation(org.springframework.web.bind.annotation.PostMapping)")
    public void pageMethodPointcut(CustomQuery req) {
    }

    private Class<?> getClassOfJoinPoint(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        try {
            return Class.forName(className);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }

    //对所有分页方法 Page且入参是 PageQeuery类型的方法进行拦截
    @Before("pageMethodPointcut(req)")
    public void beforePageMethod(JoinPoint joinPoint,CustomQuery req) {
        Class<?> actionClazz = getClassOfJoinPoint(joinPoint);
        SecurityUser securityUser = SecurityConfig.getCurrUser();
        if(securityUser!=null){
        JSONObject userObj=((JSONObject) securityUser.getUseDetailVo());
        String groupFilterType=  userObj.getString("groupFilterType");
        if(!groupFilterType.equals("all")){
        Type genericSuperclass = actionClazz.getGenericSuperclass();
        if (genericSuperclass instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) genericSuperclass;
            Class<Item> clazz = (Class<Item>) parameterizedType.getActualTypeArguments()[0]; //提取action上泛型实体信息
            // 1. 继承ifilter类进行行级数据过滤； 2. 对工作流业务的待办场景进行数据拦截只看到
            if (IFilter.class.isAssignableFrom(clazz)) {
                AbstractWrapper queryWrapper= req.qw(clazz);
                String sysDeptId=userObj.getString("sysDeptId");
                //实现IFilter接口的类需要进行过滤
                    EntityDto entityDto = GlobalData.entityDto(clazz);//当前查询的表
                    if (groupFilterType.equals("sysUser_1")) {
                        String userField=entityDto.fkMap.get(SysUser.class);
                        if(userField!=null){ //负责人是自己
                            queryWrapper.eq(userField, securityUser.getId());
                        }else if(SysUser.class.equals(clazz)){
                            queryWrapper.eq("id", securityUser.getId());
                        }else if(SysDept.class.equals(clazz)){
                            queryWrapper.eq("id", sysDeptId);
                        }else {//本人创建的
                            queryWrapper.eq("createId", securityUser.getId());
                        }
                    } else if (groupFilterType.equals("sysDept_1")) {//本部门创建的
                        String deptField=entityDto.fkMap.get(SysDept.class);
                        if(deptField!=null){
                            queryWrapper.eq(deptField, sysDeptId);
                        }else if(SysDept.class.equals(clazz)){
                            queryWrapper.eq("id", sysDeptId);
                        }else{//本部门用户创建
                            queryWrapper.addFkRelation(SysUser.class, "createId").eq("sysDeptId", sysDeptId, SysUser.class);
                        }
                    } else if (groupFilterType.equals("sysDept_2")) {//本部门及下级部门创建的
                        String deptField=entityDto.fkMap.get(SysDept.class);
                        String deptCode=userObj.getString("codeDept");
                        if(deptField!=null){ //查询存在外键关联部门表
                            queryWrapper.startsWith("code", deptCode, clazz, SysDept.class);
                        }else if(SysDept.class.equals(clazz)){ //查询部门表
                            queryWrapper.startsWith("code",deptCode, clazz);
                        }else{  //根据创建人部门查询
                            queryWrapper.addFkRelation(SysUser.class, "createId").startsWith("code", deptCode, SysUser.class, SysDept.class);
                        }
                    }
                    req.setQueryWrapper(queryWrapper);
                }
            }
        }}
    }
}