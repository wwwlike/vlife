import React, { useCallback, useMemo } from "react";
import {
  DatePicker,
  Input,
  InputNumber,
  Select,
  TagInput,
} from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import RelationTagInput from "@src/components/RelationTagInput";
import { useAuth } from "@src/context/auth-context";
import { DataType } from "@src/dsl/base";
import { where } from "../types";
import { ISelect } from "@src/dsl/component";
export interface ConditionProps {
  where: Partial<where>;
  formVo: FormVo;
  subForms?: FormVo[]; //1对多数据子集
  mode?: "build" | "list"; //使用场景  视图设计器|查询列表
  className?: string;
  onDataChange: (where: Partial<where>) => void;
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
    fk?: boolean; //外键类型字段是否能用
  };
} = {
  dynamic: { label: "动态范围", fieldType: ["date"], dict: false, fk: false }, //当前用户 用户表上的外键 可以使用sys系统值进行匹配
  eq: {
    label: "等于",
    fieldType: ["string", "number", "date", "boolean"],
  },
  ne: {
    label: "不等于",
    fieldType: ["string", "number", "date", "boolean"],
  },
  isNull: {
    label: "为空",
    fieldType: ["string", "number", "date", "boolean"],
  },
  isNotNull: {
    label: "不为空",
    fieldType: ["string", "number", "date", "boolean"],
  },
  in: {
    label: "等于任意一个",
    fieldType: ["string", "number", "boolean"],
  },
  notIn: {
    label: "不等于任意一个",
    fieldType: ["string", "number", "boolean"],
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
  // between: {
  //   label: "范围",
  //   fieldType: ["date", "number"],
  //   dict: false,
  //   fk: false,
  // },
  // in: {
  //   label: "in",
  //   fieldType: ["string"],
  // },
  gt: { label: "大于", fieldType: ["date", "number"], dict: false, fk: false },
  goe: {
    label: "大于等于",
    fieldType: ["date", "number"],
    dict: false,
    fk: false,
  },
  lt: { label: "小于", fieldType: ["date", "number"], dict: false, fk: false },
  loe: {
    label: "小于等于",
    fieldType: ["date", "number"],
    dict: false,
    fk: false,
  },
  like: { label: "包涵", fieldType: ["string"], dict: false, fk: false },
  notLike: { label: "不包涵", fieldType: ["string"], dict: false, fk: false },
  // fix: { label: "用户匹配", fieldType: [], dict: false, fk: true }, //当前用户 用户表上的外键 可以使用sys系统值进行匹配
};

export const dates = [
  { label: "今天", value: "today" },
  { label: "昨天", value: "yesterday" },
  { label: "本周", value: "this_week" },
  { label: "上周", value: "last_week" },
  { label: "本月", value: "this_month" },
  { label: "上月", value: "last_month" },
  { label: "今年", value: "this_year" },
  { label: "去年", value: "last_year" },
  { label: "近7天", value: "last_7_days" },
  { label: "近30天", value: "last_30_days" },
  { label: "近90天", value: "last_90_days" },
  { label: "近一年", value: "last_1_year" },
];
/**
 * 单行条件信息
 */
export default ({
  where,
  formVo,
  mode = "build",
  className,
  subForms,
  onDataChange,
  ...props
}: ConditionProps) => {
  const { dicts } = useAuth();

  /**
   * 当前字段信息
   */
  const currField = useMemo((): FormFieldVo | undefined => {
    if (where.entityName && where.fieldName) {
      return [formVo, ...(subForms || [])]
        .filter((form) => form.entityType === where.entityName)?.[0]
        ?.fields.filter((f) => f.fieldName === where.fieldName)?.[0];
    }
    return undefined;
  }, [formVo, subForms, where.fieldName, where.entityName]);

  const formOptions = useCallback(
    (formVo: FormVo, prefix?: string): ISelect[] => {
      let fields = formVo.fields.filter((d) => d.fieldName !== "id");
      //列表查询条件仅显示列表里的字段并排序
      if (mode === "list") {
        fields = fields
          .filter(
            (d) =>
              d.listHide === true ||
              d.listHide === undefined ||
              d.listHide === null
          )
          .sort((a, b) => a.listSort - b.listSort);
      }
      return fields.map((d) => {
        return {
          label: prefix ? prefix + d.title : d.title,
          value: `${formVo.entityType},${d.fieldName}`,
        };
      });
    },

    [mode]
  );

  const fieldOptions = useMemo((): ISelect[] => {
    let options = formOptions(formVo);
    subForms?.forEach((sub) => {
      options = options.concat(formOptions(sub, sub.title + "-"));
    });
    return options;
  }, [formVo, subForms, mode]);

  const optOptions = useMemo((): { label: string; value: string }[] => {
    if (currField) {
      return Object.keys(OPT)
        .filter(
          //字段类型满足判断
          (k) =>
            currField.fieldType &&
            OPT[k].fieldType?.includes(currField.fieldType)
        )
        .filter(
          //字典类型满足判断
          (k) =>
            (currField?.dictCode !== undefined && OPT[k].dict !== false) ||
            (OPT[k].dict !== true &&
              (currField.dictCode === undefined || currField.dictCode === null))
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
        });
    } else {
      return [];
    }
  }, [currField]);

  return (
    <div className={`flex ${className} w-full space-x-2 `}>
      {/* {JSON.stringify(where)} */}
      <Select
        className="!w-1/3"
        placeholder="关联应用字段"
        optionList={fieldOptions}
        value={
          where.entityName
            ? `${where.entityName},${where.fieldName}`
            : where.fieldName
        }
        onChange={(data: any) => {
          const fieldName = (data as string).split(",")[1];
          const entityName = (data as string).split(",")[0];
          onDataChange({
            ...where,
            fieldName,
            entityName,
            opt: undefined,
            value: undefined,
            desc: {
              ...where.desc,
              opt: undefined,
              value: undefined,
              fieldName: fieldOptions.filter(
                (f) => f.value === `${data as string}`
              )?.[0]?.label,
            },
          });
        }}
      />
      <Select
        className="!w-1/3"
        placeholder="匹配符"
        optionList={optOptions}
        value={where.opt}
        onChange={(data: any) => {
          onDataChange({
            ...where,
            fieldType: currField?.fieldType,
            opt: data,
            value: undefined,
            desc: {
              ...where.desc,
              value: undefined,
              opt: optOptions.filter((f) => f.value === data)[0]?.label,
            },
          });
        }}
      />
      {/* 匹配值 各类控件的使用场景 */}
      {/* 1  动态范围*/}
      {where.opt === "dynamic" ? (
        <Select
          className="!w-1/3"
          optionList={dates}
          value={where?.value?.[0]}
          placeholder="匹配值"
          onChange={(data: any) =>
            onDataChange({
              ...where,
              fieldType: currField?.fieldType,
              value: [data],
              desc: {
                ...where.desc,
                value: dates.filter((f) => f.value === data)[0]?.label,
              },
            })
          }
        /> // 外键
      ) : currField &&
        currField.pathName.endsWith("Id") &&
        currField.entityFieldName === "id" &&
        currField.fieldType === "string" ? (
        <RelationTagInput
          req={{ app: true }}
          className="!w-1/3"
          key={where.value}
          value={
            where.opt === "in" || where.opt === "notIn"
              ? where?.value
              : where?.value?.[0]
          }
          onObjectlChange={(data: ISelect[]) => {
            onDataChange({
              ...where,
              fieldType: currField?.fieldType,
              value: data.map((d) => d.value),
              desc: {
                ...where.desc,
                value: data.map((d) => d.label),
              },
            });
          }}
          fieldInfo={{
            ...currField,
            dataType:
              where.opt === "in" || where.opt === "notIn"
                ? DataType.array
                : DataType.basic,
          }}
        />
      ) : currField && currField?.dictCode !== null ? (
        <Select
          className="!w-1/3"
          // onChangeWithObject={true}
          multiple={where.opt === "in" || where.opt === "notIn"}
          value={
            where.opt === "in" || where.opt === "notIn"
              ? where?.value
              : where?.value?.[0]
          }
          optionList={dicts[currField.dictCode].data}
          onChange={(data: any) => {
            onDataChange({
              ...where,
              fieldType: currField?.fieldType,
              value:
                where.opt === "in" || where.opt === "notIn" ? data : [data],
              desc: {
                ...where.desc,
                value: dicts[currField.dictCode].data.filter(
                  (f) => f.value === data
                )[0].label,
              },
            });
          }}
        />
      ) : currField?.fieldType === "string" &&
        (where.opt === undefined ||
          where.opt === "eq" ||
          where.opt === "startsWith" ||
          where.opt === "endsWith" ||
          where.opt === "like" ||
          where.opt === "notLike" ||
          where.opt === "ne") ? (
        <>
          <Input
            placeholder="匹配值"
            className="!w-1/3"
            value={where?.value?.[0]}
            onChange={(data) => {
              onDataChange({
                ...where,
                fieldType: currField?.fieldType,
                value: [data],
              });
            }}
          />
        </>
      ) : (currField?.fieldType === "string" ||
          currField?.fieldType === "number") &&
        (where.opt === "in" || where.opt === "notIn") ? (
        <TagInput
          className="!w-1/3"
          // defaultValue={where.value}
          value={where.value}
          placeholder="匹配值"
          onChange={(data) =>
            onDataChange({
              ...where,
              fieldType: currField?.fieldType,
              value: data,
            })
          }
        />
      ) : currField?.fieldType === "number" &&
        where.opt !== "isNull" &&
        where.opt !== "isNotNull" ? (
        <InputNumber
          placeholder="匹配值"
          className="!w-1/3"
          value={where?.value?.[0]}
          onChange={(data) => {
            onDataChange({
              ...where,
              fieldType: currField?.fieldType,
              value: [data as number],
            });
          }}
        />
      ) : currField?.fieldType === "date" &&
        where.opt !== "isNull" &&
        where.opt !== "isNotNull" ? (
        <DatePicker
          type="date"
          format="yyyy/MM/dd"
          insetInput
          placeholder="匹配值"
          className="!w-1/3"
          value={where?.value?.[0]}
          onChange={(data, dataString) => {
            onDataChange({
              ...where,
              fieldType: currField?.fieldType,
              value: [dataString],
            });
          }}
        />
      ) : (
        ""
        // <Input
        //   placeholder="匹配值"
        //   className="!w-1/3"
        //   value={where.value}
        //   onChange={(data) => {
        //     onDataChange({ ...where, value: [data] });
        //   }}
        // />
      )}
    </div>
  );
};
