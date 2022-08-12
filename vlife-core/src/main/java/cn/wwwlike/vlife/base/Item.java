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

import cn.wwwlike.base.model.IModel;
import cn.wwwlike.base.model.IdBean;

import java.util.Date;

/**
 * 数据库实体基类
 */
public interface Item extends IStatus, IdBean {
    public Date getCreateDate();

    public void setCreateDate(Date createDate);

    public Date getModifyDate();

    public void setModifyDate(Date modifyDate);

    public int hashCode();

    public boolean equals(Object obj);
}