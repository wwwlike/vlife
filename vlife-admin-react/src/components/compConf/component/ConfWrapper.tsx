import React, { ReactNode } from "react";
import BtnResourcesToolBar from "@src/components/button/component/BtnResourcesToolBar";
import { VFBtn } from "@src/components/button/types";
import { useAuth } from "@src/context/auth-context";

export interface ConfWrapperProps {
  className?: string;
  confIcon?: ReactNode;
  position?: string; //按钮显示位置
  buttons?: VFBtn[];
  children?: ReactNode;
}
export default (props: ConfWrapperProps) => {
  const { buttons, confIcon } = props;
  const { user } = useAuth();
  return (
    <>
      {user?.superUser && buttons && buttons.length > 0 ? (
        // hover:border-red-400 border-dotted border-red-200 border-2
        <span className="relative z-50   p-1   rounded-md  ">
          {props.children}
          <BtnResourcesToolBar
            className="inline"
            dropdown={confIcon || true}
            btns={buttons}
          />
        </span>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};
