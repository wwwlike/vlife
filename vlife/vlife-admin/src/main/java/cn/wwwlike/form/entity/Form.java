package cn.wwwlike.form.entity;

/**
 * 表单/列表/视图
 */

import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.objship.base.ItemInfo;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

/**
 * 模型表
 *  form->就是model
 * 所有分类模型，如在前端的表单(编辑和查询)和列表以何种形式展示需要再该表里配置
 * 数据来源于后端解析和页面维护的数据
 */
@Entity
@Data
@Table(name="form")
@VClazz(module = "conf")
public class Form extends DbEntity {

    //--------后端解析--------------
    /**
     * 模型代表字段
     *  label/title/name/id 按照这个优先级进行设置
     */
    public String labelField;
    /**
     * 模型标识
     */
    public String type;

    /**
     * 模型父类字符串集合
     */
    public String typeParentsStr;
    /**
     * 关联实体
     * 对应的实体模型标识
     */
    public String entityType;
    /**
     * 模型分类
     * req|entity|vo|dto
     */
    public String itemType;
    /**
     * 模型名称
     * type对应的名称，后端注释提取的
     */
    public String title;
    //模型的相关页面配置数据
    /**
     * 表单名称
     * 前端命名的
     */
    public String name;
    /**
     * 页面大小
     * 1. 对于form可以确定弹出层大小(tailwind的比例)
     * 2. field的gridSpan最小支持的约束
     */
    public Integer modelSize;
    /**
     * 分页数量
     * 0 表示列表不分页
     */
    public Integer pageSize;

    /**
     * 页面排序
     * 暂没有用
     */
    public Integer  sort;
    /**
     * 图标
     */
    public String  icon;
    /**
     * 模块
     * 字典：系统模块，业务模块等
     */
    public String module;
    /**
     * 版本
     * 保存一次版本加一
     */
    public Integer version;
    /**
     * 分页列表api代码路径
     */
    public String listApiPath;

    /**
     * 分页列表api代码路径
     */
    public String saveApiPath;

    /**
     * 编号前缀
     * 需要模型实现INo接口
     */
    public String prefixNo;

//    /**
//     * 紧凑布局
//     * terse
//     */
//    public boolean terse;


}
