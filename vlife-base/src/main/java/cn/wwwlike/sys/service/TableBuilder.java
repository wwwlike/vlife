package cn.wwwlike.sys.service;

import cn.vlife.common.IField;
import cn.wwwlike.vlife.utils.JpaAnnotationUtils;
import org.springframework.stereotype.Component;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class TableBuilder {
    @PersistenceContext
    private EntityManager entityManager;

    public static String replaceNumberInBrackets(String input, Integer replacement) {
        // 正则表达式匹配括号中的数字
        return input.replaceAll("\\(\\d+\\)", replacement!=null?"(" + replacement + ")":"");
    }

    /**
     * 同步数据库字段。
     * 当前数据库字段信息与最近一次数据库字段进行比对，然后更新数据库物理的精度和备注。
     * 注意：此操作不支持更改字段类型，也不允许减少字段精度。
     *
     * @param currentField 当前待同步的字段。
     * @param lastField 上一次的字段，用于比较。
     */
    public void dbFieldSync(String tableName, IField currentField, IField lastField, String dbFieldType){
        //注释发生变化
         boolean descChange=lastField==null?true:(lastField==null&&currentField!=null&& currentField.getTitle()!=null)
                 ||(lastField!=null&&currentField!=null&&!currentField.getTitle().equals(lastField.getTitle()));
         boolean lengthChange=lastField==null?false:currentField.getDbLength()!=null&&currentField.getDbLength().intValue()!=lastField.getDbLength().intValue();
        //字段注释和精度更新
//        if(descChange || lengthChange){//字段长度发生变化
//            if(lengthChange){
                dbFieldType=  replaceNumberInBrackets(dbFieldType,currentField.getDbLength());
//            }
            String sql = String.format("ALTER TABLE %s MODIFY COLUMN %s %s COMMENT '%s'",
                    tableName,
                    JpaAnnotationUtils.convertToSnakeCase(currentField.getFieldName()),//改下划线
                    dbFieldType, currentField.getTitle());
        System.out.println(sql);
            entityManager.createNativeQuery(sql).executeUpdate();
//        }
    }


    /**
     * 获取表字段信息
     * @param tableName 表名
     * @return 表字段信息列表
     */
    public List<Map<String, String>> getTableColumns(String tableName) {
        List<Map<String, String>> columns = new ArrayList<>();
        String sql = String.format("SHOW COLUMNS FROM %s",  JpaAnnotationUtils.convertToSnakeCase(tableName));
        try{
        List<Object[]> results = entityManager.createNativeQuery(sql).getResultList();
            for (Object[] row : results) {
                Map<String, String> columnInfo = new HashMap<>();
                columnInfo.put("Field", (String) row[0]);   // 字段名称
                columnInfo.put("Type", (String) row[1]);    // 字段类型
                columnInfo.put("Comment", (String) row[3]); // 字段注释
                columns.add(columnInfo);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return columns;
    }

}