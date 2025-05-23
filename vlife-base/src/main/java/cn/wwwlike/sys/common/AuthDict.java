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

package cn.wwwlike.sys.common;

import javax.inject.Named;

/**
 * 平台字典
 * 用户可见，不可扩充，页面可翻译
 */
public class AuthDict {

    @Named("字典类目")
    public static final class vlife {
    }

    @Named("角色组数据查询维度")
    public static final class DEFAULT_LEVEL {
        @Named("查看本系统数据")
        public final static String ALL = "1";
        @Named("查看本部门和下级部门数据")
        public final static String DEPT_TREE = "2";
        @Named("查看本人数据")
        public final static String SELF = "3";
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

    @Named("对齐方式")
    public static final class COLUMN_ALGIN {
        @Named("左")
        public final static String LEFT="left";
        @Named("右")
        public final static String RIGHT="right";
        @Named("中")
        public final static String CENTER="center";
    }

    @Named("访问权限级别")
    public static final class Access {
        @Named("可编辑")
        public final static String Writeable="Writeable";
        @Named("仅可见")
        public final static String Readable="Readable";
        @Named("隐藏")
        public final static String HIDE="hide";
    }

    @Named("列表按钮展示位置")
    public static final class FORM_SHOW_TYPE {
        @Named("在表格右侧显示")
        public final static String SINGLE_TABLE = "single_table";
        @Named("点击记录后详情页显示")
        public final static String RELATION_SUBS = "relation_subs";
    }

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
        @Named("黑")
        public final static String BLACK = "black";
        @Named("紫")
        public final static String PURPLE = "purple";
        @Named("橙")
        public final static String ORANGE = "orange";
        @Named("粉")
        public final static String PINK = "pink";
        @Named("灰")
        public final static String GRAY = "gray";
        @Named("棕")
        public final static String BROWN = "brown";
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

    @Named("流程办理人类型")
    public static final class FLOW_USER_TYPE{
        @Named("指定人员")
        public final static String DESIGNEE = "designee";
        @Named("流程发起人")
        public final static String STARTER = "starter";
        @Named("发起人部门主管")
        public final static String START_LEADER = "start_leader";
        @Named("指定权限组")
        public final static String GROUP = "group";
        @Named("指定部门")
        public final static String DEPT = "dept";
    }

    @Named("会签类型")
    public static final class FLOW_JOIN_TYPE{
        @Named("会签(按比例通过)")
        public final static String ALL_ORDER_AUDIT = "all_order_audit";
        @Named("会签(需全所有负责人通过)")
        public final static String ALL_AUDIT = "all_audit";
        @Named("或签(一名负责人同意/拒绝即可)")
        public final static String ONE_AUDIT = "one_audit";
    }

    @Named("办理人为空策略")
    public static final class FLOW_AUDIT_EMPTY{
        @Named("自动通过")
        public final static String PASS = "pass";
        @Named("自动驳回")
        public final static String BACK = "back";
    }

    @Named("办理人员类型")
    public static final class FLOW_HANDLE_TYPE{
        @Named("常规审批")
        public final static String GENERAL= "general";
        @Named("逐级审批")
        public final static String MULTI_LEVEL = "multilevel";
    }

    @Named("节点审核状态")
    public static final class FLOW_NODE_STATUS{
        @Named("进行中")
        public final static String  todo="todo";
        @Named("已通过")
        public final static String finish = "pass";
        @Named("已退回")
        public final static String back = "back";
        @Named("已终止")
        public final static String reject = "reject";
    }

    @Named("流程页签")
    public static final class FLOW_TAB{
        @Named("待办视图")
        public final static String  todo="todo";
        @Named("我发起的")
        public final static String byMe = "byMe";
        @Named("抄送视图")
        public final static String notifier = "notifier";
        @Named("已办视图")
        public final static String done = "done";
    }

    @Named("菜单页面类型")
    public static final class PAGE_TYPE{
        @Named("表单页面")
        public final static String  crudPage = "crudPage";
        @Named("分析页面")
        public final static String  chartPage = "chartPage";
        @Named("自定义页面")
        public final static String  customPage = "customPage";
    }
}
