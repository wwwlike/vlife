/**
 * 字段排序选择组件
 * 1. 拖拽排序
 * 2. 最新field信息返回出去
 */

import { Divider, Tag } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/api/FormField";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconPlus,
  IconHandle,
  IconEyeOpened,
  IconDeleteStroked,
} from "@douyinfe/semi-icons";
import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";
import RGL, {
  WidthProvider,
  Responsive,
  Layout as LayoutDataType,
} from "react-grid-layout";
import { Mode } from "@src/dsl/schema/base";
import SelectIcon from "@src/components/SelectIcon";
import { ComponentInfos } from "@src/dsl/datas/components";
import VlifeButton from "@src/components/vlifeButton";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface FieldSelectProps {
  mode: Mode;
  className?: string;
  fields: FormFieldVo[]; //所有字段
  del?: boolean; //是否支持删除
  onDataChange: (ang: FormFieldVo[]) => void; //数据返回出去
  selectedField?: string; //外部选中字段
  onSelect: (fieldName: string) => void; //当前选中字段
}
const FieldSelect = ({
  fields,
  mode,
  selectedField,
  onSelect,
  del,
  className,
  onDataChange,
}: FieldSelectProps) => {
  /**
   * 布局内容
   */
  const [content, setContent] = useState<LayoutDataType[]>();
  const [selectField, setSelectField] = useState<string | undefined>();

  useEffect(() => {
    setSelectField(selectedField);
  }, [selectedField]);

  const [draggable, setDraggable] = useState<boolean>(true);
  /**
   * 布局改变
   * 数量，大小，位置
   */
  const onLayoutChange = useCallback(
    (divLayout: LayoutDataType[]) => {
      // alert(JSON.stringify(content) === JSON.stringify(divLayout));
      //divLdivayout div删除后就减少了
      setContent(divLayout);
      // alert(fields);
      // if (content !== undefined) {
      onDataChange(
        fields.map((f) => {
          const filterdivs = divLayout.filter(
            (layout) => layout.i === f.fieldName
          );
          if (filterdivs && filterdivs.length > 0) {
            return { ...f, sort: filterdivs[0].y / 18 / 2 + 1 };
          }
          return f;
        })
      );
    },
    // },
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
      // alert(newFields.length);/
      onDataChange(newFields);
    },
    [JSON.stringify(fields)]
  );

  return (
    <div className={`${className}  bottom-1 border-black`}>
      <div className="  text-xs font-bold font-serif mx-4 bottom-1 border-black flex items-center">
        {mode === Mode.form ? (
          <>
            <div>
              可见字段(
              {
                fields.filter(
                  (f) => f.x_hidden === false || f.x_hidden === undefined
                ).length
              }
              )
            </div>
            <div
              className=" absolute right-2 cursor-pointer hover:text-blue-500"
              onClick={() => setDraggable(!draggable)}
            ></div>
          </>
        ) : (
          <div>列表字段</div>
        )}
      </div>
      <Divider margin="12px" align="left"></Divider>
      <div className="flex">
        {/* 拖拽区域 */}
        <ResponsiveReactGridLayout
          // 设计阶段，不需要自适应与划出设置组件会有冲突
          // key={pageConf?.id + (size?.width + "")}
          margin={[0, 0]} //div之间的间距
          allowOverlap={false} //是否可以重叠 false 默认不能重叠
          onLayoutChange={onLayoutChange} // 布局改变事件
          isResizable={false}
          isDraggable={draggable}
          // className=" hover:bg-slate-500"
          cols={{ lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }}
          rowHeight={1}
          // width={130}
          style={{ width: "130px" }}
          // isDroppable={true}
          // compactType="horizontal"
        >
          {/*  ${pageComponent.i ? " z-" + pageComponent.i : ""} */}

          {fields
            ?.filter((f) => f.x_hidden !== true)
            .map((field: FormFieldVo, index: number) => {
              return (
                <div
                  // style={{ width: "80px" }}
                  id={field.fieldName}
                  key={field.fieldName}
                  className=" relative  group flex space-x-2 items-center w-10 left-4
                   hover:border hover:rounded-md hover:border-blue-500 border-dashed
                  "
                  data-grid={{
                    ...field,
                    x: 10,
                    y: index * 18,
                    w: 20,
                    h: 36,
                  }}
                >
                  {draggable && (
                    <div>
                      {ComponentInfos[field.x_component]?.icon ? (
                        <SelectIcon
                          tooltip={"拖拽改变顺序"}
                          className="cursor-move"
                          read
                          value={ComponentInfos[field.x_component]?.icon}
                        ></SelectIcon>
                      ) : (
                        <IconHandle className="  cursor-move"></IconHandle>
                      )}
                    </div>
                  )}

                  <Tag
                    className=" cursor-pointer "
                    style={{ width: "80px" }}
                    size="large"
                    onClick={() => {
                      setSelectField(field.fieldName);
                      onSelect(field.fieldName);
                    }}
                    color="blue"
                    type={`${
                      selectField === field.fieldName ? "solid" : "ghost"
                    }`}
                  >
                    {field.title || field.fieldName}
                  </Tag>
                </div>
              );
            })}
        </ResponsiveReactGridLayout>
        {/* 创一个和拖拽div高度一致的按钮容器div */}
        {
          // draggable && (
          //     <div className=" h-full border-blue-600 space-y-2 ">
          //       <ResponsiveReactGridLayout
          //         key={JSON.stringify(fields.map((f) => f.fieldName))}
          //         margin={[0, 0]} //div之间的间距
          //         allowOverlap={false} //是否可以重叠 false 默认不能重叠
          //         isResizable={false}
          //         cols={{ lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }}
          //         rowHeight={1}
          //         isDraggable={false}
          //         style={{ width: "80px" }}
          //       >
          //         {fields
          //           .sort((f, t) => f.sort - t.sort)
          //           ?.filter((f) => f.x_hidden !== true)
          //           .map((field: FormFieldVo, index: number) => {
          //             return (
          //               <div
          //                 style={{ width: "80px" }}
          //                 id={field.fieldName}
          //                 key={field?.fieldName + "_btn"}
          //                 className=" static group flex space-x-2 items-center w-10 left-4"
          //                 data-grid={{
          //                   ...field,
          //                   x: 10,
          //                   y: index * 18,
          //                   w: 20,
          //                   h: 36,
          //                 }}
          //               >
          //                 {selectField !== field.fieldName && del && (
          //                   <>
          //                     {/* {field.fieldName + field.sort} */}
          //                     <VlifeButton
          //                       type="tertiary"
          //                       theme="borderless"
          //                       onClick={() => {
          //                         quickField([{ ...field, x_hidden: true }]);
          //                       }}
          //                       className={` text-blue-500`}
          //                       icon={<IconDeleteStroked />}
          //                       style={{ margin: 12 }}
          //                     ></VlifeButton>
          //                   </>
          //                 )}
          //               </div>
          //             );
          //           })}
          //       </ResponsiveReactGridLayout>
          //     </div>
          //   )
        }
      </div>
      {fields?.filter((f) => f.x_hidden === true).length > 0 ? (
        <>
          <Divider margin="12px" align="left" />
          <div className=" text-xs font-bold font-serif mx-4 bottom-1 border-black">
            隐藏字段({fields?.filter((f) => f.x_hidden === true).length})
          </div>
          <Divider margin="12px" align="left"></Divider>
          <div className="  space-y-0 p-1">
            {fields
              ?.filter((f) => f.x_hidden === true)
              ?.map((field: FormFieldVo, index: number) => {
                return (
                  <div
                    key={"hidden_" + field.fieldName}
                    className=" group flex  items-center px-4 my-1 h-9"
                  >
                    <Tag
                      // className="group-hover:bg-slate-200 "
                      style={{ width: "80px" }}
                      size="large"
                      onClick={() => {
                        setSelectField(field.fieldName);
                        onSelect(field.fieldName);
                      }}
                      // color="blue"
                      type={`${
                        selectField === field.fieldName ? "solid" : "ghost"
                      }`}
                    >
                      {field.title || field.fieldName}
                    </Tag>
                    <VlifeButton
                      tooltip="恢复可见"
                      className=" "
                      type="tertiary"
                      theme="borderless"
                      onClick={() => {
                        quickField([{ ...field, x_hidden: false }]);
                      }}
                      icon={<IconPlus />}
                      style={{ margin: 12 }}
                    ></VlifeButton>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default FieldSelect;
