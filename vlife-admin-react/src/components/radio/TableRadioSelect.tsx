// 列表字段多选组件

// import { Radio } from "@douyinfe/semi-ui";
import { SysDict } from "@src/api/SysDict";
import { VfBaseProps } from "@src/dsl/component";
import { useUpdateEffect } from "ahooks";
import { useEffect, useMemo, useState } from "react";

export interface TableRadioSelectProps extends VfBaseProps<any[]> {
  label: string;
  labelField: string; //lable所在字段
  dictField: string; //选项修改的字段
  dicts: SysDict[]; //可选字典项
  defaultVal: string; // 默认值
  disableVals: string[]; //禁用选项
}

export default (props: TableRadioSelectProps) => {
  const {
    label = "字段名称",
    labelField = "title",
    dictField = "access",
    dicts,
    defaultVal,
    disableVals,
    value,
    onDataChange,
  } = props;
  const [_data, set_data] = useState<any[]>(value || []);

  useEffect(() => {
    set_data((d) => {
      return d.map((f) => {
        return { ...f, [dictField]: f[dictField] ? f[dictField] : defaultVal };
      });
    });
  }, [defaultVal]);

  const _dicts = useMemo(() => {
    return dicts?.filter(
      (d) =>
        d.val &&
        (disableVals === null ||
          disableVals === undefined ||
          disableVals.length === 0 ||
          !disableVals.includes(d.val))
    );
  }, [dicts, disableVals]);

  useUpdateEffect(() => {
    onDataChange && onDataChange(_data);
    console.log("onDataChange", _data);
  }, [_data]);

  return (
    <div className=" w-full ">
      {/* {JSON.stringify(_data)} */}
      {/* 第一行 */}
      <div className="flex w-full bg-gray-50 border">
        <div className=" w-32 border  p-2 text-center">{label}</div>
        {_dicts?.map((dict) => (
          <div
            className="flex-grow border-l  p-2 text-center hover:cursor-pointer"
            key={`dict_${dict.id}`}
            onClick={() => {
              set_data((prev) => {
                return prev.map((f, line2) => {
                  return { ...f, [dictField]: dict.val };
                });
              });
            }}
          >
            {dict.title}
          </div>
        ))}
      </div>
      {_data?.map((f, line) => {
        return (
          <div className="flex w-full  border">
            <div className=" w-32  p-1 font-thin !pl-4">{f[labelField]}</div>
            {_dicts?.map((dict) => (
              <div
                className="flex-grow border-l  cursor-pointer  p-1 text-center"
                key={`dict_${dict.id}_line`}
                onClick={() => {
                  set_data((prev) => {
                    return prev.map((f, line2) => {
                      if (line === line2) {
                        return { ...f, [dictField]: dict.val };
                      }
                      return f;
                    });
                  });
                }}
              >
                <input
                  className=" text-2xl"
                  type="radio"
                  checked={f[dictField] === dict.val}
                  name={line + ""}
                  value={dict.val}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
