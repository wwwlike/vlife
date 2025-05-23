package cn.wwwlike.vlife.utils;
import cn.wwwlike.vlife.bean.ColumnInfo;
import cn.wwwlike.vlife.bean.DbTableInfo;
import cn.wwwlike.vlife.bean.IndexInfo;

import javax.persistence.Column;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class JpaAnnotationUtils {

    public static ColumnInfo getColumnInfo(Class<?> entityClass, String fieldName) {
        try {
            // 获取字段
            Field field = entityClass.getField(fieldName);
            // 根据字段类型构造相应的 getter 方法名
            String methodName;
            if (field.getType() == boolean.class ) {
                methodName = "is" + capitalizeFirstLetter(fieldName);
            } else {
                methodName = "get" + capitalizeFirstLetter(fieldName);
            }

            // 获取 getter 方法
            Method method = entityClass.getMethod(methodName);

            // 获取 @Column 注解
            Column columnAnnotation = method.getAnnotation(Column.class);
            if (columnAnnotation != null) {
                // 返回封装了注解信息的对象，包括新的属性
                return new ColumnInfo(
                        columnAnnotation.columnDefinition(),
                        columnAnnotation.nullable(),
                        columnAnnotation.length(),
                        columnAnnotation.name(),
                        columnAnnotation.unique()
                );
            } else {
                return null;
            }
        } catch (NoSuchFieldException e) {
            System.err.println("No such field: " + e.getMessage());
            return null;
        } catch (NoSuchMethodException e) {
            System.err.println("No such method: " + e.getMessage());
            return null;
        }
    }

    private static String capitalizeFirstLetter(String str) {
        if (str == null || str.length() == 0) {
            return str;
        }
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }

    public static DbTableInfo getTableInfo(Class<?> entityClass) {
        // 获取 @Table 注解
        Table tableAnnotation = entityClass.getAnnotation(Table.class);
        if (tableAnnotation != null) {
            // 提取索引信息
            Index[] indices = tableAnnotation.indexes();
            IndexInfo[] indexInfos = new IndexInfo[indices.length];
            for (int i = 0; i < indices.length; i++) {
                indexInfos[i] = new IndexInfo(indices[i].name(), indices[i].columnList().split(","));
            }
            return new DbTableInfo(
                    tableAnnotation.name()==null||"".equals(tableAnnotation.name())?convertToSnakeCase(entityClass.getSimpleName()):tableAnnotation.name(),
                    tableAnnotation.catalog(),
                    tableAnnotation.schema(),
                    tableAnnotation.uniqueConstraints(),
                    indexInfos
            );
        } else {
            System.out.println("Class does not have @Table annotation.");
            return null;
        }
    }

    @Table(name = "my_entity_table", catalog = "my_catalog", schema = "my_schema",
            uniqueConstraints = {@UniqueConstraint(columnNames = {"my_field"}, name = "uc_my_field")},
            indexes = {@Index(name = "idx_my_field", columnList = "my_field")})
    public static class MyEntity {
        private String myField;

        @Column(columnDefinition = "text", nullable = false, length = 255, name = "my_field", unique = true)
        public String getMyField() {
            return myField;
        }

        public void setMyField(String myField) {
            this.myField = myField;
        }
    }

    // 驼峰转下划线的方法
    public  static String convertToSnakeCase(String input) {
        StringBuilder result = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (Character.isUpperCase(c)) {
                if (result.length() > 0) {
                    result.append('_');
                }
                result.append(Character.toLowerCase(c));
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }

    public static void main(String[] args) {
        // 测试
        Class<MyEntity> clazz = MyEntity.class;
        ColumnInfo columnInfo = getColumnInfo(clazz, "myField");
        DbTableInfo tableInfo = getTableInfo(clazz);

        if (columnInfo != null) {
            System.out.println(columnInfo);
        }
    }


}