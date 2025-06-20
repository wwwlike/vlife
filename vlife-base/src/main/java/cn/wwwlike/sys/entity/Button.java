package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 按钮
 * 没有绑定菜单则为系统按钮创建模型时生成
 */
@Setter
@Entity
@Table
@VClazz(remove = {ButtonField.class,SysTabButton.class})
public class Button extends DbEntity {
    /**
     * 页面
     * 有值表示自定义的页面级的按钮
     */
    public String sysMenuId;
    /**
     * 场景
     * 接口所在模型id(也可以是dto模型)
     */
    public String resourcesEntityId;
    /**
     * 触发动作
     * 采用接口
     */
    public String sysResourcesId;
    //按钮名称
    public String title;
    //图标
    public String icon;
    //按钮说明
    public String tooltip;
    /**
     * 动作类型
     * create|edit|api
     * 接口可以是表单类型，也可以改造为(api)类型需要进行配置，指定对表单的某个值做响应的设定
     */
    public String actionType;
    //表单模型
    public String model;
    //按钮启用条件
    public String conditionJson;
    /**
     * 表单可见字段
     * 如果是表单可指定仅修改部分字段可见,多字段之间逗号分隔
     */
    public String formFields;
    //不可用时隐藏
    public Boolean disabledHide;
    /*
     * 系统按钮
     */
    public Boolean sysBtn;

    @Column(columnDefinition = "text")
    public String getFormFields() {
        return formFields;
    }

    @Column(columnDefinition = "text")
    public String getConditionJson() {
        return conditionJson;
    }
    public String getSysMenuId() {
        return sysMenuId;
    }
    public String getSysResourcesId() {
        return sysResourcesId;
    }
    public String getTitle() {
        return title;
    }
    public String getIcon() {
        return icon;
    }
    public String getTooltip() {
        return tooltip;
    }
    public String getModel() {
        return model;
    }
    public String getActionType() {
        return actionType;
    }
    public String getResourcesEntityId() {
        return resourcesEntityId;
    }
    public Boolean getSysBtn() {
        return sysBtn;
    }
    public Boolean getDisabledHide() {
        return disabledHide;
    }
}
