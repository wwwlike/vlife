import React from "react";
import Content from "@src/pages/template/content";
import { useNavigate } from "react-router-dom";
import apiClient from "@src/api/base/apiClient";
export default () => {
  const navigate = useNavigate();
  return (
    <Content
      listType="flowDeployment"
      btns={[
        {
          title: "创建流程",
          actionType: "create",
          position: "tableToolbar",
          onClick: (d) => {
            navigate("/flow/design");
          },
        },
        {
          title: "发布流程",
          actionType: "click",
          onClick: (d) => {
            apiClient
              .get(`/flowDeployment/publicFlow?id=sysUserFlow`)
              .then((d) => {
                if (d.data === true) {
                  alert("发布成功");
                } else {
                  alert("不能重複發佈");
                }
              });
          },
        },
        {
          title: "启动流程",
          actionType: "click",
          onClick: (d) => {
            apiClient
              .get(`/flowDeployment/start?instanceName=报价审核&id=${d.id}`)
              .then((d) => {
                if (d.data === 1) {
                  alert("启动成功");
                } else if (d.data === 0) {
                  alert("流程还未定义");
                } else if (d.data === 2) {
                  alert("已经启动该流程实例");
                }
              });
          },
        },
        {
          title: "我的待办",
          actionType: "click",
          onClick: (d) => {
            apiClient.get(`/flowDeployment/myTasks?id=${d.id}`).then((d) => {
              alert("当前待办数量" + d.data);
            });
          },
        },
        {
          title: "xml",
          actionType: "click",
          onClick: (d) => {
            apiClient.get(`/flowDeployment/xml`).then((d) => {
              alert(d.data);
            });
          },
        },
        {
          title: "流程处理",
          actionType: "click",
          onClick: (d) => {
            apiClient
              .get(`/flowDeployment/completeTask?id=${d.id}`)
              .then((d) => {
                if (d.data === true) {
                  alert("流程处理完成");
                } else {
                  alert("没有待处理的任务");
                }
              });
          },
        },
        {
          title: "流程查看",
          actionType: "click",
          onClick: (d) => {
            navigate("/flow/design", { state: { json: d.json } });
          },
        },
      ]}
    />
  );
};
