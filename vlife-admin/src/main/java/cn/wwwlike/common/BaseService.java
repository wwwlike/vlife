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
import cn.wwwlike.vlife.base.ITree;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.OrderRequest;
import cn.wwwlike.vlife.base.SaveBean;
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
    public final String TREECODE="code";
    @Autowired
    public SysGroupService sysGroupService;
    /*
     * 权限组map
     * */
    public static Map<String, SysGroup> groups=new HashMap<>();
    /**
     * 对应用户表里的字段
     */
    public static Map<String,String> userTableField=new HashMap<>();

//    protected DataProcess createProcess(IdBean bean) {
//        return new VlifeDataProcess(bean);
//    }
//    @Autowired
//    public SysFilterDetailService filterDetailService;
//
//    @Autowired
//    public SysFilterDetailDao filterDetailDao;
//
////    //sysUserId 与业务表字段对应的语句
////    public static Map<String,Object[]> map=new HashMap<>();
//
//
////    static{
////        // sysAreaId 表里的外键字段；
////        // areaId-> security里对应的字段
////        // codeArea-> 下级查询的code
////        // SysArea.class id，code来源表
////        // 6-> scope 查询级别（6，4，2都是查询下级）
////        map.put("sysAreaId",new Object[]{"areaId","codeArea", SysArea.class,AuthDict.GROUP_SCOPE.AREAS});
////        map.put("sysOrgId",new Object[]{"orgId","codeOrg",SysOrg.class,AuthDict.GROUP_SCOPE.ORGS});
////        map.put("sysDeptId",new Object[]{"deptId","codeDept", SysDept.class,AuthDict.GROUP_SCOPE.DEPTS});
////        //用户表
////        map.put("createId",new Object[]{"id",null, SysUser.class,AuthDict.GROUP_SCOPE.SELF});
////    }
//
//    /**
//     * 是否业务实体
//     * @param entity
//     * @return
//     */
    public boolean isBusEntity(Class entity){
        if(IBus.class.isAssignableFrom(entity) ){
            return true;
        }
        return false;
    }

    public < S extends AbstractWrapper> S addQueryFilter(S queryWrapper) {
        SecurityUser securityUser= SecurityConfig.getCurrUser();
        if(securityUser!=null){
            JSONObject user=  (JSONObject)securityUser.getSysUser();
            String groupId=securityUser.getGroupId();
            SysGroup group=groups.get(groupId);
            if(group==null){
                group=sysGroupService.findOne(securityUser.getGroupId());
                groups.put(groupId,group);
            }
            String groupFilterType=group.getFilterType();
            //权限组需要进行数据权限过滤
            if(group!=null&&!"".equals(group)&&
            groupFilterType!=null&&groupFilterType.split("_").length==2){
                String[] filterType=groupFilterType.split("_");
                String filterEntityType=filterType[0]; //根据哪个外键过滤
                String level=filterType[1];// "1" 本级  2 本级和下级
                EntityDto groupFilterEntityDto= GlobalData.entityDto(filterEntityType);
                EntityDto entityDto= GlobalData.entityDto(queryWrapper.getEntityClz());
                if(groupFilterEntityDto.getClz()==queryWrapper.getEntityClz()||
                entityDto.fkMap.get(groupFilterEntityDto.getClz())!=null
                ){
                Consumer<S> consumer= wrapper->{
                    //被过滤的实体模型信息
               String userField=userTableField.get(filterEntityType);
               if(userField==null){
                  userField= filterEntityType.equals("sysUser")?"id":filterEntityType+"Id";
                  userTableField.put(filterEntityType,userField);
               }
                //行级数据过滤，关于用户表上的那个值
                Object userFieldIdVal=user.get(userField);
               if(groupFilterEntityDto.getClz()==queryWrapper.getEntityClz()){//查询的表和行过滤的表相同(如查询本部门的数据，此时查询的表时部门表)
                   if(level.equals("1")){//id
                       wrapper.eq("id",userFieldIdVal);
                   }else if(level.equals("2")){
                       wrapper.startsWith(TREECODE,((JSONObject)user.get(filterEntityType)).get(TREECODE));
                   }
               }else{//过滤级别时本部门，查询的时项目表； select * from project where deptId
                   if(level.equals("1")){
                       wrapper.eq(userField, userFieldIdVal);
                   }else if(level.equals("2")){
                       wrapper.startsWith(TREECODE,((JSONObject)user.get(filterEntityType)).get(TREECODE), groupFilterEntityDto.getClz());//,info.getDataClz());
                   }
               }};
                consumer.accept(queryWrapper);
                queryWrapper.and(consumer);
                }
            }
        }
        return queryWrapper;
    }
//    @Override
//    public < S extends AbstractWrapper> S addQueryFilter(S queryWrapper){
////        if(true) //暂时屏蔽下面的代码
////            return queryWrapper;
//        //当前查询模块
//        PehrSecurityUser user=SecurityConfig.getCurrUser();
//        if(user!=null&&isBusEntity(queryWrapper.getEntityClz())){
//            //该业务实体的过滤规则
//            Consumer<S> consumer= wrapper->{
//                SysFilterDetail rule = filterDetailService.filterRule(queryWrapper.getEntityClz(), user.getGroupId());
//                //filterRuleClz 业务表的过滤规则，查询 user,org,area,dept时，如果过滤规则与业务表不一致，以业务表为准
//                if(queryWrapper.filterRuleClz!=null){
//                    //取出业务表规则对其进行替换
//                    SysFilterDetail businessRule=filterDetailService.filterRule(queryWrapper.filterRuleClz,user.getGroupId());
//                    //不等于叫要改成和业务表规则一致的过滤条件
//                    if(businessRule.getScope()!=rule.getScope()){
//                        Integer businessScope=businessRule.getScope();
//                        //支持的规则
//                        List<SysFilterDetail> supports=filterDetailService.find("sysFilterId",rule.getSysFilterId());
//                        Optional<SysFilterDetail> sameScopeRule= supports.stream().filter(s->s.getScope()==businessScope).findAny();
//                        if(sameScopeRule.isPresent()){//存在和业务表里一致的规则
//                            rule=sameScopeRule.get();
//                        }else{
//                            //先找小的于业务表的最大值，
//                            List<SysFilterDetail> less=supports.stream().filter(s->s.getScope()<businessScope).sorted(Comparator.comparing(e -> e.getScope())).collect(Collectors.toList());
//                            if(less.size()>0){
//                                rule=less.get(less.size()-1);
//                            }else{ //if找不到，则使用大于它且最小的
//                                Optional<SysFilterDetail> gt=supports.stream().filter(s->s.getScope()>businessScope).sorted(Comparator.comparing(e -> e.getScope())).findFirst();
//                                rule=gt.get();
//                            }
//                        }
//                    }else{
//                        //相等就不改变
//                    }
//                }
//                SysFilterDetailService.FilterInfo info=filterDetailService.map.get(rule.getFieldKey());
//                Object codeVal="";
//                if(info.getSecurityCode()!=null){
//                    codeVal= ReflectionUtils.getFieldValue(user,info.getSecurityCode());
//                }
//                Object idVal=ReflectionUtils.getFieldValue(user,info.getSecurityId());
//                // 原先是querySelf
//                if(rule.querySelf){ //通过本表id或者code进行查询
//                    if(rule.querySub){ //查询本级下级
//                        wrapper.startsWith(TREECODE,codeVal);
//                    }else{ //查询自己
//                        wrapper.eq("id",idVal);
//                    }
//                }else{ //查询业务表
//                    if(rule.querySub){ //查询本级下级 关联表进行code查询
//                        wrapper.startsWith(TREECODE,codeVal,info.getDataClz());
//                    }else{// 查询
//                        System.out.println(queryWrapper.getEntityClz().getSimpleName()+"_"+info.getFkField());
////                        String fkId=ruleMainClzChange?"id":info.getFkField();
//                        wrapper.eq(info.getFkField(),idVal);
//                    }
//                }
//            };
////            consumer.accept(queryWrapper);
//            queryWrapper.and(consumer);
//            };
//        return queryWrapper;
//    }
//
//    /**
//     * 实体直接保存重载
//     */
    protected  <E extends Item >E save(E beanDto, DataProcess masterProcess) {
        ITree oldTree=null;
        if(beanDto instanceof ITree){
            oldTree=treeCode((ITree) beanDto, beanDto.getId()!=null? (ITree) findOne(beanDto.getId()) :null);
        }
        super.save(beanDto,masterProcess);
        if(oldTree!=null){  //1 修改之前的子级成新的code
            batchTreeSub(oldTree.getCode(),((ITree) beanDto).getCode());
        }
        return beanDto;
    }


    public <E extends SaveBean<T>> E save(E saveBean, boolean isFull) {
        ITree oldTree=null;
        if(saveBean instanceof ITree){
            oldTree=treeCode((ITree) saveBean, saveBean.getId()!=null? (ITree) findOne(saveBean.getId()) :null);
        }
        super.save(saveBean,isFull);
        if(oldTree!=null){  //1 修改之前的子级成新的code
            batchTreeSub(oldTree.getCode(),((ITree) saveBean).getCode());
        }
        return saveBean;

    }
//
//    /**
//     * dto保存重载
//     */
//    protected <E extends IdBean> E saveBean(final E beanDto, Class<? extends Item> fkItemClz, String fkItemId, UnaryOperator<DataProcess> callBackMethod, boolean subIsFull) {
//        ITree oldTree=null;
//        if(beanDto instanceof ITree){
//            oldTree=treeCode((ITree) beanDto, beanDto.getId()!=null? (ITree) findOne(beanDto.getId()) :null);
//        }
//        super.saveBean(beanDto,fkItemClz,fkItemId,callBackMethod,subIsFull);
//        if(oldTree!=null){  //1 修改之前的子级成新的code
//            batchTreeSub(oldTree.getCode(),((ITree) beanDto).getCode());
//        }
//        return beanDto;
//    }
//
    /**
     * 设置code,并返回标识是否保存后还要做其他修改的工作(老code)
     */
    private <E extends IdBean> ITree treeCode(ITree bean, ITree oldBean) {
        //父code有变化
        if(ITree.class.isAssignableFrom(entityClz)&&
                (oldBean==null||
                        oldBean!=null&&
                                ((oldBean.getPcode()!=null&&!oldBean.getPcode().equals(bean.getPcode())) ||
                                        (bean.getPcode()!=null&&!bean.getPcode().equals(oldBean.getPcode()))))){
//              是修改，且父级有变化
            String code=bean.getCode();
            String pcode=bean.getPcode();
            //根据前端提交的pcode计算
            //以最新的pcode为准来改变code
            if(code==null||(pcode==null&&code.length()!=3)||(!(code.startsWith(pcode)&&code.length()==pcode.length()+4))){ //新增的情况
                code=compCode(pcode);
                bean.setCode(code);
            }
            return oldBean;
        }
        //前端没有提交code,则把老code附上，父亲pcode不变，本上的code则不会变
        if(oldBean!=null&& bean.getCode()==null){
            bean.setCode(oldBean.getCode());
        }
        return null;
    }

    /**
     * 通过pcode得到最新的子节点code
     * @param pcode
     * @return
     */
    private String compCode(String pcode){
        QueryWrapper<T>  qw=null;
        if(pcode==null){ //一级节点
            qw=  QueryWrapper.of(entityClz).isNull("pcode");
        }else{
            qw=QueryWrapper.of(entityClz).startsWith(TREECODE, pcode)
                    .eq(true, TREECODE, pcode.length() + 4, new LengthTran());
        }
        OrderRequest order = new OrderRequest();
        order.addOrder("code", Sort.Direction.DESC);
        List<T> list = dao.query(entityClz,qw, order);
        String endCode = StringUtils.leftPad(
                (list.size()==0?"1":
                        (Integer.parseInt(((ITree)list.get(0)).getCode().replaceFirst(pcode+"_",""))+1)+""),
                3, "0");
        return (pcode==null? "":pcode+"_") + endCode; //code的计算逻辑
    }

    /**
     * 批量更新子节点
     * @param oldPcode
     * @param newPcode
     */
    private void batchTreeSub(String oldPcode,String newPcode){
        if(ITree.class.isAssignableFrom(entityClz)){
            //查询原先老编码下的子节点及孙子节点
            List<T> trees=dao.find(QueryWrapper.of(entityClz).startsWith(TREECODE,oldPcode+"_"));
            for(T bean:trees){
                ITree treeBean= ((ITree)bean);
                String newTreeCode=treeBean.getCode().replaceFirst(oldPcode,newPcode);
                treeBean.setCode(newTreeCode);
                treeBean.setPcode(newPcode);
                dao.save((T)treeBean);
            }
        }
    }
//
//    public BeanDto modelInfo(String modelName){
//        BeanDto beanDto=super.modelInfo(modelName);
//        if(beanDto==null){
//            return null;
//        }
//        //业务类里的查询字段进行显示隐藏控制
//        if((Business.class.isAssignableFrom(entityClz)||//业务模型
//                entityClz==SysOrg.class|| //机构模型
//                entityClz==SysUser.class //机构模型
//        )&&beanDto instanceof ReqDto){//查询模型
//            beanDto=queryModelFilter(beanDto);
//        }else if(!(beanDto instanceof ReqDto)){
//            beanDto=dtoModelFilter(beanDto);
//        }
//        return beanDto;
//    }
//
//    /**
//     * Busniess业务表查询模型进行过滤
//     * 一，视图模型，和查询模型
//     * 搜索条件里有地区、机构、部门，则根据权限规则查询条件里应该有：(视图模型和它是一致的)
//     * 6.本地区和下级地区 ，出现地区树(按地区搜索)
//     * 隐藏：机构和部门
//     * 5.本地区 （按机构查询）
//     * 隐藏：出现地区和部门，出现机构树，机构树的父节点是地区名称
//     * 4. 本机构和下级机构
//     * 隐藏：地区和部门，出现机构树：父节点是本机构
//     * 3. 本机构
//     * 隐藏：地区和机构，出现部门树，根节点是本机构
//     * 2. 本部门和下级部门
//     * 隐藏：地区和机构，出现部门树,父节点是本部门
//     * 1. 本部门
//     * 隐藏：地区和机构，部门，不数显任何查询条件；
//     * 0. 本人
//     * 隐藏：地区和机构，部门，不数显任何查询条件；
//     *
//     * 二，编辑视图
//     * 根据实体类接口判断字段是录入还是不显示
//     * 1. 实现Busniess接口，文字从用户取
//     * 2. 没实现Buniess接口，文字需要录入
//     * 对字段信息里的hide属性根据用户权限组里的规则进行计算
//     * 以便对前端是否录入和展示进行控制
//     * @param dto
//     * @return  本级和下级  本级
//     */
//    protected BeanDto queryModelFilter(BeanDto<T> dto){
//        PehrSecurityUser currUser=SecurityConfig.getCurrUser();
//        SysFilterDetail rule=filterDetailService.filterRule(entityClz,currUser.getGroupId());
//        CommonResponseEnum.CANOT_CONTINUE.assertNotNull(rule,"没有配置查询权限");
//        Integer scope=rule.getScope();
//        Optional<FieldDto> area=dto.find("sysArea_code");
//        Optional<FieldDto> org=dto.find("sysOrg_code");
//        Optional<FieldDto> dept=dto.find("sysDept_code");
//        // sysorg,sysArea,sysDept
////        //可能是机构地区或者部门
//        Optional<FieldDto> code=dto.find("code");
//
//        //隐藏非地区的条件 !=6
//        if(area.isPresent()){
//            if(!AuthDict.GROUP_SCOPE.AREAS.equals(scope))
//                area.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//            else
//                area.get().setUiState(VCT.FIELD_UISTATE.WRITE);
//        }
//        //隐藏机构的条件 !=5 !=4
//        if(org.isPresent()) {
//            if (!AuthDict.GROUP_SCOPE.AREA.equals(scope) && !AuthDict.GROUP_SCOPE.ORGS.equals(scope)) {
//                org.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//            }else{
//                org.get().setUiState(VCT.FIELD_UISTATE.WRITE);
//            }
//        }
//        //隐藏部门的条件 !=3 !=2
//        if(dept.isPresent()) {
//            if (!AuthDict.GROUP_SCOPE.ORG.equals(scope) && !AuthDict.GROUP_SCOPE.DEPTS.equals(scope)) {
//                dept.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//            }else{
//                dept.get().setUiState(VCT.FIELD_UISTATE.WRITE);
//            }
//        }
//        //sysOrg实体的单独处理
//        if(code.isPresent()&&SysOrg.class==entityClz) {
//            if (!AuthDict.GROUP_SCOPE.AREA.equals(scope) && !AuthDict.GROUP_SCOPE.ORGS.equals(scope)) {
//                code.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//            }else{
//                code.get().setUiState(VCT.FIELD_UISTATE.WRITE);
//            }
//        }
//        return dto;
//    }
//
//    /**
//     * reqFilter
//     * 模型与权限组结合，对area,code,dept树的查询组件进行过滤
//     * @param
//     * @return
//     */
//    public FormVo reqModelFilter(FormVo reqModel){
//        PehrSecurityUser currUser=SecurityConfig.getCurrUser();
//        Class clz= GlobalData.entityDto(reqModel.getEntityType()).getClz();
//        if(IBus.class.isAssignableFrom(clz)){
//        SysFilterDetail rule=filterDetailService.filterRule(clz,currUser.getGroupId());
//        CommonResponseEnum.CANOT_CONTINUE.assertNotNull(rule,"没有配置查询权限");
//        Integer scope=rule.getScope();
//        Optional<FormFieldVo> area=reqModel.getFields().stream().filter(s->s.getFieldName().equals("sysArea_code")).findFirst();
//        Optional<FormFieldVo> org=reqModel.getFields().stream().filter(s->s.getFieldName().equals("sysOrg_code")).findFirst();
//        Optional<FormFieldVo> dept=reqModel.getFields().stream().filter(s->s.getFieldName().equals("sysDept_code")).findFirst();
//        // sysorg,sysArea,sysDept
////        //可能是机构地区或者部门
//        Optional<FormFieldVo> code=reqModel.getFields().stream().filter(s->s.getFieldName().equals("code")).findFirst();
//        //隐藏非地区的条件 !=6
//        if(area.isPresent()){
//            if(!AuthDict.GROUP_SCOPE.AREAS.equals(scope))
//                area.get().setX_hidden(true);
//            else
//                area.get().setX_hidden(false);;
//        }
//        //隐藏机构的条件 !=5 !=4
//        if(org.isPresent()) {
//            if (!AuthDict.GROUP_SCOPE.AREA.equals(scope) && !AuthDict.GROUP_SCOPE.ORGS.equals(scope)) {
//                org.get().setX_hidden(true);
//            }else{
//                org.get().setX_hidden(false);;
//            }
//        }
//        //隐藏部门的条件 !=3 !=2
//        if(dept.isPresent()) {
//            if (!AuthDict.GROUP_SCOPE.ORG.equals(scope) && !AuthDict.GROUP_SCOPE.DEPTS.equals(scope)) {
//                dept.get().setX_hidden(true);
//            }else{
//                dept.get().setX_hidden(false);;
//            }
//        }
//        //sysOrg实体的单独处理
//        if(code.isPresent()&&SysOrg.class==clz) {
//            if (!AuthDict.GROUP_SCOPE.AREA.equals(scope) && !AuthDict.GROUP_SCOPE.ORGS.equals(scope)) {
//                code.get().setX_hidden(true);
//            }else{
//                code.get().setX_hidden(false);;
//            }
//        }
//        }
//        return reqModel;
//    }
//
//
//    /**
//     * 非req查询模型里需要隐藏的字段
//     * @param dto
//     * @return
//     */
//    private BeanDto dtoModelFilter(BeanDto<T> dto){
//        Optional<FieldDto> area=dto.find("sysAreaId");
//        Optional<FieldDto> org=dto.find("sysOrgId");
//        Optional<FieldDto> dept=dto.find("sysDeptId");
//        if(IArea.class.isAssignableFrom(entityClz)&&area.isPresent()){
//            area.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//        }
//        if(IOrg.class.isAssignableFrom(entityClz)&&org.isPresent()){
//            org.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//        }
//        if(IDept.class.isAssignableFrom(entityClz)&&dept.isPresent()){
//            dept.get().setUiState(VCT.FIELD_UISTATE.HIDE);
//        }
//        return dto;
//    }
}
