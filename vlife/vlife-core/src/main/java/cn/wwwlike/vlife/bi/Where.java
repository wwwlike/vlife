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

package cn.wwwlike.vlife.bi;

import cn.wwwlike.vlife.objship.read.GlobalData;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/11/3
 */
@Data
public class Where {
    /**
     * 条件字段所在实体名称
     * 空则和condition/group的entityName保持一致
     */
    public String entityName;
    /**
     * 字段名
     **/
    public String fieldName;
    /**
     * 字段类型
     */
    public String fieldType;
    /**
     * 模型名称
     */
    public String path;

    public Class clazz;
    /**
     * 匹配方式
     */
    public String opt;
    /**
     * 转换函数
     */
    public String tran;
    /**
     * 匹配字段值
     */
    public Object[] value;
    /**
     * 字段信息
     */
    public String fieldDto;

    // fieldName opt value
    public Object desc;

    public Class getClazz(){
        return
        StringUtils.isNotBlank(this.getEntityName())?
         GlobalData.entityDto(this.getEntityName()).getClz():null;
    }

}