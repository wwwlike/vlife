import React from "react";
import Content from "../../template/content";
import { Supplier } from "@src/api/Supplier";

export default () => {
  return (
    <Content<Supplier>
      entityType="supplier"
      listType="supplier"
      editType="supplierDto"
      filterType="supplierPageReq"
    ></Content>
  );
};
