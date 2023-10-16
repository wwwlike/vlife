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
 * 业务字典
 * 用户可见可扩充，本类定义的不可修改和删除
 *
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

    @Named("资源类型")
    public static final class SYSRESOURCES_TYPE {
        @Named("菜单")
        public final static String MENU = "1";
        @Named("接口")
        public final static String API = "2";
    }


}
