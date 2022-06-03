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

package cn.wwwlike.example.api;

import cn.wwwlike.example.entity.Blues;
import cn.wwwlike.example.service.BluesService;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import org.springframework.web.bind.annotation.*;

/**
 * blues接口;
 */
@RestController
@RequestMapping("/blues")
public class BluesApi extends VLifeApi<Blues, BluesService> {
    /**
     * blues分页查询;
     *
     * @return;
     */
    @GetMapping("/page")
    public PageVo<Blues> page() {
        PageQuery<Blues> req = new PageQuery<Blues>(Blues.class);
        return service.findPage(req);
    }

    /**
     * blues明细查询;
     *
     * @param id 查询id;
     * @return;
     */
    @GetMapping("/detail/{id}")
    public Blues detail(@PathVariable String id) {
        return service.findOne(id);
    }

    /**
     * blues保存;
     *
     * @param entity blues;
     * @return;
     */
    @PostMapping("/save")
    public Blues save(@RequestBody Blues entity) {
        return service.save(entity);
    }

    /**
     * blues删除;
     *
     * @param id 主键id;
     * @return;
     */
    @DeleteMapping("/delete/{id}")
    public Long delete(@PathVariable String id) {
        return service.remove(id);
    }
}
