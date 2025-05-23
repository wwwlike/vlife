package cn.vlife.common;

public interface IField {
    public String getEntityType();
    public String getId();
    public String getFieldName();
    public String getTitle();
    public String getFieldType();
    public String getJavaType();
    public String getDataType();
    public Integer getDbLength();
    public String getDictCode();
}
