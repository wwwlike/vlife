import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Input, Select } from "@douyinfe/semi-ui";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { InputNumber } from "@douyinfe/semi-ui/lib/es/inputNumber";
import RelationTagInput from "@src/components/RelationTagInput";
import { OptEnum, where } from "@src/dsl/base";

interface CompareProps {
  form: FormVo;
  onDataChange: (data: Partial<where>) => void;
  data: Partial<where>;
}
/**
 * 匹配方式和field下字段一致的数据则有opt里的比对方式
 */
export const OPT: {
  [key: string]: {
    label: string; //标签名称
    //满足的字段类型
    fieldType?: ("string" | "number" | "date" | "boolean")[];
    dict?: boolean; //字典类型字段是否可以用
    fk?: boolean; //是否匹配外键
  };
} = {
  eq: {
    label: "等于",
    fieldType: ["string", "number", "date", "boolean"],
  },
  ne: {
    label: "不等于",
    fieldType: ["string", "number", "date", "boolean"],
  },
  startsWith: {
    label: "开头匹配",
    fieldType: ["string"],
    dict: false,
    fk: false,
  },
  endsWith: {
    label: "结尾匹配",
    fieldType: ["string"],
    dict: false,
    fk: false,
  },
  gt: { label: ">", fieldType: ["date", "number"], dict: false, fk: false },
  ge: { label: ">=", fieldType: ["date", "number"], dict: false, fk: false },
  lt: { label: "<", fieldType: ["date", "number"], dict: false, fk: false },
  le: { label: "<=", fieldType: ["date", "number"], dict: false, fk: false },
  like: { label: "模糊匹配", fieldType: ["string"], dict: false, fk: false },
  fix: { label: "用户匹配", fieldType: [], dict: false, fk: true }, //当前用户 用户表上的外键 可以使用sys系统值进行匹配
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

  /**
   * 当前字段信息
   */
  const currField = useMemo((): FormFieldVo | undefined => {
    if (reData.fieldName) {
      return form.fields.filter((f) => f.fieldName === reData.fieldName)[0];
    }
    return undefined;
  }, [reData.fieldName]);
  /**
   * 如果是外键则作为select控件的optionList数据
   */
  const [fkSelectData, setFkSelectData] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (
      currField &&
      currField.entityFieldName === "id" &&
      currField.pathName.endsWith("Id")
    ) {
    }
  }, [currField]);

  return (
    <>
      {/* 一 字段选择 */}
      <Select
        style={{ width: "130px" }}
        placeholder="字段"
        value={reData.fieldName}
        optionList={[
          ...form.fields
            .filter((d) => d.fieldName !== "id")
            .map((d) => {
              return { label: d.title, value: d.fieldName };
            }),
        ]}
        onChange={(data) => {
          setReData({ fieldName: data as string });
        }}
      />

      {currField && (
        <>
          {/* 二 匹配方式 */}
          <Select
            placeholder="匹配方式"
            style={{ width: "130px" }}
            value={reData.opt}
            optionList={[
              ...Object.keys(OPT)
                .filter(
                  //字段类型满足判断
                  (k) =>
                    currField.fieldType &&
                    OPT[k].fieldType?.includes(currField.fieldType)
                )
                .filter(
                  //字典类型满足判断
                  (k) =>
                    (currField?.dictCode !== undefined &&
                      OPT[k].dict !== false) ||
                    (OPT[k].dict !== true &&
                      (currField.dictCode === undefined ||
                        currField.dictCode === null))
                )
                .filter(
                  //外键类型满足判断
                  (k) =>
                    (currField.pathName !== undefined &&
                      currField.pathName.endsWith("Id") &&
                      currField.entityFieldName === "id" &&
                      OPT[k].fk !== false) ||
                    (currField.pathName !== undefined &&
                      !currField.pathName.endsWith("Id") &&
                      currField.entityFieldName !== "id" &&
                      OPT[k].fk !== true)
                )
                .map((k) => {
                  return {
                    value: k,
                    label: OPT[k]["label"],
                  };
                }),
            ]}
            onChange={(data) => {
              setReData({ ...reData, opt: data as OptEnum });
            }}
          />

          {/* 三 转换方式 （日期，数字） */}
          {/* 3.1 日期 */}
          {currField.fieldType === "date" && reData?.opt && (
            <Select
              placeholder="日期转换"
              style={{ width: "130px" }}
              value={reData.tran}
              optionList={[
                { label: "按年", value: "year" },
                { label: "按月", value: "month" },
                { label: "按日", value: "date" },
                { label: "常量", value: "fixed" },
              ]}
              onChange={(data) => {
                setReData({ ...reData, tran: data as string });
              }}
            />
          )}
          {/* 3.1 数值 */}
          {currField.fieldType === "number" && (
            <Select
              placeholder="数值转换"
              style={{ width: "130px" }}
              value={reData.tran}
              optionList={[{ label: "整数", value: "integer" }]}
              onChange={(data) => {
                setReData({ ...reData, tran: data as string });
              }}
            />
          )}

          {/* 四 匹配值 */}

          {/* 4.1  日期类型 (年月/年月日)*/}
          {currField.fieldType === "date" &&
            reData.tran &&
            (reData.tran === "date" || reData.tran == "month") && (
              <DatePicker
                type={reData.tran}
                placeholder="请选择"
                insetInput
                style={{ width: 140 }}
              />
            )}
          {/* 4.2  日期类型 (年)*/}
          {currField.fieldType === "date" &&
            reData.tran &&
            reData.tran === "year" && (
              <Select
                style={{ width: 140 }}
                optionList={Array.from(
                  { length: 5 },
                  (_, index) => new Date().getFullYear() - index
                ).map((year) => {
                  return {
                    label: year,
                    value: year,
                  };
                })}
              ></Select>
            )}
          {/* 4.3  日期常量*/}
          {currField.fieldType === "date" &&
            reData.tran &&
            reData.tran === "fixed" && (
              <Select
                style={{ width: 140 }}
                optionList={[
                  { label: "今天", value: "" },
                  { label: "昨天", value: "" },
                  { label: "本周", value: "" },
                  { label: "上周", value: "" },
                  { label: "本月", value: "" },
                  { label: "上月", value: "" },
                  { label: "今年", value: "" },
                  { label: "去年", value: "" },
                ]}
              ></Select>
            )}

          {/* 4.1  单个 string类型 input 输入框 */}
          {(reData.opt === "eq" ||
            reData.opt === "ne" ||
            reData.opt === "like" ||
            reData.opt === "startsWith" ||
            reData.opt === "endsWith") &&
            !currField.pathName.endsWith("Id") &&
            currField.entityFieldName !== "id" &&
            currField.dictCode === null &&
            currField.fieldType === "string" && (
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
            )}
          {/* 4.2 外键数据eq匹配，弹出层组件 */}
          {(reData.opt === "eq" || reData.opt === "ne") &&
            currField.pathName.endsWith("Id") &&
            currField.entityFieldName === "id" &&
            currField.fieldType === "string" && (
              <div className={" w-32"}>
                <RelationTagInput
                  req={{ app: true }}
                  value={
                    reData.value && reData.value.length > 0
                      ? reData.value[0]
                      : undefined
                  }
                  onDataChange={(data) => {
                    setReData({ ...reData, value: [data] });
                  }}
                  fieldInfo={currField}
                />
              </div>
            )}

          {/* 4.2 外键数据eq匹配，弹出层组件 */}
          {currField.fieldType === "number" && (
            <InputNumber
              placeholder="值"
              style={{ width: "130px" }}
              value={
                reData.value && reData.value.length > 0
                  ? reData.value[0]
                  : undefined
              }
              onNumberChange={(v: number) => {
                setReData({ ...reData, value: [v] });
              }}
            />
          )}
          {reData.opt === OptEnum.fix && ( //固定值
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
          )}
          {/*  字典类型 */}
          {reData.opt === "eq" && currField && currField.dictCode !== null && (
            <Select
              style={{ width: "130px" }}
              value={reData.value ? reData.value[0] : undefined}
              onChange={(data) => {
                setReData({ ...reData, value: [data as string] });
              }}
              optionList={dicts[currField.dictCode].data}
            ></Select>
          )}
          {reData.opt === "in" && currField && currField.type === "date" && (
            <>
              <DatePicker style={{ width: "100px" }}></DatePicker>
            </>
          )}
        </>
      )}
    </>
  );
};
