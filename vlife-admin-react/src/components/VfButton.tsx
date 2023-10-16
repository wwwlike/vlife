import React from "react";
import { Tooltip } from "@douyinfe/semi-ui";
import Button, { ButtonProps } from "@douyinfe/semi-ui/lib/es/button";
import { useAuth } from "@src/context/auth-context";
export interface VFButtonPorps extends ButtonProps {
  code?: string; //权限code
  tooltip?: string; //不可用提示
  btnType?: "button" | "text" | "icon"; //按钮类型
}

export default ({
  code,
  tooltip,
  hidden,
  btnType = "button",
  ...prop
}: VFButtonPorps) => {
  const { checkBtnPermission } = useAuth();
  return hidden === true ? (
    <></>
  ) : tooltip ? (
    (code && checkBtnPermission(code)) || code === undefined ? (
      btnType === "button" ? (
        <Tooltip content={tooltip}>
          <Button {...prop}></Button>
        </Tooltip>
      ) : (
        <Tooltip content={tooltip}>
          <div className=" text-gray-400 hover:text-blue-500  cursor-pointer">
            <span>{prop.children}</span>
          </div>
        </Tooltip>
      )
    ) : (
      <></>
    )
  ) : (code && checkBtnPermission(code)) || code === undefined ? (
    <>
      {btnType === "button" && <Button {...prop}></Button>}
      {btnType === "text" && (
        <div className=" text-gray-700 hover:text-blue-500  cursor-pointer">
          <span onClick={prop.onClick}>{prop.children}</span>
        </div>
      )}
    </>
  ) : (
    <></>
  );
};
