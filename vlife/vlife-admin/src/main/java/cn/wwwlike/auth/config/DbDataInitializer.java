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

package cn.wwwlike.auth.config;

import cn.wwwlike.auth.service.SysResourcesService;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.sys.service.SysDeptService;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
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
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 数据初始化
 */
@Component
@Order(1)
public class DbDataInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final DataSource dataSource;
    @Autowired
    private Environment env;

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
    //是否空库
    public boolean isDatabaseEmpty() {
        List<Map<String, Object>> tables =new ArrayList<>();
        if("Oracle".equals(getDatabaseType())){
            tables=  jdbcTemplate.queryForList("SELECT table_name FROM user_tables");
        }else if("MySQL".equals(getDatabaseType())){//mysql
            tables = jdbcTemplate.queryForList("SHOW TABLES");
        }else{//未知数据库，不允许做数据初始化
            return false;
        }
        for (Map<String, Object> table : tables) {
            String tableName = table.values().iterator().next().toString();
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableName, Integer.class);
            if (count != null && count > 0) {
                return false; // 只要有一个表不为空，就返回false
            }
        }
        return true; // 所有表都为空，返回true
    }

    public String getActiveProfile() {
        return env.getProperty("spring.profiles.active");
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

    public void dataRestore()  throws IOException {
        Set<String> table=new HashSet<String>();
        ResourcePatternResolver resolver = ResourcePatternUtils.getResourcePatternResolver(resourceLoader);
        String  dbType=getDatabaseType();
        Resource[] resources = resolver.getResources("classpath:initData.sql");
        if (resources.length > 0) {
            EncodedResource encodedResource = new EncodedResource(resources[0], "UTF-8");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(encodedResource.getInputStream()))) {
                String line;
                StringBuilder sqlBuilder = new StringBuilder();
                while ((line = reader.readLine()) != null) {
//                   sqlBuilder.append(line).append("\n");  // 每行加上换行符\
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
                        }
                        try{
//                            line="INSERT INTO form (id, create_date, create_id, modify_date, modify_id, status, entity_type, icon, item_type, label_field, list_api_path, model_size, module, name, page_size, prefix_no, save_api_path, sort, title, type, type_parents_str, version, item_name) VALUES ('4028b8818aea03bb018aea03c84f00f9', TO_TIMESTAMP('2023-10-01 14:54:44.000', 'YYYY-MM-DD HH24:MI:SS.FF3'), NULL, TO_TIMESTAMP('2023-10-01 14:54:44.000', 'YYYY-MM-DD HH24:MI:SS.FF3'), NULL, '1', 'sysFile', NULL, 'entity', NULL, NULL, 2, 'sys', '文件存储', 10, NULL, NULL, NULL, '文件存储', 'sysFile', NULL, NULL, NULL);";
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


    @Override
    public void run(ApplicationArguments args) throws Exception {
        //启动时判断是否是空库
        if(isDatabaseEmpty()){
            dataRestore();
        }
    }
}