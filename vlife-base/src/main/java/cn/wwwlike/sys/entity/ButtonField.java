package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 按钮字段配置
 * 自定义按钮触发指定字段的赋值配置
 */
@Entity
@Table
@Data
public class ButtonField extends DbEntity {
   //字段
   public String formFieldId;
   //按钮
   public String buttonId;
   //赋值
   public String val;
   /**
    * 字段名
    * 冗余：前端绑定用
    */
   public String fieldName;
}
