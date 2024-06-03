/**
 * 导入得页面组件
 */
import React, { useEffect, useMemo, useState } from "react";
import { Button, Select, Spin } from "@douyinfe/semi-ui";
import { ExcelUploadFile, importData, template } from "@src/api/common/Excel";
import { FormVo, list } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { useUpdateEffect } from "ahooks";

export interface ImportPageProps {
  entityType: string;
  onDataChange?: (data: Partial<ExcelUploadFile>) => void;
  onFinish?: () => void; //当前页面业务处理完成
}

export default ({ entityType, onFinish, onDataChange }: ImportPageProps) => {
  const [formVo, setFormVo] = useState<FormVo>();
  const [excelUploadFile, setExcelUploadFile] = useState<
    Partial<ExcelUploadFile>
  >({ entityType: entityType, override: true, file: undefined });

  //导入中
  const [loading, setLoading] = useState<boolean>(false);
  //当前页面 导入页面|导入结果页面
  const [page, setPage] = useState<"import" | "result" | "modelError">(
    "import"
  );
  const [result, setResult] = useState<number>();
  // 在ImportPage组件中添加一个处理文件选择的函数
  const handleFileChange = (e: any) => {
    const file = e.target.files[0]; // 获取选择的文件
    setExcelUploadFile({
      ...excelUploadFile,
      file: file,
    });
  };

  useEffect(() => {
    list({ type: entityType }).then((t) => {
      setFormVo(t.data?.[0]);
      if (formVo?.fields.filter((f) => f.validate_unique).length === 0) {
        setPage("modelError");
      }
    });
  }, []);

  // useUpdateEffect(() => {
  //   onDataChange?.(excelUploadFile);
  // }, [excelUploadFile]);

  //唯一不能重复的字段
  const uniqueFields = useMemo(() => {
    return formVo?.fields
      .filter((t: FormFieldVo) => t.validate_unique)
      .map((t) => t.title)
      .join(",");
  }, [formVo]);
  return (
    <div className=" relative p-4 space-y-4 h-96 flex flex-col ">
      {page === "import" && (
        <>
          <div>
            <div className=" font-bold mb-2 ">
              一、请按照数据模板的格式准备要导入的数据。点击下载
              <a
                className=" text-blue-500 cursor-pointer"
                onClick={() => {
                  template(entityType);
                }}
              >
                《{formVo?.title}导入模板》
              </a>
            </div>
            <div> 导入文件请勿超过2MB（约10,000条数据）</div>
          </div>
          <div>
            <div className=" font-bold mb-2">
              二、请选择数据重复时的处理方式（查重规则：{uniqueFields}）
            </div>
            <div className="mb-2">
              查重规则为：添加{formVo?.title}
              时所需填写的所有唯一字段，当前设置唯一字段为：{uniqueFields}
            </div>
            <div>
              <Select
                value={excelUploadFile.override ? "override" : "skip"}
                onChange={(e) => {
                  setExcelUploadFile({
                    ...excelUploadFile,
                    override: e === "override",
                  });
                }}
                optionList={[
                  { label: "覆盖系统原有数据", value: "override" },
                  { label: "跳过", value: "skip" },
                ]}
              />
            </div>
          </div>
          <div>
            <div className=" font-bold mb-2">三、请选择需要导入的文件</div>
            <div className="mb-2">
              <input
                type="file"
                onChange={handleFileChange}
                className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
              />
            </div>
          </div>
        </>
      )}

      {page === "result" && (
        <div className=" text-center">
          {loading && (
            <div>
              <div>
                <Spin size="large" /> <span>数据导入中...</span>
              </div>
            </div>
          )}
          {result && result >= 0 && (
            <span className=" font-bold"> 成功导入{result}条数据</span>
          )}
          {result && result === -1 && (
            <span className=" font-bold text-red-500">
              导入数据格式与模版不匹配，不能导入
            </span>
          )}
        </div>
      )}

      {page === "modelError" && (
        <div className=" font-bold text-red-500">
          导入的数据模型，必须至少设置一个字段为唯一字段不能重复
        </div>
      )}

      {page !== "modelError" && (
        <div className="absolute  right-4  bottom-4">
          {
            <Button
              loading={loading}
              disabled={!excelUploadFile.file}
              onClick={() => {
                if (page === "import") {
                  setPage("result");
                  setLoading(true);
                  importData(excelUploadFile).then((r) => {
                    setResult(r.data);
                    setLoading(false);
                    onFinish?.();
                  });
                } else {
                  setExcelUploadFile({
                    ...excelUploadFile,
                    file: undefined,
                  });
                  setPage("import");
                }
              }}
            >
              {page === "import" || loading ? "数据导入" : "继续导入"}
            </Button>
          }
        </div>
      )}
    </div>
  );
};
