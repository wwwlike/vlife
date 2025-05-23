package cn.wwwlike.vlife.bean;

public class ColumnInfo {
    private String columnDefinition;  
    private boolean nullable;  
    private Integer length;
    private String name;  
    private boolean unique;  

    // Constructors  
    public ColumnInfo(String columnDefinition, boolean nullable, int length, String name, boolean unique) {  
        this.columnDefinition = columnDefinition;  
        this.nullable = nullable;  
        this.length = length;  
        this.name = name;  
        this.unique = unique;  
    }  

    // Getters  
    public String getColumnDefinition() {  
        return columnDefinition;  
    }  

    public boolean isNullable() {  
        return nullable;  
    }  

    public Integer getLength() {
        return length;  
    }  

    public String getName() {  
        return name;  
    }  

    public boolean isUnique() {  
        return unique;  
    }  

    @Override  
    public String toString() {  
        return "ColumnInfo{" +  
                "columnDefinition='" + columnDefinition + '\'' +  
                ", nullable=" + nullable +  
                ", length=" + length +  
                ", name='" + name + '\'' +  
                ", unique=" + unique +  
                '}';  
    }  
}  