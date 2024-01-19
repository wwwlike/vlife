/**
 * 仓库管理
 */
import React from "react";
import Content from "../../template/content";
import { Warehouse } from "@src/api/erp/Warehouse";

export default () => {
  return <Content<Warehouse> listType="warehouse" />;
};
