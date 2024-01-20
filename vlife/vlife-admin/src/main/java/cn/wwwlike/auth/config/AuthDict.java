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
 * 平台字典
 * 用户可见，不可扩充，页面可翻译
 */
public class AuthDict {

    @Named("字典类目")
    public static final class vlife {
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

    @Named("数据维度")
    public static final class GROUP_FILTER_TYPE {
        @Named("查看本系统数据")
        public final static String ALL = "all";
        @Named("查看本人数据")
        public final static String SELF = "sysUser_1";
        @Named("查看同一权限组人员的数据")
        public final static String SAMEGROUP = "sysGroup_1";
        @Named("查看本部门数据")
        public final static String DEPT1 = "sysDept_1";
        @Named("查看本部门和下级部门数据")
        public final static String DEPT2 = "sysDept_2";
    }

    @Named("字典类型")
    public static final class DICT_TYPE{
        //CT VCT里的
        @Named("框架")
        public final static String VLIFE = "vlife";
        @Named("平台")
        public final static String ADMIN = "admin";
        //通过字段创建的
        @Named("业务")
        public final static String FIELD= "field";
    }

    @Named("对齐方式")
    public static final class COLUMN_ALGIN {
        @Named("左")
        public final static String LEFT="left";
        @Named("右")
        public final static String RIGHT="right";
        @Named("中")
        public final static String CENTER="center";
    }


//'amber' | 'blue' | 'cyan' | 'green' | 'grey' | 'indigo' | 'light-blue' | 'light-green' | 'lime' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'violet' | 'yellow' | 'white'; //颜色代码
    @Named("颜色")
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


    //xy轴体系的图表展示几个分析结果
    @Named("图表展示类型")
    public static final class GROUPS {
        @Named("计数")
        public final static String COUNT = "count";
        @Named("归总字段")
        public final static String NumField = "numField";
    }


    @Named("视图场景")
    public static final class CONDITION_TYPE{
        @Named("图表")
        public final static String REPORT = "report";
        @Named("列表")
        public final static String TABLE = "table";

    }

}
