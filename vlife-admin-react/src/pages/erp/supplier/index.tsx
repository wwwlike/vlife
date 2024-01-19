import React from "react";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { Supplier } from "@src/api/erp/Supplier";

export default () => {
  return (
    <Content<Supplier>
      listType="supplier"
      editType={{
        type: "supplierDto",
        reaction: [
          VF.subThen("linkManList", "supplierId", "customerId").hide(),
        ],
      }}
      filterType="supplierPageReq"
    />
  );
};
