package cn.wwwlike.form.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 按钮字段配置
 */
@Data
@Entity
@Table
public class ButtonField extends DbEntity {
    //字段名
    public String fieldName;
    //值类型
    public String valType;
    //设定值
    public String val;
    //描述
    public String remark;
}
