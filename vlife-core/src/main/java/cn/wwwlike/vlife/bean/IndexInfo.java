package cn.wwwlike.vlife.bean;

import javax.persistence.Index;
import java.util.Arrays;

public class IndexInfo {  
    private String name;  
    private String[] columns;  
    public IndexInfo(String name, String[] columns) {
        this.name = name;  
        this.columns = columns;  
    }  

    public String getName() {  
        return name;  
    }  

    public String[] getColumns() {  
        return columns;  
    }  

    @Override  
    public String toString() {  
        return "IndexInfo{" +  
                "name='" + name + '\'' +  
                ", columns=" + Arrays.toString(columns) +
                '}';  
    }  
}