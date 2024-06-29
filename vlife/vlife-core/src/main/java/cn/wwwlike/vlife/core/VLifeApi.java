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

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.query.req.ComponentParam;
import cn.wwwlike.vlife.utils.GenericsUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.annotation.PostConstruct;
import java.util.List;

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
    public Class<T> entityClz;

    @PostConstruct
    public void init() throws ClassNotFoundException {
        entityClz = GenericsUtils.getSuperClassGenricType(this.getClass());
    }

    /**
     * 明细查询通用方法 支持saveBean数据查询
     * @param modelName
     * @param id
     * @return
     */
    @GetMapping("/view/{modelName}/{id}")
    public IdBean view(@PathVariable String modelName, @PathVariable String id) {
        BeanDto btn = service.modelInfo(modelName);
        if (Item.class.isAssignableFrom(btn.getClz())) {
            return service.findOne(id);
        } else {
            return service.queryOne(btn.getClz(), id);
        }
    }


    /**
     * 所有表字段是否唯一性校验
     * @param fieldName
     * @param fieldVal
     * @return
     */
    @GetMapping("/exist")
    public Long exist(String fieldName,  String fieldVal,String id) {
        if(StringUtils.isEmpty(fieldVal)){
            return 0L;
        }
        QueryWrapper<T> qw = QueryWrapper.of(entityClz).eq(fieldName, fieldVal);
        if(id!=null){
            qw.ne("id",id);
        }
       return service.count(qw);
    }

    /**
     * 通过字段批量查询数据只包含查询字段和name的数据
     *
     * @param ids
     * @return
     */
    @GetMapping("/find/{field}")
    public List<T> find(@PathVariable String field, String... ids) {
        QueryWrapper<T> qw = QueryWrapper.of(entityClz).in(field, ids);
        return service.findWithoutPermissions(qw);
    }

    /**
     * 外键名称查询(待移除)
     * @param params
     * @return
     */
    @GetMapping("/findName")
    public List<T> findName(ComponentParam params) {
        QueryWrapper<T> qw = QueryWrapper.of(entityClz).in("id", params.getIds());
        return service.find(qw);
    }

    /**
     * 逻辑删除;
     */
    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }

}
