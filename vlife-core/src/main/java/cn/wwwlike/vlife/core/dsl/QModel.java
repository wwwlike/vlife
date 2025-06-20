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

package cn.wwwlike.vlife.core.dsl;
import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.query.AbstractWrapper;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.jpa.impl.JPAQuery;

import java.util.Map;

/**
 * 查询模型
 */
public interface QModel<T extends Item> {
    /**
     * 不带查询条件的查询语句
     */
    public JPAQuery getVoFromQuery();

    /**
     * 通过查询条件返回查询语句
     */
    public <R extends AbstractWrapper> JPAQuery fromWhere(R request);

    /**
     * 本次主查询对象
     * @return
     */
    public EntityPathBase getMain();

    /**
     * 获得所有左查询路径
     *
     * @return
     */
    public Map<String, EntityPathBase> getAlljoin();

    /**
     * 获得查询对象信息
     *
     * @param reqClz
     * @return
     */
    public ReqDto getReqDto(Class<? extends BaseRequest<T>> reqClz);

}
