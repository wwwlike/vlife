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

package cn.wwwlike.auth.dto;

import cn.wwwlike.auth.entity.SysRole;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
/**
 * 角色保存对象
 */
@Data
public class RoleDto implements SaveBean<SysRole> {
    public String id;
    public String name;
    public String remark;
    /**
     * 管理应用
     */
    public String sysMenuId;
    /**
     * 关联权限
     * 请先选择应用
     */
    @VField(skip = true)
    public List<String> resourcesAndMenuIds;
    //接口
    public List<String> sysResources_id;
    //菜单
    public List<String> sysMenu_id;

    public List<String> getResourcesAndMenuIds(){
        if(resourcesAndMenuIds!=null&&resourcesAndMenuIds.size()>0){
            return resourcesAndMenuIds;
        }
        List<String> mergedList = new ArrayList<>();
        if (getSysMenu_id() != null&&getSysMenu_id().size()>0) {
            mergedList.addAll(getSysMenu_id());
        }
        if (getSysResources_id() != null&&getSysResources_id().size()>0) {
            mergedList.addAll(getSysResources_id());
        }
        return mergedList;
    }
}
