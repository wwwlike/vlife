import { IconEyeClosedSolid, IconSun } from "@douyinfe/semi-icons";
import { Divider, Tooltip } from "@douyinfe/semi-ui";
import { FormItem, IFormItemProps } from "@formily/semi";
import React from "react";

interface DesignFormItemProps extends IFormItemProps {
  children: any;
  fieldName: string;
  highlight: string; //高亮字段
  required: boolean;
  itemType: string;
  onClick: (d: string, opt: "click" | "delete" | "must") => void; //支持点击的三类操作，删除，必填(取消必填)，不可见
}

/**
 * 自定义表单控件的包裹组件，支持进行隐藏，必填的快捷操作
 * 1.事件冒泡，
 * 2.按钮的布局定位
 * 3.操作事件回调
 */
export default ({
  gridSpan,
  fieldName,
  onClick,
  highlight,
  required,
  itemType,
  ...props
}: DesignFormItemProps) => {
  return (
    <>
      {
        <FormItem
          // className={`m-10`}
          addonBefore={
            <div
              onClick={(event) => {
                event.cancelable = true; //阻止事件冒泡
                onClick(fieldName, "click");
                event.stopPropagation();
              }}
              // border border-blue-500 border-dashed
              // className=" hidden group-hover:block bg-slate-200 z-0 absolute h-full w-full left-0 "
              className={`${
                highlight === fieldName ? "" : "hidden"
              }  group-hover:block  rounded-md left-0 top-0  absolute h-full w-full `}
            >
              {itemType !== "req" && (
                <div className=" absolute  right-0 -bottom-2 bg-white rounded-3xl w-15 p-1 flex space-x-1">
                  <Tooltip content="隐藏">
                    <IconEyeClosedSolid
                      size="small"
                      className={`text-blue-500`}
                      onClick={(event) => {
                        event.cancelable = true; //阻止事件冒泡
                        onClick(fieldName, "delete");
                        event.stopPropagation();
                        //删除
                      }}
                    />
                  </Tooltip>
                  <Divider layout="vertical" />
                  <Tooltip content="必填">
                    <IconSun
                      size="small"
                      className={`${
                        required ? "text-red-500" : " text-gray-500"
                      }`} //选中就是红色
                      onClick={(event) => {
                        event.cancelable = true; //阻止事件冒泡
                        onClick(fieldName, "must");
                        event.stopPropagation();
                        //必填
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          }
          gridSpan={gridSpan}
          {...props}
          className=" h-full -top-2 group cursor-pointer rounded-md  font-bold hover:bg-slate-50 "
        />
      }
    </>
  );
};
