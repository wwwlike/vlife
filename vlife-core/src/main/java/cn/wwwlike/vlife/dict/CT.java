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

package cn.wwwlike.vlife.dict;

import lombok.Data;

import javax.inject.Named;

/**
 * 框架底层字典
 * 用户不可见，不可扩充，页面可翻译
 */
@Data
public class CT {
    //逻辑删除使用
    @Named("数据状态")
    public static final class STATUS {
        @Named("删除")
        public final static String REMOVE = "0";
        @Named("正常")
        public final static String NORMAL = "1";
    }

    //逻辑删除使用
    @Named("是否")
    public static final class TF {
        @Named("是")
        public final static String T = "1";
        @Named("否")
        public final static String F = "0";
    }

    @Named("业务状态")
    public static final class STATE {
        @Named("正常")
        public final static String NORMAL = "1";
        @Named("停用")
        public static final String DISABLE = "-1";
    }

    @Named("接口授权方式")
    public static final class RESOURCES_PERMISSION{
        @Named("独立授权")
        public final static String SINGLE = "single";
        @Named("无需授权")
        public static final String NOAUTH = "noAuth";
        @Named("继承授权")
        public static final String EXTEND = "extend";
    }


//    @Named("角色组数据查询维度")
//    public static final class DEFAULT_LEVEL {
//        @Named("查看本系统数据")
//        public final static String ALL = "1";
//        @Named("查看本部门和下级部门数据")
//        public final static String DEPT_TREE = "2";
//        @Named("查看本部门数据")
//        public final static String DEPT_SELF = "3";
//        @Named("查看本人数据")
//        public final static String SELF = "4";
//    }

    @Named("数据范围")
    public static final class DATA_LEVEL {
        @Named("全部数据")
        public final static String ALL = "1";
        @Named("当前用户所在部门发起的数据")
        public final static String DEPT = "2";
        @Named("当前用户发起的数据")
        public final static String USER = "3";
        @Named("根据用户角色的权限筛选数据")
        public final static String BY_GROUP = "4";
    }

    @Named("排序方式")
    public static final class ORDER_TYPE {
        @Named("系统默认排序")
        public final static String SYS = "SYS";
        @Named("自定义字段排序")
        public final static String CUSTOM = "CUSTOM";
    }

    @Named("排序方向")
    public static final class ORDER_DIRECTION {
        @Named("升序")
        public final static String ASC = "asc";
        @Named("降序")
        public final static String DESC = "desc";
    }

}
