import React from "react";
import Content from "../../template/content";
import { Customer } from "@src/api/erp/Customer";

export default () => {
  return (
    <Content<Customer>
      entityType="customer"
      listType="customer"
      editType="customerDto"
      filterType="customerPageReq"
      validate={{
        tel: (v, form) => {},
      }}
    ></Content>
  );
};
