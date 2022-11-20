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

package cn.wwwlike.form.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 通用报表service
 */
@Service
public class ReportService {
    @Autowired
    ReportItemService reportItemService;

    /**
     * 返回报表配置信息
     * 1.表头（嵌套表头）
     * 2.列头固定信息
     * 3.是否有行汇总
     * 4.是否有钻取
     * 5.表头说明信息
     * 6. 查询条件
     * 7. 报表title
     */
    public void reportTitle() {

    }

}
