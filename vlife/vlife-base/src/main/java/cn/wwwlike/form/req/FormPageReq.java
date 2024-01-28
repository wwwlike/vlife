package cn.wwwlike.form.req;

import cn.wwwlike.form.entity.Form;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

@Data
public class FormPageReq  extends PageQuery<Form> {
    /**
     * 模型id
     */
    public String id;
    /**
     * 模型类型
     */
    public String itemType;
    /**
     * 关联实体名称
     */
    public String entityType;
    /**
     * 模型标识
     */
    public String type;
    /**
     * 所属应用
     */
    public String sysMenuId;
}
