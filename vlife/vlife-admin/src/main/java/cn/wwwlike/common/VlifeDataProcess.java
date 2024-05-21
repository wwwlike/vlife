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
import cn.wwwlike.auth.common.IArea;
import cn.wwwlike.auth.common.IDept;
import cn.wwwlike.auth.common.IOrg;
import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.core.DataProcess;
import cn.wwwlike.vlife.dict.CT;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.web.security.core.SecurityUser;
import com.alibaba.fastjson.JSONObject;

import java.util.Date;
import java.util.Map;

/**
 * 数据保存之前必须回调的类
 */
public class VlifeDataProcess extends DataProcess {
    public VlifeDataProcess(IdBean bean) {
        super(bean);
    }

    /**
     * 本业务场景里，保存新增通用字段值设置;
     * 如果在排除字段里则将它们去掉
     */
    @Override
    public void commonDataSet(IdBean bean, Map<String, Object> mm) {
        Class entityClz=null;
        if(bean instanceof Item){
            entityClz=bean.getClass();
        }else{
            entityClz=GenericsUtils.getGenericType(bean.getClass());
        }

        if (bean.getId() == null) {
            if(getIgnores()!=null) {//排除字段保存，不能排除这6个字段
                this.ignores.remove("status");
                this.ignores.remove("createDate");
                this.ignores.remove("createId");
                if(IOrg.class.isAssignableFrom(entityClz)) {
                    this.ignores.remove("sysOrgId");
                }
                if(IDept.class.isAssignableFrom(entityClz)) {
                    this.ignores.remove("sysDeptId");
                }
                if(IArea.class.isAssignableFrom(entityClz)) {
                    this.ignores.remove("sysAreaId");
                }
            }
            if(getAssigns()!=null) { //指定字段保存保存
                this.assigns.add("status");
                this.assigns.add("createDate");
                if(IOrg.class.isAssignableFrom(entityClz)) {
                    this.assigns.add("sysOrgId");
                }
                if(IDept.class.isAssignableFrom(entityClz)) {
                    this.assigns.add("sysDeptId");
                }
                if(IArea.class.isAssignableFrom(entityClz)) {
                    this.assigns.add("sysAreaId");
                }
              //??remove
                this.ignores.remove("createId");
            }

            mm.put("createDate", new Date());
            mm.put("status", CT.STATUS.NORMAL);
            if(SecurityConfig.getCurrUser()!=null){
              SecurityUser securityUser= SecurityConfig.getCurrUser();
                JSONObject user= (JSONObject)securityUser.getUseDetailVo();
                mm.put("createId", user.get("id"));
                mm.put("createDeptcode",user.get("codeDept"));
//                if(IOrg.class.isAssignableFrom(entityClz)) {
//                    mm.put("sysOrgId",user.getsys());
//                }
                if(IDept.class.isAssignableFrom(entityClz)) {
                    mm.put("sysDeptId",user.get("sysDeptId"));
                }
//                if(IArea.class.isAssignableFrom(entityClz)) {
//                    mm.put("sysAreaId",user.getSys);
//                }
            }

        } else {
            if(getIgnores()!=null) {
                this.ignores.remove("modifyDate");
                this.ignores.remove("modifyId");
            }
            if(getAssigns()!=null) {
                this.assigns.add("modifyDate");
                this.assigns.add("modifyId");
            }
            mm.put("modifyDate", new Date());
            mm.put("modifyId",SecurityConfig.getCurrUser()!=null?SecurityConfig.getCurrUser().getId():null);
        }
    }


}
