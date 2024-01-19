import React from "react";
import {
  OrderSale,
  OrderSaleDto,
  remove,
  save,
  saveOrderSaleDto,
} from "@src/api/erp/OrderSale";
import { VF } from "@src/dsl/VF";
import Content from "@src/pages/template/content";

export default () => {
  return (
    <Content<OrderSale>
      tabDictField="state"
      listType="orderSale"
      btns={[
        {
          actionType: "save",
          model: "orderSaleDto",
          disabledHide: true,
          usableMatch: { state: "1" },
          saveApi: saveOrderSaleDto,
          reaction: [
            VF.subThen("details", "orderSaleId").hide(),
            VF.field("details")
              .isNull()
              .then("details")
              .feedback("销售明细不能为空"),
            VF.then("totalPrice")
              .value((data: OrderSaleDto) => {
                return data?.details
                  ?.map((d) => d.price * d.total)
                  ?.reduce((a, b) => a + b, 0);
              })
              .readPretty(),

            // VF.field("state")
            //   .eq("2")
            //   .then(
            //     "supplierId",
            //     "totalPrice",
            //     "remark",
            //     "sysUserId",
            //     "state",
            //     "orderDate",
            //     "details"
            //   )
            //   .readPretty(false),
            //明细设置
          ],
        },
        {
          title: "删除",
          actionType: "api",
          multiple: true,
          usableMatch: (data: OrderSaleDto[]) => {
            if (data.filter((d) => d.state === "1").length !== data.length) {
              return "当前状态不允许删除";
            }
          },
          onSaveBefore: (data: OrderSaleDto[]) => {
            return data.map((d) => d.id);
          },
          saveApi: remove,
        },
        {
          title: "查看",
          model: "orderSaleDto",
          actionType: "edit",
          disabledHide: true,
        },
        {
          title: "作废",
          usableMatch: { state: "2" },
          onSaveBefore: (data: OrderSale) => {
            return { ...data, state: "7" };
          },
          disabledHide: true,
          saveApi: save,
          actionType: "api",
        },
        {
          title: "收款",
          usableMatch: { state: "1" },
          disabledHide: true,
          onSaveBefore: (data: OrderSale) => {
            return { ...data, state: "2" };
          },
          saveApi: save,
          actionType: "api",
        },
        {
          title: "订单完成",
          usableMatch: { state: "3" },
          disabledHide: true,
          onSaveBefore: (data: OrderSale) => {
            return { ...data, state: "4" };
          },
          saveApi: save,
          actionType: "api",
        },
      ]}
    />
  );
};
