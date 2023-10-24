import { Banner, Button, Input } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { Mode } from "@src/dsl/base";
import React, { useEffect, useMemo, useState } from "react";

export interface httpError {
  msg: string;
  code: number;
  method: string;
  url: string;
}
/**
 * api设置
 * 1.告知约定的内容信息
 * 2.提示可能有错的原因
 * 3.提示后端代码的编写方式
 * 4.选择已有接口进行绑定
 */
interface FormApiProps {
  httpError?: httpError; // 访问的接口地址
  formVo: FormVo; //模型类型
  mode: Mode | undefined; //设计模型类型
  onDataChange: (formVo: FormVo) => void;
}

const FormApi = ({
  httpError,
  mode,
  formVo,
  onDataChange,
  ...prop
}: FormApiProps) => {
  /**
   * api路径
   */

  //验证结果
  const [checkResult, setCheckResult] = useState<
    "success" | "info" | "danger" | "warning"
  >();
  const [api, setApi] = useState<Partial<{ path: string; method: string }>>(
    formVo
      ? mode === Mode.list &&
        formVo.listApiPath &&
        formVo.listApiPath.split(":").length === 2
        ? {
            path: formVo.listApiPath.split(":")[0],
            method: formVo.listApiPath.split(":")[1],
          }
        : {}
      : {}
  );
  const [filedObj, setFileObj] = useState<any>();
  useEffect(() => {
    if (checkResult === "success" && api) {
      if (mode === Mode.list) {
        onDataChange({ ...formVo, listApiPath: api.path + ":" + api.method });
      }
    }
  }, [mode, checkResult, api]);

  const importMyMethod = async (
    api: Partial<{ path: string; method: string }>
  ) => {
    try {
      if (api.path && api.method) {
        const page = await import(api.path);
        setFileObj(page);
        if (page[api.method]) {
          setCheckResult("success");
        } else {
          setCheckResult("warning");
        }
        // setInstallMethod(page[api.method]);
      }
    } catch (e) {
      setCheckResult("danger");
    }
  };

  //本次访问的接口地址；
  const apiUrl = useMemo(() => {
    if (httpError?.url) {
      return httpError?.url;
    }
    if (mode === Mode.list) {
      return (
        formVo.entityType +
        "/page" +
        (formVo.entityType === formVo.type ? "" : "/" + formVo.type)
      );
    }
  }, [mode, formVo]);

  return (
    <div>
      <div className=" ">
        {httpError ? (
          <Banner
            fullMode={false}
            type="danger"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                <span className=" text-blue-500">
                  {`${httpError.method.toUpperCase()}方式请求的接口:"${apiUrl}"访问不到`}
                </span>
              </div>
            }
            description={
              <div>
                你可先联系对应的后台研发兄弟，确认是否有该接口、是否发布到开发环境。
                {/* <Link to={"https://semi.design/"}>应用云平台</Link> */}
                如需要使用其他接口，请在下方进行选择。
              </div>
            }
          />
        ) : (
          ""
        )}
        {/* <Banner type="danger">
          请确保{httpError.method + ":" + apiUrl}地址的接口可访问
        </Banner> */}
      </div>
      <div>
        {checkResult !== undefined ? (
          <Banner
            fullMode={false}
            closeIcon={null}
            className=" pl-2 mt-2"
            type={checkResult}
            description={`${
              checkResult === "success"
                ? "方法验证通过"
                : checkResult === "danger"
                ? "文件路径不要存在"
                : checkResult === "warning"
                ? "方法名不存在"
                : "请选择方法路径的地址，不需要文件名后缀，如：/src/mvc/SysUser"
            }`}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="p-2 flex space-x-2">
        <div className=" items-center space-x-2 w-full mt-2">
          <div className="semi-form-field-label-text semi-form-field-label">
            <label>
              文件路径(/src/mvc/
              {formVo.entityType.substring(0, 1).toUpperCase()}
              {formVo.entityType.substring(1)}
              <Button
                size="small"
                onClick={() => {
                  setApi({
                    ...api,
                    path: `/src/mvc/${formVo.entityType
                      .substring(0, 1)
                      .toUpperCase()}${formVo.entityType.substring(1)}`,
                  });
                }}
              >
                采用
              </Button>
              )
            </label>
            <Input
              value={api?.path}
              className="w-1/3"
              onChange={(d) => {
                setApi({ ...api, path: d });
                setCheckResult("info");
              }}
            />
          </div>
          <div className="semi-form-field-label-text semi-form-field-label">
            <label>方法名称</label>
            {filedObj
              ? JSON.stringify(Object.keys(filedObj).map((k) => k))
              : ""}
            <Input
              value={api?.method}
              className="w-1/3"
              onChange={(d) => {
                setApi({ ...api, method: d });
                setCheckResult("info");
              }}
            />
          </div>
          <div className="semi-form-field-label-text items-end semi-form-field-label">
            {checkResult !== "success" ? (
              <Button
                disabled={
                  api === undefined ||
                  api.method === undefined ||
                  api.method === "" ||
                  api.path === undefined ||
                  api.path === ""
                }
                onClick={() => {
                  if (api) importMyMethod(api);
                }}
              >
                验证
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormApi;
