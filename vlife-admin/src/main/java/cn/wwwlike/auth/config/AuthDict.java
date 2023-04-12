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

import javax.inject.Named;

/**
 * 业务字典，用户可以对该字典进行维护
 */
public class AuthDict {
    @Named("用户类型")
    public static final class USER_TYPE {
    }

    @Named("项目阶段")
    public static final class PROJECT_STATE {
    }

    @Named("地区类型")
    public static final class AREA_LEVEL {
        @Named("省")
        public final static String PROVINCE = "1";
        @Named("市/州")
        public final static String CITY = "2";
        @Named("县/区")
        public final static String COUNTY = "3";
        @Named("乡镇/街")
        public final static String TOWN = "4";
        @Named("村/社区")
        public final static String VILLAGE = "5";
    }

    @Named("机构分类")
    public static final class ORG_TYPE {

    }

//    @Named("数据维度")
//    public static final class GROUP_SCOPE {
//        @Named("查看本地区和下级地区数据")
//        public final static Integer AREAS = 6;
//        @Named("查看本地区数据")
//        public final static Integer AREA = 5;
//        @Named("查看本机构和下级机构数据")
//        public final static Integer ORGS = 4;
//        @Named("查看本机构数据")
//        public final static Integer ORG = 3;
//        @Named("查看本部门和下级部门数据")
//        public final static Integer DEPTS = 2;
//        @Named("查看本部门数据")
//        public final static Integer DEPT = 1;
//        @Named("查看本人数据")
//        public final static Integer SELF = 0;
//    }

    @Named("数据维度")
    public static final class GROUP_FILTER_TYPE {
        @Named("查看本系统数据")
        public final static String ALL = "";
        @Named("查看本人数据")
        public final static String SELF = "sysUser_1";
        @Named("查看同一权限组人员的数据")
        public final static String SAMEGROUP = "sysGroup_1";
        @Named("查看本部门数据")
        public final static String DEPT1 = "sysDept_1";
        @Named("查看本部门和下级部门数据")
        public final static String DEPT2 = "sysDept_2";
    }


    @Named("分组字段")
    public static final class GROUPS {
        @Named("创建用户")
        public final static String CREATREID = "createId";
        @Named("机构")
        public final static String SYSORGID = "sysOrgId";
        @Named("部门")
        public final static String SYSDEPTID = "sysDeptId";
    }

    @Named("系统模块")
    public static final class MODULE {
        @Named("系统管理")
        public final static String SYS = "sys";
        @Named("运维配置")
        public final static String CONF = "conf";
        @Named("统计分析")
        public final static String REPORT = "report";
        @Named("网站新闻")
        public final static String CMS = "cms";
        @Named("OA系统")
        public final static String OA = "oa";
    }
//'amber' | 'blue' | 'cyan' | 'green' | 'grey' | 'indigo' | 'light-blue' | 'light-green' | 'lime' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'violet' | 'yellow' | 'white'; //颜色代码
    @Named("字典颜色")
    public static final class DICT_COLOR {
        @Named("红")
        public final static String RED = "red";
        @Named("黄")
        public final static String YELLOW = "yellow";
        @Named("绿")
        public final static String GREEN = "green";
        @Named("蓝")
        public final static String BLUE = "blue";
        @Named("白")
        public final static String WHITE = "white";
    }
}
