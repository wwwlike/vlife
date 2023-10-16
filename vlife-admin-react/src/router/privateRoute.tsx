import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Empty from "@src/pages/common/Empty";
import { useAuth } from "@src/context/auth-context";
const PrivateRoute = ({ ...props }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  // 登录验证
  const logged = user?.name ? true : false;
  return logged ? (
    pathname === "/" ? (
      <Navigate to={{ pathname: `/dashboard/workbeach` }} replace />
    ) : (
      props.element
    )
  ) : (
    <Empty title="没有权限" description="您还没有登录，请先去登录" type="403" />
  );
};

export default PrivateRoute;
