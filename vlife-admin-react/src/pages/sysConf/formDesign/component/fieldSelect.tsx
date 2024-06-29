/**
 * 字段排序选择组件
 * 1. 拖拽排序
 * 2. 最新field信息返回出去
 */

import React, { useCallback, useState } from "react";
import { Badge, Button, Divider, Tag } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/api/FormField";
import { IconPlus, IconDeleteStroked } from "@douyinfe/semi-icons";
import "react-grid-layout/css/styles.css";
import {
  WidthProvider,
  Responsive,
  Layout as LayoutDataType,
} from "react-grid-layout";
import { Mode } from "@src/dsl/base";
import VfButton from "@src/components/button";
import { x64 } from "crypto-js";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
//字段拖拽排序，组件隐藏
interface FieldSelectProps {
  mode: Mode;
  className?: string;
  fields: FormFieldVo[]; //参与排序的字段
  outSelectedField?: string; //外部选中字段
  onDataChange: (ang: FormFieldVo[]) => void; //数据返回出去
  onSelect: (field: string) => void; //当前选中字段
}
const FieldSelect = ({
  fields,
  mode,
  outSelectedField,
  onSelect,
  className,
  onDataChange,
}: FieldSelectProps) => {
  const column2Flag =
    fields.filter((f) => f.x_hidden === false || f.x_hidden === undefined)
      .length > 100; //2行显示标识
  //布局改变 数量，大小，位置
  const onLayoutChange = useCallback(
    (divLayout: LayoutDataType[]) => {
      const sortDiv = divLayout.sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x;
        }
        return a.y - b.y;
      });
      onDataChange(
        fields
          .map((f) => {
            return {
              ...f,
              [mode === Mode.list ? "listSort" : "sort"]: undefined,
            };
          })
          .map((f) => {
            let sort: number = 0;
            sortDiv.forEach((div, index) => {
              if (div.i === f.fieldName) {
                sort = index + 1;
              }
            });
            return {
              ...f,
              [mode === Mode.list ? "listSort" : "sort"]: sort,
            };
          })
      );
    },
    [fields]
  );

  const quickField = useCallback(
    (quickFields: FormFieldVo[]) => {
      const newFields = fields.map((f) => {
        const siderFields: FormFieldVo[] = quickFields.filter(
          (quick) => quick.fieldName === f.fieldName
        );
        if (siderFields.length > 0) {
          return siderFields[0];
        }
        return f;
      });
      onDataChange(newFields);
    },
    [JSON.stringify(fields)]
  );

  return (
    <div className={`${className}  bottom-1 border-black p-4`}>
      <div className="   text-sm font-bold font-serif mx-4 bottom-1 border-black flex items-center">
        <div className="mt-3 relative w-full flex items-center">
          可见字段(
          {mode === Mode.form || mode === Mode.filter ? (
            <>
              {
                fields.filter(
                  (f) =>
                    f.x_hidden === false ||
                    f.x_hidden === undefined ||
                    f.x_hidden === null
                ).length
              }
            </>
          ) : (
            <>
              {
                fields.filter(
                  (f) =>
                    f.listHide === false ||
                    f.listHide === undefined ||
                    f.listHide === null
                ).length
              }
            </>
          )}
          ){" "}
          <span className=" absolute right-0 text-xs font-thin text-blue-300">
            <i className="  icon-h5_sort" /> 上下拖拽
          </span>
        </div>
      </div>
      <Divider margin="12px" align="left"></Divider>
      <div className="flex">
        <ResponsiveReactGridLayout
          // 设计阶段，不需要自适应与划出设置组件会有冲突
          // key={pageConf?.id + (size?.width + "")}
          margin={[0, 0]} //div之间的间距
          allowOverlap={false} //是否可以重叠
          onLayoutChange={onLayoutChange} // 布局改变事件
          isResizable={false}
          isDraggable={true}
          cols={
            !column2Flag
              ? { lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }
              : { lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }
          }
          rowHeight={1}
          style={{ width: "220px" }}
        >
          {fields
            ?.filter((f) => {
              return mode === Mode.list
                ? f.listHide === false ||
                    f.listHide === undefined ||
                    f.listHide === null
                : f.x_hidden === false ||
                    f.x_hidden === undefined ||
                    f.x_hidden === null;
            })
            .sort(
              (a, b) =>
                a[mode === Mode.list ? "listSort" : "sort"] -
                b[mode === Mode.list ? "listSort" : "sort"]
            )
            .map((field: FormFieldVo, index: number) => {
              return (
                <div
                  id={field.fieldName}
                  key={field.fieldName}
                  className={` cursor-move  relative  z-10  group flex space-x-2 items-center w-10 p-2
                        hover:border hover:rounded-md hover:border-blue-500 border-dashed
                        `}
                  data-grid={{
                    ...field,
                    x: column2Flag ? index % 2 : 1,
                    y: column2Flag ? ((index % 2) - 1) * 15 : 15,
                    w: 1,
                    h: 30,
                  }}
                >
                  <Badge
                    count={[mode === Mode.list ? field.listSort : field.sort]}
                  />
                  <Tag
                    className=" cursor-pointer z-20   "
                    style={{ width: column2Flag ? "100px" : "100px" }}
                    size="large"
                    onClick={(event) => {
                      event.stopPropagation();
                      // 处理按钮的点击事件
                      onSelect(field.fieldName);
                    }}
                    color="blue"
                    type={`${
                      outSelectedField === field.fieldName ? "solid" : "ghost"
                    }`}
                  >
                    {field.title || field.fieldName}
                  </Tag>
                  {!column2Flag && (
                    <Button
                      type="tertiary"
                      theme="borderless"
                      onClick={() => {
                        mode === Mode.list
                          ? quickField([{ ...field, listHide: true }])
                          : quickField([{ ...field, x_hidden: true }]);
                      }}
                      className={` text-blue-500`}
                      icon={<IconDeleteStroked />}
                      style={{ margin: 8 }}
                    ></Button>
                  )}
                </div>
              );
            })}
        </ResponsiveReactGridLayout>
      </div>

      <Divider margin="12px" align="left" />
      <div className="  text-sm font-bold font-serif mx-4 bottom-1 border-black">
        不展示字段(
        {mode === Mode.form || mode === Mode.filter ? (
          <>{fields.filter((f) => f.x_hidden === true).length}</>
        ) : (
          <>{fields.filter((f) => f.listHide === true).length}</>
        )}
        )
      </div>
      <Divider margin="8px" align="left"></Divider>
      <div className="  space-y-0 p-1">
        {fields
          ?.filter((f) => {
            return mode === Mode.list
              ? f.listHide === true
              : f.x_hidden === true;
          })
          ?.map((field: FormFieldVo, index: number) => {
            return (
              <div
                key={"hidden_" + field.fieldName}
                className=" group flex  items-center px-4  h-8"
              >
                <Tag
                  className="group-hover:bg-slate-200 "
                  style={{ width: "80px" }}
                  size="large"
                  onClick={() => {
                    // setSelectField(field.fieldName);
                    onSelect(field.fieldName);
                  }}
                  // color="blue"
                  type={`${
                    outSelectedField === field.fieldName ? "solid" : "ghost"
                  }`}
                >
                  {field.title || field.fieldName}
                </Tag>
                <Button
                  className=" "
                  type="tertiary"
                  theme="borderless"
                  onClick={() => {
                    mode === Mode.list
                      ? quickField([{ ...field, listHide: false }])
                      : quickField([{ ...field, x_hidden: false }]);
                  }}
                  icon={<IconPlus />}
                  style={{ margin: 12 }}
                ></Button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FieldSelect;
