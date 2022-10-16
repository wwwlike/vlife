/**
 * 查询权限配置
 */

import { Card } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import React, { useState } from "react";
import { initData } from "@src/mvc/SysFilter";

export default () => {
  const [formData, setFormData] = useState<any>({});
  const entityName = "sysFilterDetail";
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="查询权限管理"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          {
            <FormPage
              type="req"
              formData={formData}
              onDataChange={setFormData} //相应事件。
              entityName={entityName}
              modelName="sysFilterDetailPageReq"
            />
          }
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="行级过滤列表"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            req={formData} //搜索条件
            entityName={entityName}
            customBtns={[
              {
                title: "权限同步",
                entityName,
                tableBtn: true,
                okFun: initData,
              },
            ]}
            select_more={true}
          ></TablePage>
        </Card>
      </div>
    </div>
  );
};
