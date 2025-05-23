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

package cn.wwwlike.vlife.base;

import lombok.Data;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

/**
 * 排序入参信息
 */
@Data
public class OrderRequest {
    public String orders;
    public List<Order> orderReqList = new ArrayList<>();


    public OrderRequest(String property, Sort.Direction sort) {
        addOrder(property, sort);
    }

    public OrderRequest() {
    }


    public void setOrders(String orders) {
        this.orders = orders;
        if (orders != null&&!"".equals(orders)) {
            String[] orderArray = orders.split(",");
            for (String order : orderArray) {
                String[] detail = order.split("_");
                if (detail.length == 1) {
                    addOrder(detail[0], Sort.Direction.ASC);
                }
                if (detail.length == 2) {
                    if (detail[1].equalsIgnoreCase("DESC")) {
                        addOrder(detail[0], Sort.Direction.DESC);
                    } else if (detail[1].equalsIgnoreCase("ASC")) {
                        addOrder(detail[0], Sort.Direction.ASC);
                    }
                }
            }
        }
    }

    /**
     * 手工触发排序添加
     *
     * @param field
     * @param direction
     * @return
     */
    public OrderRequest addOrder(String field, Sort.Direction direction) {
        if (this.orderReqList == null) {
            this.orderReqList = new ArrayList<>();
        }
        this.orderReqList.add(new Order(field, direction));
        return this;
    }


}
