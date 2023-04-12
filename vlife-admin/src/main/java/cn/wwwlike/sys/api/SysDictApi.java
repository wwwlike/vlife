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

package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.sys.req.SysDictPageReq;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.vlife.base.OrderRequest;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeApi;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 字典表接口;
 */
@RestController
@RequestMapping("/sysDict")
public class SysDictApi extends VLifeApi<SysDict, SysDictService> {

    @GetMapping("/page")
    public PageVo<SysDict> page(SysDictPageReq req) {
        req.qw().ne("dictType",true);
        return service.findPage(req);
    }

    @GetMapping("/list/type")
    public List<SysDict> listType() {
        return service.find("dictType",true);
    }

    @GetMapping("/all")
    public List<SysDict> all() {
        return service.findAll(new OrderRequest().addOrder("code", Sort.Direction.ASC)
                .addOrder("val", Sort.Direction.ASC)
        );

    }

    /**
     * 保存字典表;
     *
     * @param dto 字典表;
     * @return 字典表;
     */
    @PostMapping("/save")
    public SysDict save(@RequestBody SysDict dto) {
        dto.setSys(false);
        return service.save(dto);
    }

    /**
     * 明细查询字典表;
     *
     * @param id 主键id;
     * @return 字典表;
     */
    @GetMapping("/detail/{id}")
    public SysDict detail(@PathVariable String id) {
        return service.findOne(id);
    }

    /**
     * 逻辑删除;
     *
     * @param id 主键id;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }

    @GetMapping("/sync")
    public List<SysDict> sync() {
        return service.sync();
    }

    /**
     * 根据code查询字典
     *
     * @param code
     * @return
     */
    @GetMapping("/listByCode")
    public List<SysDict> listByCode(String code) {
        return service.find("code", code).stream().filter(s -> s.val != null).collect(Collectors.toList());
    }

}
