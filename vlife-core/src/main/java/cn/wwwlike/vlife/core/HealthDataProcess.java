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

package cn.wwwlike.vlife.core;

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.dict.CT;

import java.util.Date;
import java.util.Map;

/**
 * 数据保存之前必须回调的类
 */
public class HealthDataProcess extends DataProcess {
    public HealthDataProcess(IdBean bean) {
        super(bean);
    }

    /**
     * 本业务场景里，保存新增通用字段值设置
     */
    @Override
    public void commonDataSet(IdBean bean, Map<String, Object> mm) {
        if (bean.getId() == null) {
            mm.put("createDate", new Date());
            mm.put("status", CT.STATUS.NORMAL);
        } else {
            mm.put("modifyDate", new Date());
        }
    }


}
