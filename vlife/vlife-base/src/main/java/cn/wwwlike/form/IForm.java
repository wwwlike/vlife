package cn.wwwlike.form;
import java.util.List;
public interface IForm {
    public String getId();
    public String getLabelField();
    public String getTitle();
    public String getType();
    public String getEntityType();
    public String getItemType();
    public String getName();
    public String getIcon();
    public Integer getModelSize();
    public Integer getPageSize();
    public String getPrefixNo();
    public Boolean getCustom();
    public String getOrders();
    public List<? extends IField> getFields();
}
