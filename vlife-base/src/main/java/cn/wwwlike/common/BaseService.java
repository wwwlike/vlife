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
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.SysGroup;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.vlife.base.*;
import cn.wwwlike.vlife.core.DataProcess;
import cn.wwwlike.vlife.core.VLifeDao;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.tran.LengthTran;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 权限应用的service基类
 * 至少需要进行查询权限控制的模型service应该继承与他
 */
public class BaseService<T extends Item, D extends VLifeDao<T>> extends VLifeService<T, D> {
    public final String TREECODE = "code";
    @Autowired
    public FormService formService;
    /*
     * 权限组map
     * */
    public static Map<String, SysGroup> groups = new HashMap<>();
    /*
     * 模型map
     * */
    public static Map<String, FormDto> models = new HashMap<>();
    /**
     * 对应用户表里的字段
     * 当前权限组设置的模块->用户表的字段
     */
    public static Map<String, String> userMap = new HashMap<>();

    public FormDto getModelInfo(String type) {
        if (models.get(type) == null) {
            QueryWrapper<Form> req = QueryWrapper.of(Form.class).eq("type", type);
            List<FormDto> vos = formService.query(FormDto.class, req);
            if (vos.size() > 0) {
                models.put(type, vos.get(0));
            } else {
                //模型查询不到（数据未初始化）
                return null;
            }
        }
        return models.get(type);
    }

    protected DataProcess createProcess(IdBean bean) {
        return new VlifeDataProcess(bean);
    }

    @Override
    public <E extends IdBean> E saveBean(final E idBean, boolean isFull) {
        //判断是否树型实体接口，对树形code及父code进行计算赋值
        ITree oldTree = null;
        if (idBean instanceof ITree) {
            oldTree = treeCode((ITree) idBean, idBean.getId() != null ? (ITree) findOne(idBean.getId()) : null);
        }
        saveBean(idBean, null, null, null, isFull);
        //树形节点子节点code级联更新
        if (oldTree != null) {  //1 修改之前的子集成新的code
            batchTreeSub(oldTree.getCode(), ((ITree) idBean).getCode());
        }
        return idBean;
    }

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
        String compCode=null;
        //初始为1
        Integer compNum=1;
        //找最大节点
        if(list!=null&&list.size()> 0){
            String lastCode=((ITree)list.get(0)).getCode();
            //截取后三位转换成数字后加一
            compNum=Integer.parseInt((lastCode.substring(lastCode.length()-3)))+1;
        }
        String endCode = StringUtils.leftPad(
                compNum+"",
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
