package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 新闻
 */
@Data
@Entity
@Table(name = "oa_news")
public class OaNews extends DbEntity {
    /**
     * 标题
     */
    public String title;

    /**
     * 副标题
     */
    public String titleSub;
    /**
     * 封面
     */
    public String img;

    /**
     * 新闻内容
     */
    @Column(columnDefinition = "Text")
    public String content;

    /**
     *新闻分类
     */
    public String newsType;

    /**
     * 发布单位
     */
    public String sysOrgId;

    /**
     * 新闻状态
     */
    public String state;

    /**
     * 视频地址URL
     */
    public String videoUrl;

    /**
     * 优先级
     */
    public Integer sort;
}
