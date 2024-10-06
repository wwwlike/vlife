package cn.wwwlike.form;

public interface IField {
    public String getEntityType();
    public String getId();
    public String getFieldName();
    public String getTitle();
    public String getJavaType();
    public int getDbLength();
}
