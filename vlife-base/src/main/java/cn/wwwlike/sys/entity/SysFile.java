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

package cn.wwwlike.sys.entity;

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
     * 系统唯一名
     */
    public String fileName;
    /**
     * 文件访问地址
     */
    public String url;
    /**
     * 文件大小
     */
    public long fileSize;
    /**
     * 文件展现形式
     * 预留
     */
    public String viewMode;
    /**
     * 文件类别
     * 归类，同一业务可以有不同类别场景的文件，如人才关联了合同类，基本信息类
     */
    public String type;
    /**
     * 关联业务id
     * 多对1时使用该字段
     */
    public String relationId;
    /**
     * 业务id
     * 主体业务id(relation是实际业务的，project是该业务挂载关联的如：project是客户，relation是客户下的订单,那么要看客户所有的文件就只用project)
     */
    public String projectId;


}
