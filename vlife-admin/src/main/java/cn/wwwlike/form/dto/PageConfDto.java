package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.PageComponent;
import cn.wwwlike.form.entity.PageLayout;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.objship.dto.SaveDto;
import lombok.Data;

import java.util.List;

@Data
public class PageConfDto implements SaveBean<PageLayout> {
    public String id;
    public List<PageComponentDto> content;
}
