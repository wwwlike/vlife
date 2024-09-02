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

package cn.wwwlike.form.vo;


import cn.wwwlike.form.dto.FormRuleDto;
import cn.wwwlike.form.dto.FormTabDto;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.VoBean;
import lombok.Data;

import java.util.List;

/**
 * 模型信息视图
 */
@Data
public class FormVo implements VoBean<Form> {
  public String id;

  public String labelField;

  /**
   * 元素中文信息
   */
  public String title;
  /**
   * 类型(clz)
   */
  public String type;
  /**
   * 实体clz
   */
  public String entityType;
  /**
   * 模型类型
   */
  public String itemType;

  public String name;
  /**
   * 图标
   */
  public String  icon;
  /**
   * 字段
   */
  public List<FormFieldVo> fields;
  /**
   * 页签
   */
  public List<FormTabDto> formTabDtos;

  //业务规则
  public List<FormRuleDto> rules;

  /**
   * 接口
   */
  public List<SysResources> resources;

  public String typeParentsStr;

  public Integer modelSize;

  public Integer  pageSize;

  /**
   * 版本
   * 保存一次版本加一
   */
  public Integer version;

  /**
   * 分页列表api代码路径
   */
  public String listApiPath;

  /**
   * 分页列表api代码路径
   */
  public String saveApiPath;

  /**
   * 编号前缀
   * 需要模型实现INo接口
   */
  public String prefixNo;

  /**
   * 模型的接口类
   */
//  @VField(skip = true)
//  public List<String> parentsName;
  /**
   * 上级表单
   * 作为子表单时（field表里的fieldType等于当前表单的name）
   */
  @VField(skip = true)
  public List<FormVo> parentForm;

  @VField(skip = true)
  public List<FormVo> subForm;

  public String  itemName;
  //模块归属应用
  public String sysMenuId;
  //表单使用说明
  public String formDesc;
  //开发帮助文档
  public String helpDoc;
  //流程脚本
  public String flowJson;
//  //流程定义key
//  public String flowDefineKey;
}
