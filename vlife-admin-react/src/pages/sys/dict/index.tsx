import { Card } from "@douyinfe/semi-ui";
import { VfButton } from "@src/components/table";
import TablePage from "@src/pages/common/tablePage";
import { useDictSync } from "@src/provider/dictProvider";
import { connected } from "process";
import React, { useEffect, useMemo, useState } from "react";

/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default () => {
  //2页面模块需要共享的查询条件状态
  const [pageReq, setPageReq] = useState<Partial<any>>({ queryType: false });
  const [typeReq, setTypeReq] = useState<Partial<any>>({ queryType: true });
  const entityName = "sysDict";
  const sync = useDictSync();
  const [title, setTitle] = useState("字典同步");
  const [reload, setReload] = useState<boolean>(false);
  const customBtns = useMemo((): VfButton[] => {
    return [
      {
        entityName: "sysDict", //eneityName,结合key 做权限控制
        title: title,
        key: "sync",
        tableBtn: true,
        loading: sync.loading,
        okFun: sync.runAsync,
        // fun:()=>sync.runAsync().then(data=>{
        //   setReload(!reload)
        // })
      },
    ];
  }, [sync]);

  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        {/* ${JSON.stringify(a)} */}
        <Card
          title="字典分类"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <TablePage
            key={"queryPage"}
            req={typeReq}
            entityName={entityName}
            hideColumns={[
              "createDate",
              "modifyDate",
              "id",
              "status",
              "sys",
              "edit",
              "val",
              "code",
              "createId",
              "modifyId",
            ]}
            btnEnable={{ disable: true }} //自带按钮全部禁用
            reload={reload}
            onGetData={(data) => {
              if (data && data.length > 0)
                setPageReq({ ...pageReq, code: data[0].code });
            }}
            lineClick={(e) => {
              setPageReq({ ...pageReq, code: e.code });
            }}
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="字典明细"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            initData={{ code: pageReq.code }}
            key={"tablePage"}
            req={pageReq}
            entityName={entityName}
            editModel={entityName}
            customBtns={customBtns}
            hideColumns={[
              "createDate",
              "modifyDate",
              "id",
              "status",
              "createId",
              "modifyId",
            ]}
            select_more={true}
          />
        </Card>
      </div>
    </div>
  );
};
