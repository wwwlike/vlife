import React from "react";
import Content from "../../template/content";
import { Product } from "@src/api/erp/Product";
import { useAuth } from "@src/context/auth-context";

export default () => {
  const { dicts } = useAuth();
  return (
    <Content<Product>
      entityType="product"
      filterType="productPageReq"
      dataComputer={{
        funs: (d: Product) => {
          return {
            ...d,
            title:
              (dicts["project_brand"]?.data.filter(
                (dict) => dict.value === d.brand
              ).length > 0
                ? dicts["project_brand"].data.filter(
                    (dict) => dict.value === d.brand
                  )[0].label
                : "") +
              (d.xh ? "-" + d.xh : "") +
              (d.name ? "-" + d.name : ""),
          };
        },
      }}
    ></Content>
  );
};
