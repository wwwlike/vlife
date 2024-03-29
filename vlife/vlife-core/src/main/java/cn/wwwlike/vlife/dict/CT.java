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
 * 框架底层字典1
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

}
