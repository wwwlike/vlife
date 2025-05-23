package cn.wwwlike.sys.entity;

import cn.vlife.common.IFormReaction;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Setter;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 表单响应规则
 */
@Entity
@Setter
@Table(name = "form_reaction")
public class FormReaction extends DbEntity implements IFormReaction {
    //联动字段
    public String formFieldId;
    //字段标识
    public String fieldName;
    //联动属性
    public String propName;
    //联动属性值
    public String propValue;
    //标题
    public String label;
    /**
     * 依赖条件
     * 依赖其他字段数据值逻辑满足的情况
     */
    public String conditionJson;
    /**
     * 用户条件数组
     * 用户属性,in/notIn,用户属性值-> sysUserIds,in,userId1,userId2,userid3 ->表示当用户在user1,2,3条件下当前联动属性成立
     */
    public String conditionArray;
    /**
     * 限定输入格式
     * 正则表达式(fieldName本身值满足正则规则的情况)
     */
    public String regexStr;

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFormFieldId() {
        return formFieldId;
    }

    @Column(columnDefinition = "text")
    public String getConditionJson() {
        return conditionJson;
    }

    @Column(columnDefinition = "text")
    public String getConditionArray() {
        return conditionArray;
    }

    public String getPropName() {
        return propName;
    }

    @Column(length = 255)
    public String getPropValue() {
        return propValue;
    }

    public String getLabel() {
        return label;
    }
    public String getRegexStr() {
        return regexStr;
    }
}
