import React, { useCallback, useMemo, useState } from "react";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataModel, DataType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import { CompPropInfo } from "../compConf";
import BasicSetting from "./BasicSetting";
import ObjectSetting from "./ObjectSetting";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";

/**
 * 数组数据设置
 */
export interface ArraySettingProps {
  propName: string;
  formVo?: FormVo;
  field?: FormFieldVo;
  propInfo: CompPropInfo;
  value: Partial<PageComponentPropDto>[];
  onDataChange: (datas: Partial<PageComponentPropDto>[]) => void;
}
export default ({
  propInfo,
  value,
  field,
  formVo,
  propName,
  onDataChange,
  ...props
}: ArraySettingProps) => {
  //默认要展示一个顾数组初始化长度1
  const [datas, setDatas] = useState<Partial<PageComponentPropDto>[]>(
    value === undefined || value.length === 0
      ? [{ listNo: 0, propName }]
      : value
  );
  useUpdateEffect(() => {
    onDataChange(datas);
  }, [datas]);
  /**
   * 数组数量
   */
  const arrayLength = useMemo(() => {
    return new Set(datas.map((m) => m.listNo)).size;
  }, [datas]);
  const create = useCallback(() => {
    setDatas([...datas, { listNo: arrayLength, propName }]);
  }, [datas, arrayLength]);

  const remove = useCallback(
    (index: number) => {
      const filterDatas = datas.filter((d, i) => {
        return d.listNo !== index;
      });
      setDatas([...filterDatas]);
    },
    [datas]
  );

  const isBasic = useMemo((): boolean => {
    return (
      propInfo.dataModel === DataModel.string ||
      propInfo.dataModel === DataModel.boolean ||
      propInfo.dataModel === DataModel.number ||
      propInfo.dataModel === DataModel.date
    );
  }, [propInfo]);

  const edit = useCallback(
    (index: number, line: Partial<PageComponentPropDto>[]) => {
      const edtiDatas = datas.filter((d, i) => {
        return d.listNo !== index;
      });
      setDatas([...edtiDatas, ...line]);
    },
    [datas]
  );

  return (
    <>
      {/* 根据序号listNo数据分组 同意序号的数据给到object或者basic */}
      {[...new Set(datas.map((m) => m.listNo))].sort().map((line) =>
        line !== undefined ? (
          <div key={propName + line}>
            <div>
              {isBasic ? (
                <>
                  <BasicSetting
                    formVo={formVo}
                    field={field}
                    key={"basic" + line}
                    propName={propName}
                    listNo={line}
                    propInfo={propInfo}
                    value={datas[line]}
                    onDataChange={(d: Partial<PageComponentPropDto>) => {
                      edit(line, [d]);
                    }}
                  />
                </>
              ) : (
                <>
                  <ObjectSetting
                    key={"object" + line}
                    formVo={formVo}
                    field={field}
                    value={datas.filter((d) => d.listNo === line)}
                    onDataChange={(datas: Partial<PageComponentPropDto>[]) => {
                      edit(line, datas);
                    }}
                    lineNo={line}
                    propName={propName}
                    propInfo={propInfo}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <></>
        )
      )}
      {/* 填单属性数组，或者是,复杂对象数组且支持设置单个sub的 */}
      {propInfo.dataType === DataType.array &&
        propInfo.dataSub !== undefined && (
          <div className="flex w-full justify-between text-sm ">
            <div
              onClick={create}
              className="text-gray-500 hover:text-black cursor-pointer "
            >
              +添加新的
            </div>
            {arrayLength > 1 && (
              <div
                onClick={() => remove(arrayLength - 1)}
                className="text-gray-500 hover:text-black  cursor-pointer text-right "
              >
                删除最后一条
              </div>
            )}
          </div>
        )}
    </>
  );
};
