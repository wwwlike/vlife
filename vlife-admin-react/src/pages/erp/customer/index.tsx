import React from "react";
import Content from "../../template/content";
import { Customer } from "@src/api/erp/Customer";
import { VF } from "@src/dsl/VF";

export default () => {
  return (
    <Content<Customer>
      listType="customer"
      editType={{
        type: "customerDto",
        reaction: [
          VF.subThen("linkManList", "supplierId", "customerId").hide(),
        ],
      }}
      filterType="customerPageReq"
      //子表隐藏2个字段
    />
  );
};
