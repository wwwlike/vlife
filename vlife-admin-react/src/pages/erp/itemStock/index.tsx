/**
 * 仓库
 */
import { ItemStock } from "@src/api/erp/ItemStock";
import React from "react";
import Content from "../../template/content";

export default () => {
  return (
    <Content<ItemStock>
      filterType="itemStockPageReq"
      listType="itemStock"
      btns={[]}
    />
  );
};
