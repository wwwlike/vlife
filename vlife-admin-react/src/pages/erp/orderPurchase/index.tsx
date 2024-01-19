import React from "react";
import Content from "../../template/content";
import {
  OrderPurchase,
  OrderPurchaseDto,
  saveOrderPurchaseDto,
  remove,
  save,
} from "@src/api/erp/OrderPurchase";
import { VF } from "@src/dsl/VF";

export default () => {
  return (
    <Content<OrderPurchase>
      // filterType="orderPurchasePageReq"
      listType="orderPurchase"
      tabDictField="state"
      editType={{
        type: "orderPurchaseDto",
        reaction: [
          VF.then("totalPrice")
            .value((data: OrderPurchaseDto) => {
              return data?.details
                ?.map((d) => d.price * d.total)
                ?.reduce((a, b) => a + b, 0);
            })
            .readPretty(),

          // VF.result((data: OrderPurchaseDto) => {
          //   const obj: { [key: string]: number } = data?.details?.reduce(
          //     (acc: any, obj: any) => ({
          //       ...acc,
          //       [obj["productId"]]: (acc[obj["productId"]] || 0) + 1,
          //     }),
          //     {}
          //   );
          //   if (obj && Object.keys(obj).filter((k) => obj[k] > 1).length > 0) {
          //     return true;
          //   }
          //   return false;
          // })
          //   .then("details")
          //   .feedback("同一个商品不能出现两条"),
          VF.field("state")
            .eq("2")
            .or("warehouseId")
            .isNotNull()
            .then("warehouseId")
            .show(),
          VF.field("state")
            .eq("2")
            .then(
              "supplierId",
              "totalPrice",
              "remark",
              "sysUserId",
              "state",
              "orderDate",
              "details"
            )
            .readPretty(false),
          //明细设置
          VF.subThen("details", "orderPurchaseId").hide(),
          VF.field("details")
            .isNull()
            .then("details")
            .feedback("采购信息不能为空"),
        ],
      }}
      btns={[
        {
          actionType: "save",
          model: "orderPurchaseDto",
          usableMatch: { state: "1" },
          disabledHide: true,
          onSaveBefore: (data: OrderPurchaseDto) => {
            return { ...data, state: "1" };
          },
          saveApi: saveOrderPurchaseDto,
        },
        {
          title: "删除",
          actionType: "api",
          multiple: true,
          usableMatch: (data: OrderPurchaseDto[]) => {
            if (data.filter((d) => d.state === "1").length !== data.length) {
              return "当前状态不允许删除";
            }
          },
          onSaveBefore: (data: OrderPurchaseDto[]) => {
            return data.map((d) => d.id);
          },
          saveApi: remove,
        },
        {
          title: "查看",
          actionType: "edit",
          model: "orderPurchaseDto",
          disabledHide: true,
        },
        {
          title: "作废",
          usableMatch: { state: "2" },
          disabledHide: true,
          onSaveBefore: (data: OrderPurchaseDto) => {
            return { ...data, state: "4" };
          },
          saveApi: saveOrderPurchaseDto,
          actionType: "api",
        },
        {
          title: "付款",
          usableMatch: { state: "1" }, //代付款
          disabledHide: true,
          onSaveBefore: (data: OrderPurchaseDto) => {
            return { ...data, state: "2" };
          },
          saveApi: save,
          actionType: "api",
        },
        {
          title: "入库",
          disabledHide: true,
          usableMatch: { state: "2" },
          model: "orderPurchaseDto",
          onSaveBefore: (data: OrderPurchaseDto) => {
            return { ...data, state: "3" };
          },
          saveApi: saveOrderPurchaseDto,
          actionType: "edit",
        },
      ]}
    />
  );
};
