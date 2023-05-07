import { DatePicker, Input, Select } from "@douyinfe/semi-ui";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/api/Form";
import { where } from "..";
import { FormFieldVo } from "@src/api/FormField";

interface CompareProps {
  form: FormVo;
  onDataChange: (data: Partial<where<any>>) => void;
  data: Partial<where<any>>;
}
/**
 * 匹配方式
 */
export const OPT: any = {
  eq: { label: "等于", fieldType: ["string", "number"] },
  in: { label: "范围", fieldType: ["string", "date", "number"] },
  gt: { label: "大于", fieldType: ["date", "number"] },
  like: { label: "模糊匹配", fieldType: ["string"] },
  fix: { label: "固定匹配" },
};

export const fixedVal: any = {
  id: { label: "当前用户" },
  deptId: { label: "当前部门" },
  areaId: { label: "当前地区" },
  orgId: { label: "当前机构" },
  codeOrg: { label: "本级和下级机构" },
  codeArea: { label: "本级和下级地区" },
  codeDept: { label: "本级和下级机构" },
};

/**
 * 数据转换
 */
export const tran = {
  year: { label: "按年查询", fieldType: ["date"] },
  month: { label: "按月查询", fieldType: ["date"] },
};

/**
 * 对比组件
 * 传入数据类型，返回比对方式，比对值，转换等信息出去
 */
export default ({ data, form, onDataChange }: CompareProps) => {
  const { dicts } = useAuth();
  const [reData, setReData] = useState(data);
  useEffect(() => {
    onDataChange({ ...reData });
  }, [reData]);

  const currField = useMemo((): FormFieldVo | undefined => {
    if (reData.fieldName) {
      return form.fields.filter((f) => f.fieldName === reData.fieldName)[0];
    }
    return undefined;
  }, [reData.fieldName]);
  return (
    <>
      <Select
        style={{ width: "130px" }}
        placeholder="字段"
        value={reData.fieldName}
        optionList={[
          ...form.fields.map((d) => {
            return { label: d.title, value: d.fieldName };
          }),
        ]}
        onChange={(data) => {
          setReData({ ...reData, fieldName: data as string, value: undefined });
        }}
      />
      <Select
        placeholder="匹配转换"
        style={{ width: "130px" }}
        value={reData.opt}
        optionList={[
          ...Object.keys(OPT).map((k) => {
            return {
              value: k,
              label: OPT[k]["label"],
            };
          }),
        ]}
        onChange={(data) => {
          setReData({ ...reData, opt: data as string });
        }}
      />
      {/* 值：动态值;固定值；多个值；组件不同，都需要考虑 */}
      {reData.opt === "fix" ? ( //固定值
        <Select
          placeholder="动态值"
          style={{ width: "130px" }}
          value={reData.fixCode}
          optionList={[
            ...Object.keys(fixedVal).map((k) => {
              return {
                value: k,
                label: fixedVal[k]["label"],
              };
            }),
          ]}
          onChange={(data) => {
            setReData({ ...reData, fixCode: data as string });
          }}
        />
      ) : reData.opt === "eq" && currField && currField.dictCode !== null ? ( // 字典类型
        <Select
          style={{ width: "130px" }}
          value={reData.value ? reData.value[0] : undefined}
          onChange={(data) => {
            setReData({ ...reData, value: [data as string] });
          }}
          optionList={dicts[currField.dictCode].data}
        ></Select>
      ) : reData.opt === "eq" ? (
        <Input
          placeholder="值"
          style={{ width: "130px" }}
          value={
            reData.value && reData.value.length > 0
              ? reData.value[0]
              : undefined
          }
          onChange={(data: string) => {
            setReData({ ...reData, value: [data] });
          }}
        />
      ) : reData.opt === "in" && currField && currField.type === "date" ? (
        <>
          <DatePicker style={{ width: "100px" }}></DatePicker>
        </>
      ) : (
        ""
      )}
    </>
  );
};
