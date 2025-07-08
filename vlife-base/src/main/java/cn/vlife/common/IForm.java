package cn.vlife.common;

import java.util.List;
public interface IForm {
    public String getId();
    public String getTitle();
    public String getType();
    public String getEntityType();
    public String getItemType();
    public Integer getModelSize();
    public String getOrders();
    public String getCascadeDeleteEntityNames();
    public String  getTypeClass();
    public String getState();
    public List<? extends IField> getFields();
}
