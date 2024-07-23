import React from "react";
import { IllustrationNoAccess } from "@douyinfe/semi-illustrations";
import { Button, Empty } from "@douyinfe/semi-ui";
import { useAuth } from "@src/context/auth-context";
import { useNavigate } from "react-router-dom";

export default () => {
  const { loginOut } = useAuth();
  const navigate = useNavigate();
  return (
    <Empty
      image={<IllustrationNoAccess />}
      title={"没有权限"}
      description={"没有权限, 请联系管理员或者重新登录"}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        style={{ padding: "6px 24px", width: " 180px" }}
        theme="solid"
        type="primary"
        onClick={() => navigate(`/`, { replace: true })}
      >
        回到首页
      </Button>
      <Button
        style={{ padding: "6px 24px", width: " 180px" }}
        theme="solid"
        type="primary"
        onClick={loginOut}
      >
        重新登录
      </Button>
    </Empty>
  );
};
