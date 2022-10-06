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

package cn.wwwlike.vlife.core;

import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.MainTable;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.GenericsUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

/**
 * 接口实现的基础类
 * 不写任何泛型方法，减少API输出无用的数量
 *
 * @param <T>
 * @param <S>
 */
public class VLifeApi<T extends Item, S extends VLifeService> {
    @Autowired
    public S service;
    public Class<T>  entityClz;

    @PostConstruct
    public void init() throws ClassNotFoundException {
        entityClz = GenericsUtils.getSuperClassGenricType(this.getClass());
    }

    /**
     * 模型信息
     * 未指定模型类ing，当前按entity,dto,vo,req顺序进行模型匹配
     * @param modelName 模型名称
     * @return
     */
    @GetMapping("/modelInfo/{modelName}")
    public BeanDto modelInfo(@PathVariable String modelName){
        return service.modelInfo(modelName);
    }

    /**
     * 明细查询通用方法 支持saveBean数据查询
     * @param modelName
     * @param id
     * @return
     */
    @GetMapping("/view/{modelName}/{id}")
    public IdBean view(@PathVariable String modelName,@PathVariable String id){
        BeanDto btn=service.modelInfo(modelName);
        if(Item.class.isAssignableFrom(btn.getClz())){
            return service.findOne(id);
        }else{
            return service.queryOne(btn.getClz(),id);
        }
    }

    /**
     * 通过字段批量查询数据只包含查询字段和name的数据
     *
     * @param ids
     * @return
     */
    @GetMapping("/find/{field}")
    public List<T> find(@PathVariable String field, String...ids){
        QueryWrapper<T> qw=QueryWrapper.of(entityClz).in(field,ids);
        return service.find(qw);
    }
}
