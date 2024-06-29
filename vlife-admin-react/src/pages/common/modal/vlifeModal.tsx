import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
/**
 * 1. 动态取数据，页面提供配置，然后存到前端 reactQuery方式缓存
 */
export interface modalProps {
  width?: number; //宽度
  height?: number;
  title?: string; //
  children: React.ReactElement<{
    //手工传入页面用作按钮触发弹出modal; 该页面需要支持 数据传出onDataChange；该modal不赋值数据保存接口调用，只需要把最新数据传出即可
    onDataChange: (data: any) => void; //modal弹窗内部数据变化通知外层(一般是通知modal的按钮进行数据保存)
  }>;
  // footer:false:ReactNode
  okFun?: (data: any) => Promise<any>; //点击确认回调的方法
  submitClose?: boolean; //确认后关闭
}

/**
 */
export const vlifeModal = createNiceModal(
  "vlifeModal",
  ({
    children,
    width = 800,
    height = 600,
    title = "",
    submitClose = false,
    okFun,
    ...prop
  }: modalProps) => {
    const modal = useNiceModal("vlifeModal");
    const [data, setData] = useState();
    const _children = useMemo(() => {
      return (
        <>
          {React.cloneElement(children, {
            //克隆组件，并给组件传入2个方法
            onDataChange: (__data: any) => {
              setData(__data);
            },
          })}
        </>
      );
    }, [children]);
    useEffect(() => {}, [title]);
    return okFun ? (
      <NiceModal
        className="  !relative "
        id="vlifeModal"
        title={title}
        width={width}
        height={height}
        onOk={() => {
          if (data) {
            okFun && okFun(data);
            submitClose && modal.hide();
          } else {
            alert("请填写完整数据");
          }
          //ok方法拿到数据才有意义
        }}
      >
        {_children}
      </NiceModal>
    ) : (
      <NiceModal
        className="  !relative "
        id="vlifeModal"
        title={title}
        width={width}
        height={height}
        footer={false}
      >
        {_children}
      </NiceModal>
    );
  }
);

export default vlifeModal;
