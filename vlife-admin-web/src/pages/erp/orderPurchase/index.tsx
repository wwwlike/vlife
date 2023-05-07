import React from "react";
import Content from "../../template/content";
import { OrderPurchase, OrderPurchaseDto } from "@src/api/erp/OrderPurchase";
import { OrderPurchaseDetail } from "@src/api/erp/OrderPurchaseDetail";

export default () => {
  return (
    <Content<OrderPurchase>
      entityType="orderPurchase"
      filterType="orderPurchasePageReq"
      listType="orderPurchase"
      editType="orderPurchaseDto"
      dataComputer={{
        funs: (data: OrderPurchaseDto) => {
          const total = data.details?.reduce(
            (sum: number, current: OrderPurchaseDetail) => {
              return sum + current.price * current.total;
            },
            0
          );
          return { ...data, totalPrice: total };
        },
      }}
    ></Content>
  );
};
