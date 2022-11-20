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
 * 文件存储
 * <p>
 * event? : event,  // xhr event
 * fileInstance?: File, // original File Object which extends Blob, 浏览器实际获取到的文件对象(https://developer.mozilla.org/zh-CN/docs/Web/API/File)
 * name: string,
 * percent? : number, // 上传进度百分比
 * preview: boolean, // 是否根据url进行预览
 * response?: any, // xhr的response, 请求成功时为respoonse body，请求失败时为对应 error
 * shouldUpload?: boolean; // 是否应该继续上传
 * showReplace?: boolean, // 单独控制该file是否展示替换按钮
 * showRetry?: boolean, // 单独控制该file是否展示重试按钮
 * size: string, // 文件大小，单位kb
 * status: string, // 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait';
 * uid: string, // 文件唯一标识符，如果当前文件是通过upload选中添加的，会自动生成uid。如果是defaultFileList, 需要自行保证不会重复
 * url: string,
 * validateMessage?: ReactNode | string,
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
     * 存放文件名
     */
    public String fileName;
    /**
     * 访问地址
     * 动态拼装生成
     */
    public String url;

    /**
     * 文件大小
     */
    public String size;

    /**
     * 文件展现形式
     * 预留
     */
    public String viewMode;

}
