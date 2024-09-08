import React, { useEffect, useMemo, useState } from "react";
import { FormVo, list as model } from "@src/api/Form";
import { useLocation } from "react-router-dom";
import Content from "./content";
import Empty from "../common/Empty";
import { useTitle } from "ahooks";
import { useAuth } from "@src/context/auth-context";
/**
 * 采用content的模版页面
 */
export default () => {
  const location = useLocation();
  const [formVo, setFormVo] = useState<FormVo>();
  const [pageReqType, setPageReqType] = useState<string>();
  const { menuButtons, menu } = useAuth();
  useTitle(
    window.localStorage.getItem("menuTitle") !== null
      ? JSON.parse(window.localStorage.getItem("menuTitle") || "")?.title
      : formVo?.name + "管理"
  );

  //表单模型名称
  const formType = useMemo(() => {
    setPageReqType(undefined);
    if (location) {
      return location.pathname.split("/").pop();
    }
    return null;
  }, [location]);

  useEffect(() => {
    if (formType) {
      model({ type: formType }).then((edit) => {
        model({ entityType: edit.data?.[0].entityType, itemType: "req" }).then(
          (req) => {
            setFormVo(edit.data?.[0]);
            if (req.data) {
              setPageReqType(req.data?.[0]?.type);
            }
          }
        );
      });
    }
  }, [formType, location]);
  return (
    (formVo && (
      <Content
        //@ts-ignore
        btns={menuButtons.length > 0 ? menuButtons : undefined}
        key={formType + (pageReqType || "")}
        filterType={pageReqType}
        editType={formVo.type}
        addTabAble={true}
        allTabAble={true}
        listType={formVo.entityType}
      />
    )) || <Empty title={`无${formType}模型`} description="没有找到" />
  );
};
