import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Card } from "@douyinfe/semi-ui";
import TablePage from "@src/pages/common/tablePage";
import FormPage from "../common/formPage";
import { useTitle } from "ahooks";
import { useAuth } from "@src/context/auth-context";

/**
 * CRUD配置模板页面
 * 1. 从template/xx路由页面取得entityName,模块信息
 * 2. 组装产生CRUD页面
 * - 存在该页面请求模型信息，table也请求的重复情况
 */
export default () => {
  const { getModelInfo } = useAuth();
  const params = useParams();
  const local = useLocation();
  const [title, setTitle] = useState<string>();
  useTitle(title || "配置表单");
  const entityName = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, [params]);
  // const {data,runAsync}=useModelInfo({entityName})
  useEffect(() => {
    getModelInfo(entityName, entityName).then((data) => {
      setTitle(data?.title || "");
      setFormData({});
    });
  }, [entityName]);

  // //2页面模块需要共享的查询条件状态
  const [formData, setFormData] = useState<Partial<any>>({});
  if (title) {
    return (
      <div className="h-full overscroll-auto">
        <div className="h-full w-72 float-left ">
          <Card
            title={title + (title.endsWith("管理") ? "" : "管理")}
            bordered={true}
            className="h-full"
            headerLine={false}
            headerStyle={{ fontSize: "small" }}
          >
            <FormPage
              type="req"
              formData={formData}
              onDataChange={setFormData}
              entityName={entityName || ""}
              modelName={entityName + "PageReq"}
            />
          </Card>
        </div>
        <div className="h-full md:min-w-3/4">
          <Card
            title={
              title + "列表(采用模板组件创建的页面功能(/template/index.tsx))"
            }
            headerLine={false}
            bordered={false}
            className="h-full"
          >
            <TablePage
              req={formData}
              entityName={entityName || ""}
              select_more={true}
            />
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <b>
          <h3>
            {entityName
              ? "路由地址/template/" +
                entityName +
                "       [" +
                entityName +
                "]的模型名称不存在,请检查拼写"
              : "路由地址/template/xxx还没有配置模型名称[xxx]"}
          </h3>
        </b>
      </>
    );
  }
};
