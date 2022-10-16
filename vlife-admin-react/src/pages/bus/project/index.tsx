/**
 * 项目管理页面
 */
import { Card } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import React, { useState } from "react";
import { initData } from "@src/mvc/SysFilter";
import { listAll as orgAll } from "@src/mvc/SysOrg";
import { listAll as deptAll } from "@src/mvc/SysDept";
import { listAll as areaAll } from "@src/mvc/SysArea";
import { useAuth } from "@src/context/auth-context";
export default () => {
  const [formData, setFormData] = useState<any>({});
  const { user } = useAuth();
  const entityName = "project";
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="项目管理"
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
              modelName="ProjectPageReq"
            />
          }
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="项目管理列表(单独页面/page/bus/project/index.tsx)"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            req={formData} //搜索条件
            entityName={entityName}
            select_more={true}
          ></TablePage>
        </Card>
      </div>
    </div>
  );
};
