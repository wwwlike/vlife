import React from "react";
import Content from "../../template/content";
import { Product } from "@src/api/erp/Product";
import { VF } from "@src/dsl/VF";
import { loadApi } from "@src/resources/ApiDatas";
import { ISelect } from "@src/dsl/component";
/**
 * 产品页
 */
export default () => {
  return (
    <Content<Product>
      listType="product"
      editType={{
        type: "product",
        reaction: [
          VF.then("title").readPretty(),
          VF.then("title").value((formData: Product) => {
            return loadApi({
              apiInfoKey: "dictOpenApi",
              match: "ISelect_ITEMS",
              paramObj: { code: "project_brand" },
            }).then((selects: ISelect[]) => {
              return (
                (selects.filter((s) => s.value === formData.brand)?.[0]
                  ?.label || "") +
                (formData.name ? "-" + formData.name : "") +
                (formData.xh ? "-" + formData.xh : "")
              );
            });
          }),
        ],
      }}
      filterType="productPageReq"
    />
  );
};
