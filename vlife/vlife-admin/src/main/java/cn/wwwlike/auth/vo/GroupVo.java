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

package cn.wwwlike.auth.vo;

import cn.wwwlike.auth.entity.SysGroup;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 权限组数据对象封装
 *
 */
@Data
public class GroupVo implements VoBean<SysGroup> {
    public String id;
    public String filterType;
    /**
     * 通过权限组查找对应的资源信息
     */
    /**
     * 权限组关联资源
     */
    @VField(pathName = "sysGroupResources_sysResources")
    public List<SysResources> resources;
    /**
     * 权限组关联资源code集合
     */
    public List<String> sysGroupResources_sysResources_code;
    /**
     * 权限组关联资源对应的菜单id集合
     */
    public List<String> sysGroupResources_sysResources_sysMenuId;



}
