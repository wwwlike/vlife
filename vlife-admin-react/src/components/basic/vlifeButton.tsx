import Button, { ButtonProps } from "@douyinfe/semi-ui/lib/es/button";
import { useAuth } from "@src/context/auth-context";
import React from "react";

/**
 * 扩展semi button
 * 1. 支持权限统一控制
 */
interface vfButPorp extends ButtonProps {
  /**
   * 权限code
   */
  code: string;
}
export default ({ code, ...prop }: vfButPorp) => {
  const { checkBtnPermission } = useAuth();

  return checkBtnPermission(code) ? <Button {...prop}></Button> : <></>;
};
