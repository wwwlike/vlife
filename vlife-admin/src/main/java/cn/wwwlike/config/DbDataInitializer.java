/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.config;
import cn.wwwlike.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 数据初始化(暂不启用)
 */
@Component
@Order(1)
public class DbDataInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final DataSource dataSource;
    @Autowired
    private SysUserService userService;
    @Autowired
    private Environment env;

    public String getActiveProfile() {
        return env.getProperty("spring.profiles.active");
    }

    public DbDataInitializer(JdbcTemplate jdbcTemplate,ResourceLoader resourceLoader,DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader=resourceLoader;
        this.dataSource=dataSource;
    }
    //数据库类型
    public String getDatabaseType() {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            String databaseType = metaData.getDatabaseProductName();
            return databaseType;
        }catch (SQLException e) {
            return "Unknown";
        }
    }

    //获得所有表信息
    public List<Map<String, Object>> getAllTable(){
        List<Map<String, Object>> tables =new ArrayList<>();
        if("Oracle".equals(getDatabaseType())){
            tables=  jdbcTemplate.queryForList("SELECT table_name FROM user_tables");
        }else if("MySQL".equals(getDatabaseType())){//mysql
            tables = jdbcTemplate.queryForList("SHOW TABLES");
        }
        return tables;
    }

    public void clearTable(){
        List<Map<String, Object>> tables =getAllTable();
        for (Map<String, Object> table : tables) {
            String tableName = table.values().iterator().next().toString();
            //工作流不删除
            if(!tableName.startsWith("act_")){
                jdbcTemplate.execute("delete from "+tableName+"");
            }
        }
    }

    //是否空库
    public boolean isDatabaseEmpty() {
        return userService.findAll().size()==0;
//        List<Map<String, Object>> tables =getAllTable();
//        if(tables.size()==0){
//            return false;
//        }
//        for (Map<String, Object> table : tables) {
//            String tableName = table.values().iterator().next().toString();
//            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableName, Integer.class);
//            if (count != null && count > 0) {
//                return false; // 只要有一个表不为空，就返回false
//            }
//        }
//        return true; // 所有表都为空，返回true
    }


    //转成oracle的insert语句
    public static String convertToOracleInsert(String mysqlInsert) {
        String oracleInsert = mysqlInsert.replaceAll("`","");;
        // 匹配日期时间格式 yyyy-MM-dd HH:mm:ss.SSSSSS
        Pattern datePattern = Pattern.compile("'(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d+)'");
        Matcher dateMatcher = datePattern.matcher(oracleInsert);
        if (dateMatcher.find()) {
            String dateTime = dateMatcher.group(1);
            try {
                SimpleDateFormat mysqlDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSSSS");
                SimpleDateFormat oracleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                String formattedDateTime = oracleDateFormat.format(mysqlDateFormat.parse(dateTime));
                oracleInsert = dateMatcher.replaceAll("TO_TIMESTAMP('" + formattedDateTime + "', 'YYYY-MM-DD HH24:MI:SS.FF3')");
            } catch (ParseException e) {
                // 日期格式解析失败
                e.printStackTrace();
            }
        }
        // 匹配字符串类型长度
        oracleInsert = oracleInsert.replace("\\\"", "\"");
        // 替换布尔类型
        oracleInsert = oracleInsert.replace("b'0'", "0");
        oracleInsert = oracleInsert.replace("b'1'", "1");
        return oracleInsert.substring(0,oracleInsert.length()-1);
    }


    //转成oracle的insert语句
    public static String convertToSqlServerInsert(String mysqlInsert) {
        mysqlInsert = mysqlInsert.replace("\\\"", "\"");
        // 替换布尔类型
        mysqlInsert = mysqlInsert.replace("b'0'", "0");
        mysqlInsert = mysqlInsert.replace("b'1'", "1");
        return mysqlInsert.replaceAll("`","");
    }

    public void dataRestore()  throws IOException {
        Set<String> table=new HashSet<String>();
        ResourcePatternResolver resolver = ResourcePatternUtils.getResourcePatternResolver(resourceLoader);
        String  dbType=getDatabaseType();
        Resource[] resources = resolver.getResources("classpath:initData/*.sql");
        if (resources.length > 0) {
            for(Resource resource:resources){
                EncodedResource encodedResource = new EncodedResource(resource, StandardCharsets.UTF_8);
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(encodedResource.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    StringBuilder sqlBuilder = new StringBuilder();
                    while ((line = reader.readLine()) != null) {
                        if(line!=null&& line.startsWith("INSERT")){
                            Pattern pattern = Pattern.compile("`(.*?)`");
                            Matcher matcher = pattern.matcher(line);
                            if (matcher.find()) {
                                String tableName = matcher.group(1);
                                if(table.contains(tableName)==false){
                                    jdbcTemplate.execute("delete from "+tableName+"");
                                    table.add(tableName);
                                }
                            }
                            if("Oracle".equals(dbType)){
                                line=convertToOracleInsert(line);
                            }else if("Microsoft SQL Server".equals(dbType)){
                                line=convertToSqlServerInsert(line);
                            }
                            try{
                                jdbcTemplate.execute(line);
                            }catch (Exception ex){
                                System.out.println(line);
                                ex.printStackTrace();

                            }
                        }
                    }
                }
            }
        }
    }

    //暂时不采用自动化创建库
    @Override
    public void run(ApplicationArguments args) throws Exception {
        //启动时判断是否是空库 !getActiveProfile().equals("pro")&&
//        if(isDatabaseEmpty()){
//            dataRestore();
//        }
    }
}