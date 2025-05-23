package cn.wwwlike.vlife.bean;

import javax.persistence.UniqueConstraint;
import java.util.Arrays;

public class DbTableInfo {
    private String name;//表名
    private String catalog; //数据库
    private String schema;
    private UniqueConstraint[] uniqueConstraints;//不重复的列
    private IndexInfo[] indexes;  // 索引信息

    public DbTableInfo(String name, String catalog, String schema, UniqueConstraint[] uniqueConstraints, IndexInfo[] indexes) {
        this.name = name;
        this.catalog = catalog;
        this.schema = schema;
        this.uniqueConstraints = uniqueConstraints;
        this.indexes = indexes;
    }

    // Getters  
    public String getName() {
        return name;
    }

    public String getCatalog() {
        return catalog;
    }

    public String getSchema() {
        return schema;
    }

    public UniqueConstraint[] getUniqueConstraints() {
        return uniqueConstraints;
    }

    public IndexInfo[] getIndexes() {
        return indexes;
    }

    @Override
    public String toString() {
        StringBuilder uniqueConstraintsString = new StringBuilder();
        for (UniqueConstraint constraint : uniqueConstraints) {
            uniqueConstraintsString.append("UniqueConstraint(columns=").append(Arrays.toString(constraint.columnNames()))
                    .append(", name=").append(constraint.name()).append("), ");
        }
        StringBuilder indexesString = new StringBuilder();
        for (IndexInfo index : indexes) {
            indexesString.append(index.toString()).append(", ");
        }
        return "TableInfo{" +
                "name='" + name + '\'' +
                ", catalog='" + catalog + '\'' +
                ", schema='" + schema + '\'' +
                ", uniqueConstraints=[" + uniqueConstraintsString + "]" +
                ", indexes=[" + indexesString + "]" +
                '}';
    }
}