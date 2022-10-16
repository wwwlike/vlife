import { Card, Input } from "@douyinfe/semi-ui";
import VlifeButton from "@src/components/basic/vlifeButton";
import { pageImport, saveImport, SysResources } from "@src/mvc/SysResources";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import React, { useCallback, useState } from "react";

/**
 * 资源管理主页
 */
export default () => {
  const { show } = useNiceModal("tableModal");
  const [formData, setFormData] = useState<any>();
  const [importReq, setImportReq] = useState<{ url: string }>({ url: "1123" });
  const [reload, setReload] = useState<boolean>(false);

  const subSearch = useCallback((v: string) => {
    setImportReq({ url: v });
  }, []);

  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="资源管理"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <FormPage
            type="req"
            formData={formData}
            onDataChange={setFormData}
            entityName="sysResources"
            modelName="sysResourcesPageReq"
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="资源列表"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            req={formData}
            entityName="sysResources"
            select_more={true}
            reload={reload}

            // customBtns={[{ title: "导入", tableBtn: true }]}
          >
            <VlifeButton
              code="sysResources:save:import"
              onClick={() => {
                show({
                  entityName: "sysResources",
                  listModel: "sysResources",
                  select_more: true,
                  simpleSearchField: "search",
                  showColumns: ["name", "type", "resourcesCode"],
                  req: { importReq },
                  select_show_field: "name",
                  // children: (
                  //   // <Input
                  //   //   name="url"
                  //   //   value={importReq?.url}
                  //   //   onChange={subSearch} //还是不能设置值进去
                  //   // ></Input>
                  // ),
                  loadData: pageImport, //传入数据接口，替代table里调用的usehook(enetity+editModel的接口)
                  btnEnable: { disable: true },
                }).then((data: any) => {
                  const saveDatas: SysResources[] = data;
                  saveDatas.forEach((saveData) => {
                    saveData.resourcesCode = saveData.id;
                    saveData.id = "";
                    saveImport(saveData).then((data) => {
                      setReload(!reload); //刷新
                    });
                  });
                });
              }}
            >
              导入
            </VlifeButton>
          </TablePage>
        </Card>
      </div>
    </div>
  );
};
