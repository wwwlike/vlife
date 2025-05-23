package cn.wwwlike.sys.req;

import cn.wwwlike.sys.entity.Form;
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
    //所属应用
    public String sysAppId;
    /**
     * 所属菜单
     * 页面模型
     */
//    public String sysMenuId;
//    //是否模型
//    public Boolean model;
}
