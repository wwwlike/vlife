import { Tooltip } from "@douyinfe/semi-ui";
import Button, { ButtonProps } from "@douyinfe/semi-ui/lib/es/button";
import { useAuth } from "@src/context/auth-context";
import { BtnType } from "@src/dsl/schema/button";
import { useEffect } from "react";
export interface VFButtonPorps extends ButtonProps {
  /**
   * 权限code
   */
  code?: string;
  tooltip?: string;
  btnType?: "button" | "text" | "icon";
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
          {/* {btnType === "text" && (
            <div className=" text-gray-400 hover:text-blue-500  cursor-pointer">
              <span>{prop.children}</span>
            </div>
          )} */}
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
