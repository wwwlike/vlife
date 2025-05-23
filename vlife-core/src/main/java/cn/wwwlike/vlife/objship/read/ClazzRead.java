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

package cn.wwwlike.vlife.objship.read;

import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;

/**
 * 类读取需要的通用方法
 */
public interface ClazzRead<T extends BeanDto> extends Read {
    /**
     * 读取一个类信息到 T对象里
     *
     * @param item
     * @return
     */
    public T readInfo(Class item);

    /**
     * json里的注释信息读取
     */
    public T commentRead(T t, ClzTag clzTag);

    /**
     * 回调方法最后处理类之间的关系
     *
     * @return
     */
    public void relation();

}
