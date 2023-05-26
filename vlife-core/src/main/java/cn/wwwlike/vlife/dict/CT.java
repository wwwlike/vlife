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
 * 系统字典
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
        public final static Boolean T = true;
        @Named("否")
        public final static Boolean F = false;
    }


    @Named("业务状态")
    public static final class STATE {
//        @Named("作废")
//        public final static String DROP = "0";
        @Named("正常")
        public final static String NORMAL = "1";
        @Named("停用")
        public static final String DISABLE = "-1";
    }

    @Named("统计类型")
    public static final class ITEM_FUNC {
        @Named("数量")
        public final static String COUNT = "count";
        @Named("合计")
        public final static String SUM = "sum";
        @Named("均值")
        public final static String AVG = "avg";
//        @Named("最大/最新(max)")
//        public final static String MAX = "max";
//        @Named("最小/最早(min)")
//        public final static String MIN = "min";
    }


}
