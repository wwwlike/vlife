import React from "react";
import Content from "../../template/content";
import {
  OrderSend,
  OrderSendDto,
  remove,
  saveOrderSendDto,
} from "@src/api/erp/OrderSend";
import { VF } from "@src/dsl/VF";
import { detail, OrderSaleDto } from "@src/api/erp/OrderSale";
import { Result } from "@src/api/base";
import { OrderSendDetail } from "@src/api/erp/OrderSendDetail";

/**
 * 发货单
 */
export default () => {
  return (
    <Content<OrderSend>
      listType="orderSend"
      editType={{
        type: "orderSendDto",
        reaction: [
          VF.field("orderSaleId")
            .isNull()
            .then("details")
            .value([])
            .then("details")
            .readPretty(),
          VF.subThen("details", "price", "total").readPretty(),
          //查找并设置发货单价
          VF.subThen("details", "price").value((orderSendDetail: any) => {
            if (
              orderSendDetail &&
              orderSendDetail.productId &&
              orderSendDetail?.parent?.orderSaleId
            ) {
              return detail(orderSendDetail?.parent?.orderSaleId).then((d) => {
                return d?.data?.details.filter(
                  (detail) => detail.productId === orderSendDetail.productId
                )?.[0].price;
              });
            }
          }),
          //单个商品发货总额
          VF.subThen("details", "total").value(
            (orderSendDetail: OrderSendDetail) => {
              return (
                orderSendDetail.price &&
                orderSendDetail.realNum &&
                orderSendDetail.price * orderSendDetail.realNum
              );
            }
          ),
          //整个订单发货总额
          VF.then("total").value((data: OrderSendDto) => {
            return data?.details
              ?.map((d) => d.total)
              ?.reduce((a, b) => a + b, 0);
          }),
        ],
      }}
      btns={[
        {
          actionType: "save",
          model: "orderSendDto",
          usableMatch: { state: "1" },
          disabledHide: true,
          onSaveBefore: (data: OrderSendDto) => {
            return { ...data, state: "1" };
          },
          saveApi: saveOrderSendDto,
        },
        {
          title: "查看",
          actionType: "edit",
          model: "orderSendDto",
        },
        {
          title: "删除",
          actionType: "api",
          multiple: true,
          usableMatch: (data: OrderSendDto[]) => {
            if (data.filter((d) => d.state === "1").length !== data.length) {
              return "选择的数据需是进行中的";
            }
          },
          onSaveBefore: (data: OrderSendDto[]) => {
            return data.map((d) => d.id);
          },
          saveApi: remove,
        },
        {
          title: "发货",
          actionType: "api",
          disabledHide: true,
          submitConfirm: true,
          model: "orderSendDto",
          usableMatch: { state: "1" },
          onSaveBefore: (data: OrderSendDto) => {
            return { ...data, state: "2" };
          },
          saveApi: saveOrderSendDto,
        },
        {
          title: "退货",
          actionType: "api",
          disabledHide: true,
          usableMatch: { state: "2" },
          onSaveBefore: (data: OrderSendDto[]) => {
            return { ...data, state: "3" };
          },
          model: "orderSendDto",
          saveApi: saveOrderSendDto,
        },
      ]}
    />
  );
};
