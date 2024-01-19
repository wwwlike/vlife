import React from "react";
import Content from "../../template/content";
import { useLocation } from "react-router-dom";
import { VF } from "@src/dsl/VF";
import { LinkMan } from "@src/api/erp/LinkMan";

export default () => {
  const local = useLocation();
  const type = local.pathname.substring(local.pathname.lastIndexOf("/") + 1);
  const reaction = [
    VF.result(type === "supplier")
      .then("customerId")
      .hide(),
    VF.result(type === "customer")
      .then("supplierId")
      .hide(),
  ];
  return (
    <Content<LinkMan>
      key={type}
      title={type === "supplier" ? "供应商联系人" : "客户联系人"}
      editType={{
        type: "linkMan",
        reaction: reaction,
      }}
      filterType={{
        type: "linkMan",
        reaction: reaction,
      }}
      listType="linkMan"
      ignores={[type === "supplier" ? "customerId" : "supplierId"]}
      req={{ querySupplier: type === "supplier" ? true : false }} //
    />
  );
};
