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

package cn.wwwlike.vlife.bean;

import lombok.Data;

import java.util.List;

@Data
public class PageVo<T> {
    public List<T> result;
    public Integer size;
    public Integer page;
    public Long total;
    public Long totalPage;
    public Boolean first;
    public Boolean last;

    public PageVo(List<T> result, int size, int page, Long total) {
        this.result = result;
        this.size = size;
        this.page = page;
        this.total = total;
        this.totalPage = total / size + ((total % size == 0) ? 0 : 1);
        this.first = page == 0;
        this.last = page == totalPage - 1;
    }

    public PageVo() {
        this.size = 0;
        this.page = 0;
        this.total = 0L;
        this.totalPage = 0L;
        this.first = true;
        this.last = true;
    }
}
