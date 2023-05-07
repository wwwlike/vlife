/**
 * api参数设置主键主文件
 */
import { FormFieldVo } from "@src/api/FormField";
import { PageApiParam } from "@src/api/PageApiParam";
import { ApiProp } from "@src/dsl/schema/api";
import { useCallback } from "react";
import ApiParamSetting from "./ApiParamSetting";

interface ApiSettingProps {
  /**
   * api名称
   */
  apiName: string;
  /**
   * api定义信息
   */
  data: ApiProp;
  /**
   * api已存储的值
   */
  pageApiParams: Partial<PageApiParam>[] | undefined;
  /**
   * 全量设置信息返回
   */
  onDataChange: (pageApiParams: Partial<PageApiParam>[]) => void;

  fields?: FormFieldVo[];
}

export default ({
  pageApiParams,
  onDataChange,
  apiName,
  data,
  fields,
}: ApiSettingProps) => {
  const reload = useCallback(
    (paramName: string, pageApiParam: Partial<PageApiParam>) => {
      if (pageApiParams && pageApiParams.length > 0) {
        const existOther: Partial<PageApiParam>[] = pageApiParams.filter(
          (p) => p.paramName !== paramName
        );
        const replaceObj: Partial<PageApiParam>[] = [
          ...existOther,
          pageApiParam,
        ];
        onDataChange([...replaceObj]);
      } else {
        onDataChange([pageApiParam]);
      }
    },
    [pageApiParams]
  );

  /**
   * 数据回传
   */
  return (
    <div>
      {data.params
        ? Object.keys(data.params).map((key) => {
            if (data.params) {
              return (
                <ApiParamSetting
                  key={`${apiName}_${key}`}
                  pageApiParam={
                    pageApiParams?.filter((f) => f.paramName === key)[0]
                  }
                  onDataChange={(pageApiParam: Partial<PageApiParam>) => {
                    reload(key, pageApiParam);
                  }}
                  paramName={key}
                  paramInfo={data.params[key]}
                  fields={fields}
                />
              );
            } else {
              return <></>;
            }
          })
        : ""}
    </div>
  );
};
