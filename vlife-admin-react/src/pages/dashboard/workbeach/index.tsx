import React, { useState } from "react";
import { Card } from "@douyinfe/semi-ui";
import { useRequest } from "ahooks";
import { Notification } from "@douyinfe/semi-ui";
import { useSelector } from "react-redux";

//ahook 模拟请求 hooks示例

function changeUsername(username: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

export default () => {
  const [state, setState] = useState("0");
  const [currNum, setCurrNum] = useState(0);
  const gloable = useSelector((state) => state);

  const { loading, run } = useRequest(changeUsername, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.success) {
        setState("");
        Notification.info({
          content: `The username was changed to "${params[0]}" !`,
        });
      }
    },
  });

  return (
    <div>
      <Card
        className="text-xl"
        title="vlife-admin是基于vlife前后端组件封装能力打造的权限管理的脚手架应用"
      >
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          VLIFE是一款面向的“开发人员”的企业前后端研发平台,对研发人员的门槛要求较低，开发效率提升数倍以上。
          目前所有源码均开源；
        </p>
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          【技&nbsp;&nbsp;术&nbsp;&nbsp;栈】： 前端react 后端：springboot
        </p>
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          【使用指南】{" "}
          <a target={"_blank"} href="http://vlife.cc">
            http://vlife.cc
          </a>
        </p>
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          【VLIFE平台】
          <a target={"_blank"} href="https://github.com/wwwlike/vlife">
            https://github.com/wwwlike/vlife
          </a>
        </p>
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          【VLIFE-ADMIN后端】
          <a target={"_blank"} href="https://github.com/wwwlike/vlife-admin">
            https://github.com/wwwlike/vlife-admin
          </a>
        </p>
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          【VLIFE-ADMIN前端】
          <a
            target={"_blank"}
            href="https://github.com/wwwlike/vlife-admin-react"
          >
            https://github.com/wwwlike/vlife-admin-react
          </a>
        </p>
        <p className="text-xl" style={{ lineHeight: 1.8 }}>
          【视频介绍】
          <a
            target={"_blank"}
            href="https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6"
          >
            五分钟了解vlife快速开发
          </a>
        </p>
      </Card>
      <Card className="text-xl" title="更新日志">
        <p>[10/12] 行级数据权限过滤 [权限组] - [数据权限]</p>
        <p>[10/14] 表单配置工具上线 [系统配置] - [表单设计]</p>
      </Card>
      <br></br>
      <Card className="text-xl" title="讨论&帮助">
        <img
          src="http://admin.vlife.cc/image/linkme.png"
          style={{ width: 950, height: 260, top: 10 }}
        />
        {/* <Steps className='bg-gray-300' current={currNum}  >
          <Steps.Step title="模型编写" description="模型、注释、注解、字典代码编写" onClick={()=>setCurrNum(0)} />
          <Steps.Step title="代码生成" description="注释提取、代码生成" onClick={()=>setCurrNum(1)} />
          <Steps.Step title="前端配置" description="菜单添加、字典同步" onClick={()=>setCurrNum(2)} />
          </Steps> */}
      </Card>
    </div>
  );
};
