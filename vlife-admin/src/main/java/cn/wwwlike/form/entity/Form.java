package cn.wwwlike.form.entity;

/**
 * 表单/列表/视图
 */

import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.objship.base.ItemInfo;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

/**
 * 模型在页面里的信息设置保存实体
 * 数据来源于模型解析和页面设置
 */
@Entity
@Data
@Table(name="form")
public class Form extends DbEntity {
    /**
     * 类型
     */
    public String type;
    /**
     * 关联实体
     */
    public String entityType;
    /**
     * 模型分类
     */
    public String itemType;
    /**
     * 模型名称
     */
    public String title;
    /**
     * 表单名称
     */
    public String name;
    /**
     * 使用场景
     */
    public String uiType;
    /**
     * 每行列数
     */
    public Integer gridSpan;


}
