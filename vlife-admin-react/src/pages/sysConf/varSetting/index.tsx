//系统设置
import React, { useEffect, useMemo, useState } from "react";
import { SysVar, list } from "@src/api/SysVar";
import classNames from "classnames";
import TablePage from "@src/pages/common/tablePage";
import VarSetting from "./VarSetting";

export default () => {
  const [sysVarDatas, setVarDatas] = useState<SysVar[]>();
  const [currTab, setCurrTab] = useState<string>("sys");
  const tabs = [
    { label: "全局配置", key: "sys", icon: "" },
    // { label: "应用配置", key: "business", icon: "" },
    { label: "配置项维护", key: "manage", icon: "" },
  ];

  useEffect(() => {
    list({}).then((res) => {
      setVarDatas(res.data || []);
    });
  }, []);
  return (
    <div className="flex flex-1 space-x-2 ">
      <div className=" w-52 bg-white border rounded-md py-1">
        {tabs.map((item) => {
          return (
            <div
              key={item.key}
              onClick={() => setCurrTab(item.key)}
              className={` ${classNames({
                "border-l-2 border-blue-500 bg-slate-50": item.key === currTab,
              })} h-11 text-sm  flex items-center pl-4 space-x-4   text-slate-700 hover:bg-slate-50 cursor-pointer`}
            >
              <span
                className={`text-xl ${classNames({
                  "text-slate-300": item.key !== currTab,
                  "text-blue-500": item.key === currTab,
                })}`}
              >
                {item.icon}
              </span>
              <span> {item.label}</span>
            </div>
          );
        })}
      </div>
      <div className=" w-full h-full ml flex flex-col relative  flex-1 p-2 bg-white border rounded-md items-center">
        {/* {JSON.stringify(formData)} */}
        <div className=" w-1/3">
          {currTab === "sys" && sysVarDatas && (
            <VarSetting
              // @ts-ignore
              vars={sysVarDatas}
              className={" "}
            />
          )}
        </div>
        {/* {
          // @ts-ignore
          currTab === "busniess" && sysForm && <Form modelInfo={sysForm} />
        } */}
        {currTab === "manage" && <TablePage<SysVar> listType="sysVar" />}
      </div>
    </div>
  );
};
