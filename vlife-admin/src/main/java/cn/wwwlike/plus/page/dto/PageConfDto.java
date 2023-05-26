package cn.wwwlike.plus.page.dto;
import cn.wwwlike.form.dto.PageComponentDto;
import cn.wwwlike.plus.page.entity.PageLayout;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

import java.util.List;

/**
 * 页面配置模型
 */
@Data
public class PageConfDto implements SaveBean<PageLayout> {
    public String id;
    public String name;
    public String url;
    public Boolean auth;
    public Boolean module;
    public Integer h;
    public String img;
    public String bgColor;
    public Boolean border;
    public Boolean componentOver;
    public List<PageComponentDto> content;
}
