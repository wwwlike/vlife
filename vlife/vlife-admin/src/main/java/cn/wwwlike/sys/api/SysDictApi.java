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
 * 字典表接口
 */
@RestController
@RequestMapping("/sysDict")
public class SysDictApi extends VLifeApi<SysDict, SysDictService> {
    /**
     * 字典查询
     */
    @PostMapping("/page")
    public PageVo<SysDict> page(@RequestBody SysDictPageReq req) {
        req.qw().ne("dictType",true);
        return service.findPage(req);
    }
    /**
     * 字典分类
     * @return
     */
    @GetMapping("/list/type")
    public List<SysDict> listType() {
        return service.find("dictType",true);
    }
    /**
     * 全部字典
     */
    @GetMapping("/all")
    public List<SysDict> all() {
        return service.findAll(new OrderRequest().addOrder("code", Sort.Direction.ASC)
                .addOrder("val", Sort.Direction.ASC)
        );
    }
    /**
     * 字典编辑
     */
    @PostMapping("/save")
    public SysDict save(@RequestBody SysDict dto) {
        dto.setSys(false);
        if(dto.getVal()==null&&dto.isDictType()==false){
            dto.setVal(service.dictVal(dto.getCode()));
        }
        return service.save(dto);
    }
    /**
     * 字典详情
     */
    @GetMapping("/detail/{id}")
    public SysDict detail(@PathVariable String id) {
        return service.findOne(id);
    }
    /**
     * 字典删除
     */
    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }
    /**
     * 根据code查询
     */
    @GetMapping("/listByCode")
    public List<SysDict> listByCode(String code) {
        return service.find("code", code).stream().filter(s -> s.val != null).collect(Collectors.toList());
    }

}
