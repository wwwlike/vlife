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

import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import java.util.Date;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/8/10
 */
@Data
public class VlifeEntity extends DbEntity {
    /**
     * 创建人
     */
    @VField(pathName = "sysUserId")
    public String createId;
    /**
     * 修改人
     */
    @VField(pathName = "sysUserId")
    public String modifyId;
    /**
     * 记录创建日期
     */
    public Date createDate;
    /**
     * 最近修改日期
     */
    public Date modifyDate;

    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    public String getModifyId() {
        return modifyId;
    }

    public void setModifyId(String modifyId) {
        this.modifyId = modifyId;
    }

}
