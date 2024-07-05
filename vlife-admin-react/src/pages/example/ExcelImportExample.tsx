import { Select, Step, Steps } from "@douyinfe/semi-ui";
import { loadApi } from "@src/resources/ApiDatas";
import { useEffect, useState } from "react";
import ImportPage from "../excel/ImportPage";

export default () => {
  const [type, setType] = useState<string>("sysUser");
  const [optionList, setOptionList] = useState<any[]>([]);

  useEffect(() => {
    loadApi({
      apiInfoKey: "formOpenApi",
      match: "type",
      // paramObj: { code: dictcode },
    }).then((d) => {
      setOptionList(d);
    });
  }, []);
  return (
    <div className="  flex flex-col items-center h-full p-2   bg-slate-50 ">
      <div className="m-2 font-bold text-xl flex items-center justify-center">
        通用数据导入
      </div>
      <Steps>
        <Steps.Step title="选择模型" description="" />
        <Steps.Step title="下载模版" description="" />
        <Steps.Step title="确定数据覆盖方式" description="" />
      </Steps>
      <div className="flex flex-1 mt-4 bg-white rounded-md text-md flex-col p-2">
        <div className="flex !w-full items-center space-x-4">
          <span className=" font-bold text-blue-500">业务模块选择:</span>
          <Select
            className=" w-48"
            value={type}
            optionList={optionList}
            onChange={(value) => {
              setType(value?.toString() || "sysUser");
            }}
          />
        </div>
        <ImportPage entityType={type}></ImportPage>
      </div>
    </div>
  );
};
