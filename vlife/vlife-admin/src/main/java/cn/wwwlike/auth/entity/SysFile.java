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

package cn.wwwlike.auth.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 文件
 */
@Entity
@Table(name = "sys_file")
@Data
public class SysFile extends DbEntity {
    /**
     * 原文件名
     */
    public String name;
    /**
     * 另存名
     */
    public String fileName;
    /**
     * 文件访问地址
     */
    public String url;
    /**
     * 文件大小
     */
    public String fieldSize;
    /**
     * 文件展现形式
     * 预留
     */
    public String viewMode;
    /**
     * 所属项目
     */
    public String projectId;

}
