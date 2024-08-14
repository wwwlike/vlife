package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 按钮
 */
@Setter
@Entity
@Table
public class Button extends DbEntity {
    //所在菜单
    public String sysMenuId;
    //模型 id
    public String formId;
    //接口
    public String sysResourcesId;
    //按钮名称
    public String title;
    //按钮表单名称
    public String formTitle;
    //表单模型
    public String model;
    //类型
    public String actionType;
    //样式
    public String btnType;
    //图标
    public String icon;
    //按钮说明
    public String remark;
    //处理多条记录
    public boolean multiple;
    //确认提醒
    public boolean submitConfirm;
    //禁用时隐藏
    public boolean disabledHide;
    //不可用时提示
    public String tooltip;
    //排序号
    public Integer sort;
    //完成后去到的场景页签
    public String toActiveTabKey;
    //按钮启用条件
    public String conditionJson;

    @Column(columnDefinition = "text")
    public String getConditionJson() {
        return conditionJson;
    }

    public String getSysMenuId() {
        return sysMenuId;
    }

    public String getFormId() {
        return formId;
    }

    public String getSysResourcesId() {
        return sysResourcesId;
    }

    public String getTitle() {
        return title;
    }

    public String getFormTitle() {
        return formTitle;
    }

    public String getModel() {
        return model;
    }

    public String getActionType() {
        return actionType;
    }

    public String getBtnType() {
        return btnType;
    }

    public String getIcon() {
        return icon;
    }

    public String getRemark() {
        return remark;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public boolean isSubmitConfirm() {
        return submitConfirm;
    }

    public boolean isDisabledHide() {
        return disabledHide;
    }

    public String getTooltip() {
        return tooltip;
    }

    public Integer getSort() {
        return sort;
    }

    public String getToActiveTabKey() {
        return toActiveTabKey;
    }
}
