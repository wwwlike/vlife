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
    @Named("数据状态")
    public static final class STATUS {
        @Named("删除")
        public final static String REMOVE = "0";
        @Named("正常")
        public final static String NORMAL = "1";
    }

    @Named("业务状态(通用)")
    public static final class STATE {
        @Named("作废")
        public final static String DROP = "0";
        @Named("正常")
        public final static String NORMAL = "1";
        @Named("暂存")
        public static final String DISABLE = "2";
    }

}
