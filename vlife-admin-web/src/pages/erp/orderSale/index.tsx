import { OrderSale, OrderSaleDto } from "@src/api/erp/OrderSale";
import { OrderSaleDetail } from "@src/api/erp/OrderSaleDetail";
import Content from "@src/pages/template/content";
import React from "react";
export default () => {
  return (
    <Content<OrderSale>
      filterType="orderSalePageReq"
      entityType={"orderSale"}
      editType="orderSaleDto"
      listType="orderSale"
      validate={{
        details: (val, formData) => {
          if (val.length > 2) {
            return "不能超过2个产品";
          }
        },
      }}
      dataComputer={{
        funs: (data: OrderSaleDto) => {
          const totalPrice = data.details?.reduce(
            (total: number, detail: OrderSaleDetail) => {
              return total + detail.price * detail.total;
            },
            0
          );
          return { ...data, totalPrice };
        },
      }}
    />
  );
};
