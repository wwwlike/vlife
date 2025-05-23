package cn.wwwlike.sys.entity;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 按钮字段配置
 */
@Entity
@Table
@Data
public class ButtonField extends DbEntity {
   //字段
   public String formFieldId;
   //所在按钮
   public String buttonId;
   //字段值
   public String val;
   public String fieldName;
}
