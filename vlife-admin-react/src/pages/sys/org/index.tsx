import React, { useState } from "react";
import { Card } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { listAll as areaListAll } from "@src/mvc/SysArea";
import { listAll } from "@src/mvc/SysOrg";
export default () => {
  const [formData, setFormData] = useState<any>();
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="机构管理"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <FormPage
            type="req" //查询form
            formData={formData} //数据data
            onDataChange={setFormData}
            entityName="sysOrg"
            modelName="sysOrgPageReq"
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="机构列表"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            req={formData}
            entityName="sysOrg"
            viewModel="sysOrg"
            editModel="sysOrg"
            select_more={true}
          />
        </Card>
      </div>
    </div>
  );
};
