//用户信息展示组件
import { SysUser } from "@src/api/SysUser";
import { useAuth } from "@src/context/auth-context";
import { useEffect, useState } from "react";
export interface ShowUserProps {
  userId?: string;
  className?: string;
}

export default ({ userId, className }: ShowUserProps) => {
  const { getUserInfo } = useAuth();
  const [sysUser, setSysUser] = useState<SysUser>();
  useEffect(() => {
    userId &&
      getUserInfo(userId).then((res) => {
        setSysUser(res);
      });
  }, []);
  return <span className={`${className || ""}`}>{sysUser?.name}</span>;
};
