import React, { ReactNode } from "react";
import BtnResourcesToolBar from "@src/components/button/component/BtnResourcesToolBar";
import { VFBtn } from "@src/components/button/types";
import { useAuth } from "@src/context/auth-context";
import classNames from "classnames";
import Buttons from "@src/components/button/component/Buttons";
/**
 * 可配置组件的包裹组件
 */
export interface ConfWrapperProps {
  children: ReactNode;
  buttons: VFBtn[]; //children的配置按钮
  className?: string;
  confIcon?: ReactNode; //当前buttons的图标
  position?: "start" | "end";
}
export default (props: ConfWrapperProps) => {
  const { buttons, children, position = "end", confIcon } = props;
  const { user } = useAuth();
  return (
    <div className=" inline-flex items-center">
      {user?.superUser && buttons && buttons.length > 0 ? (
        //border-red-200  hover:border-red-400 border-dotted  hover:border-2
        // <span className={`relative z-50 rounded-md p-1 ${props.className}`}>
        <>
          {position === "start" && (
            <BtnResourcesToolBar
              className="inline"
              dropdown={confIcon || true}
              btnConf={true}
              btns={buttons}
            />
          )}
          <span
            className={`${classNames({
              " ml-4": position === "start",
              " mr-4": position === "end",
            })}`}
          >
            {children}
          </span>
          {position === "end" && (
            <BtnResourcesToolBar
              className="inline"
              dropdown={confIcon || true}
              btns={buttons}
            />
          )}
        </>
      ) : (
        // </span>
        <>{children}</>
      )}
    </div>
  );
};
