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

package cn.wwwlike.sys.dto;
import cn.vlife.common.IForm;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 表单保存对象
 * @author xiaoyu
 * @date 2022/9/22
 */
@Data
public class FormDto extends SaveBean<Form> implements IForm {
    public String sysAppId;
    public String sysMenuId;
    public String title;
    public String type;
    public String typeClass;
    public String typeParentsStr;
    public String state;
    public String entityId;
    public String itemType;
    public Integer modelSize;
    public String orders;
    public String formDesc;
    public String helpDoc;
    public String unpublishForm;
    public List<FormFieldDto> fields;
    public Boolean terse;
    public String entityType;
    public String tableName;
    //pro
    public String cascadeDeleteEntityNames;
    public String flowJson;
    public String unpublishJson;
}
