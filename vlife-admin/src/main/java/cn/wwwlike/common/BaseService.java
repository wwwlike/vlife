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

package cn.wwwlike.common;

//import cn.wwwlike.auth.common.*;
//import cn.wwwlike.auth.config.AuthDict;
//import cn.wwwlike.auth.config.SecurityConfig;
//import cn.wwwlike.auth.entity.*;
//import cn.wwwlike.base.model.IdBean;
//import cn.wwwlike.form.vo.FormFieldVo;
//import cn.wwwlike.form.vo.FormVo;
//import cn.wwwlike.sys.entity.SysOrg;
//import cn.wwwlike.vlife.base.*;
//import cn.wwwlike.vlife.core.DataProcess;
//import cn.wwwlike.vlife.core.VLifeDao;
//import cn.wwwlike.vlife.core.VLifeService;
//import cn.wwwlike.vlife.dict.VCT;
//import cn.wwwlike.vlife.objship.dto.*;
//import cn.wwwlike.vlife.objship.read.GlobalData;
//import cn.wwwlike.vlife.query.AbstractWrapper;
//import cn.wwwlike.vlife.query.QueryWrapper;
//import cn.wwwlike.vlife.query.tran.LengthTran;
//import cn.wwwlike.vlife.utils.ReflectionUtils;
//import cn.wwwlike.web.exception.enums.CommonResponseEnum;
//import cn.wwwlike.web.security.filter.PehrSecurityUser;
//import org.apache.commons.lang3.StringUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Sort;
//
//import java.util.*;
//import java.util.concurrent.atomic.AtomicReference;
//import java.util.function.Consumer;
//import java.util.function.UnaryOperator;
//import java.util.stream.Collectors;

import cn.wwwlike.auth.common.IBus;
import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.dao.SysGroupDao;
import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.auth.entity.SysUser;
import cn.wwwlike.auth.service.SysGroupService;
import cn.wwwlike.auth.vo.UserDetailVo;
import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.plugins.utils.JsonUtil;
import cn.wwwlike.sys.entity.SysDept;
import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.core.DataProcess;
import cn.wwwlike.vlife.core.VLifeDao;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.AbstractWrapper;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.tran.LengthTran;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import cn.wwwlike.web.security.core.SecurityUser;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * 权限应用的service基类
 * 至少需要进行查询权限控制的模型service应该继承与他
 */
public class BaseService<T extends Item, D extends VLifeDao<T>> extends VLifeService<T,D> {
    public final String TREECODE = "code";
    @Autowired
    public SysGroupService sysGroupService;
    /*
     * 权限组map
     * */
    public static Map<String, SysGroup> groups = new HashMap<>();
    /**
     * 对应用户表里的字段
     */
    public static Map<String, String> userTableField = new HashMap<>();

    protected DataProcess createProcess(IdBean bean) {
        return new VlifeDataProcess(bean);
    }

    /**
     * 是否业务实体
     *
     * @param entity
     * @return
     */
    public boolean isBusEntity(Class entity) {
        if (IBus.class.isAssignableFrom(entity)) {
            return true;
        }
        return false;
    }

    public <S extends AbstractWrapper> S addQueryFilter(S queryWrapper) {
        SecurityUser securityUser = SecurityConfig.getCurrUser();
        if (securityUser != null) {
            JSONObject user = (JSONObject) securityUser.getSysUser();
            String groupId = securityUser.getGroupId();
            SysGroup group = groups.get(groupId);
            if (group == null) {
                group = sysGroupService.findOne(securityUser.getGroupId());
                groups.put(groupId, group);
            }
            String groupFilterType = group.getFilterType();
            //权限组需要进行数据权限过滤
            if (group != null && !"".equals(group) &&
                    groupFilterType != null && groupFilterType.split("_").length == 2) {
                String[] filterType = groupFilterType.split("_");
                String filterEntityType = filterType[0]; //根据哪个外键过滤
                String level = filterType[1];// "1" 本级  2 本级和下级
                EntityDto groupFilterEntityDto = GlobalData.entityDto(filterEntityType);
                EntityDto entityDto = GlobalData.entityDto(queryWrapper.getEntityClz());
                if (groupFilterEntityDto.getClz() == queryWrapper.getEntityClz() ||
                        entityDto.fkMap.get(groupFilterEntityDto.getClz()) != null
                ) {
                    Consumer<S> consumer = wrapper -> {
                        //被过滤的实体模型信息
                        String userField = userTableField.get(filterEntityType);
                        if (userField == null) {
                            userField = filterEntityType.equals("sysUser") ? "id" : filterEntityType + "Id";
                            userTableField.put(filterEntityType, userField);
                        }
                        //行级数据过滤，关于用户表上的那个值
                        Object userFieldIdVal = user.get(userField);
                        if (groupFilterEntityDto.getClz() == queryWrapper.getEntityClz()) {//查询的表和行过滤的表相同(如查询本部门的数据，此时查询的表时部门表)
                            if (level.equals("1")) {//id
                                wrapper.eq("id", userFieldIdVal);
                            } else if (level.equals("2")) {
                                wrapper.startsWith(TREECODE, ((JSONObject) user.get(filterEntityType)).get(TREECODE));
                            }
                        } else {//过滤级别时本部门，查询的时项目表； select * from project where deptId
                            if (level.equals("1")) {
                                wrapper.eq(userField, userFieldIdVal);
                            } else if (level.equals("2")) {
                                wrapper.startsWith(TREECODE, ((JSONObject) user.get(filterEntityType)).get(TREECODE), groupFilterEntityDto.getClz());//,info.getDataClz());
                            }
                        }
                    };
                    consumer.accept(queryWrapper);
                    queryWrapper.and(consumer);
                }
            }
        }
        return queryWrapper;
    }


    @Override
    protected <E extends IdBean> E saveBean(final E idBean, boolean isFull) {
        //判断是否树型实体接口，对树形code及父code进行计算赋值
        ITree oldTree = null;
        if (idBean instanceof ITree) {
            oldTree = treeCode((ITree) idBean, idBean.getId() != null ? (ITree) findOne(idBean.getId()) : null);
        }
        //编号接口赋值
        if(idBean instanceof INo && ((INo) idBean).getNo()==null){
            ReflectionUtils.setFieldValue(idBean,"no", BusinessNumberGenerator.generate("NO-"));
        }
         saveBean(idBean, null, null, null, isFull);
        if (oldTree != null) {  //1 修改之前的子集成新的code
            batchTreeSub(oldTree.getCode(), ((ITree) idBean).getCode());
        }
        return idBean;

    }

//    /**
//     * 实体直接保存重载
//     */
//    @Override
//    protected <E extends Item> E save(E beanDto, DataProcess masterProcess) {
//        //判断是否树型实体接口，对树形code及父code进行计算赋值
//        ITree oldTree = null;
//        if (beanDto instanceof ITree) {
//            oldTree = treeCode((ITree) beanDto, beanDto.getId() != null ? (ITree) findOne(beanDto.getId()) : null);
//        }
//        //赋值表单
//        if(beanDto instanceof INo && ((INo) beanDto).getNo()==null){
//            BusinessNumberGenerator.generate("NO-");
//        }
//        super.save(beanDto, masterProcess);
//        if (oldTree != null) {  //1 修改之前的子集成新的code
//            batchTreeSub(oldTree.getCode(), ((ITree) beanDto).getCode());
//        }
//
//        return beanDto;
//    }


//    public <E extends SaveBean<T>> E save(E saveBean, boolean isFull) {
//        //判断是否树型实体接口，对树形code及父code进行计算赋值
//        ITree oldTree = null;
//        if (saveBean instanceof ITree) {
//            oldTree = treeCode((ITree) saveBean, saveBean.getId() != null ? (ITree) findOne(saveBean.getId()) : null);
//        }
//        if(saveBean instanceof INo && ((INo) saveBean).getNo()==null){
//            BusinessNumberGenerator.generate("NO-");
//        }
//        super.save(saveBean, isFull);
//        if (oldTree != null) {  //1 修改之前的子集成新的code
//            batchTreeSub(oldTree.getCode(), ((ITree) saveBean).getCode());
//        }
//        return saveBean;
//    }



    //内部辅助方法

    /**
     * 设置code,并返回标识是否保存后还要做其他修改的工作(老code)
     */
    private <E extends IdBean> ITree treeCode(ITree bean, ITree oldBean) {
        //父code有变化
        if (ITree.class.isAssignableFrom(entityClz) &&
                (oldBean == null ||
                        oldBean != null &&
                                ((oldBean.getPcode() != null && !oldBean.getPcode().equals(bean.getPcode())) ||
                                        (bean.getPcode() != null && !bean.getPcode().equals(oldBean.getPcode()))))) {
//              是修改，且父级有变化
            String code = bean.getCode();
            String pcode = bean.getPcode();
            //根据前端提交的pcode计算
            //以最新的pcode为准来改变code
            if (code == null || (pcode == null && code.length() != 3) || (!(code.startsWith(pcode) && code.length() == pcode.length() + 4))) { //新增的情况
                code = compCode(pcode);
                bean.setCode(code);
            }
            return oldBean;
        }
        //前端没有提交code,则把老code附上，父亲pcode不变，本上的code则不会变
        if (oldBean != null && bean.getCode() == null) {
            bean.setCode(oldBean.getCode());
        }
        return null;
    }

    /**
     * 通过pcode得到最新的子节点code
     *
     * @param pcode
     * @return
     */
    private String compCode(String pcode) {
        QueryWrapper<T> qw = null;
        if (pcode == null) { //一级节点
            qw = QueryWrapper.of(entityClz).isNull("pcode");
        } else {
            qw = QueryWrapper.of(entityClz).startsWith(TREECODE, pcode)
                    .eq(true, TREECODE, pcode.length() + 4, new LengthTran());
        }
        OrderRequest order = new OrderRequest();
        order.addOrder("code", Sort.Direction.DESC);
        List<T> list = dao.query(entityClz, qw, order);
        String endCode = StringUtils.leftPad(
                (list.size() == 0 ? "1" :
                        (Integer.parseInt(((ITree) list.get(0)).getCode().replaceFirst(pcode + "_", "")) + 1) + ""),
                3, "0");
        return (pcode == null ? "" : pcode + "_") + endCode; //code的计算逻辑
    }

    /**
     * 批量更新子节点
     *
     * @param oldPcode
     * @param newPcode
     */
    private void batchTreeSub(String oldPcode, String newPcode) {
        if (ITree.class.isAssignableFrom(entityClz)) {
            //查询原先老编码下的子节点及孙子节点
            List<T> trees = dao.find(QueryWrapper.of(entityClz).startsWith(TREECODE, oldPcode + "_"));
            for (T bean : trees) {
                ITree treeBean = ((ITree) bean);
                String newTreeCode = treeBean.getCode().replaceFirst(oldPcode, newPcode);
                treeBean.setCode(newTreeCode);
                treeBean.setPcode(newPcode);
                dao.save((T) treeBean);
            }
        }
    }
}
