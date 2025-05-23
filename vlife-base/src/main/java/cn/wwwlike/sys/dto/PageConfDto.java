package cn.wwwlike.sys.dto;
import cn.wwwlike.sys.dto.PageComponentDto;
import cn.wwwlike.sys.entity.PageLayout;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;
import java.util.List;

/**
 * 页面配置模型
 */
@Data
public class PageConfDto extends SaveBean<PageLayout> {
    public String name;
    public String url;
    public String img;
    public Boolean module;
    public Boolean border;
    public Boolean componentOver;
    public Boolean bigScreen;
    public String pageType;
    public Integer h;
    public List<PageComponentDto> content;
}
