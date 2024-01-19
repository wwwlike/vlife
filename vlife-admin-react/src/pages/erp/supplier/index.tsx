import React from "react";
import Content from "../../template/content";
import { Supplier } from "@src/api/Supplier";
import { VF } from "@src/dsl/VF";

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
