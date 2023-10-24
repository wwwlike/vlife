import { ProjectDto, save } from "@src/api/demo/DemoProject";
import { VF } from "@src/dsl/VF";
import Content from "@src/pages/template/content";
import React from "react";

//项目管理页面
export default () => {
  return (
    <Content
      filterType="demoProjectPageReq"
      listType="demoProject"
      editType="projectDto"
      reaction={[
        //项目的工时等于所有任务的工时合计
        VF.then("point")
          .readPretty()
          .then("point")
          .value((d: ProjectDto) => {
            return d?.taskList
              ?.map((task) => task.point)
              .reduce((a, b) => a + b, 0);
          }),
        //起止日期校验
        VF.result((d: ProjectDto) => {
          return d.beginDate > d.endDate;
        })
          .then("beginDate")
          .feedback("开始日期不能晚于结束日期"),
        // 项目状态为`进行中`时可以对任务进行编辑，其他状态不能操作
        VF.field("state").ne("1").then("taskList").readPretty(true),
        // VF.field("state").ne("0").then("total").readPretty(true),
      ]}
      otherBtns={[
        {
          title: "项目完成",
          actionType: "api",
          usableMatch: { state: "1" },
          submitConfirm: false,
          onSaveBefore(data: ProjectDto) {
            return { ...data, state: "3" }; //提交给后端处理过的数据2为已完成
          },
          saveApi: save, //finish为后端
        },
        {
          title: "项目重启",
          actionType: "api",
          usableMatch: { state: "3" },
          submitConfirm: false,
          onSaveBefore(data: ProjectDto) {
            return { ...data, state: "1" }; //提交给后端处理过的数据2为已完成
          },
          saveApi: save, //finish为后端
        },
      ]}
    />
  );
};
