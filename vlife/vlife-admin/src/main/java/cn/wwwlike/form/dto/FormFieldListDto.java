package cn.wwwlike.form.dto;

import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.vlife.base.SaveBean;
import lombok.Data;

/**
 * 列表设置dto
 */
@Data
public class FormFieldListDto implements SaveBean<FormField> {
    public String id;
    /**
     * 列显示
     */
    public Boolean listShow;
    /**
     * 列宽
     */
    public Integer listWidth;
    /**
     * 是否金额
     */
    public Boolean money;

    /**
     * 对齐方式
     */
    public String listAlign;

    /**
     * 字符加密
     */
    public boolean safeStr;

    /**
     * 列搜索
     */
    public boolean listSearch;

}
