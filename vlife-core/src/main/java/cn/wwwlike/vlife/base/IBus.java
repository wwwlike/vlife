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

package cn.wwwlike.vlife.base;

/**
 * bussiess 业务实体实现该接口，
 * 则拥有机构、地区、部门
 * 创建记时候记录这些信息
 * 需要数据隔离（租户）的业务实现该接口
 */
public interface IBus {
    public String getSysAreaId();
    public String getSysOrgId();
    public String getSysDeptId();
}
