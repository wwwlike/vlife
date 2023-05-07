import { Avatar, Card, Divider } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import React from "react";
export default () => {
  const { Meta } = Card;
  const minCard = (title: string, description?: string) => {
    return (
      <Card style={{ maxWidth: 360 }}>
        <Meta
          title={title}
          description={description}
          avatar={
            <Avatar
              size="default"
              src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
            />
          }
        />
      </Card>
    );
  };

  return (
    <Card title="vlife低代码研发平台">
      <div className=" flex space-x-8">
        {minCard("低代码平台", "面向研发人员")}
        {minCard("全栈开源", "前后端分离")}
        {minCard("权限管理骨架", "权限粒度适配性高")}
        {minCard("TS开发", "继承泛型封装完善")}
        {minCard("表单设计器", "简单好用试一试")}
        {minCard("模型编程", "面向模型编程的低代码平台")}
        {minCard("TS开发", "继承泛型封装完善")}
      </div>
      <div className=" text-xl m-2">
        开源地址：<a href="https://gitee.com/wwwlike/vlife">gitee</a>
      </div>
      <div className=" text-xl m-2">
        官网指南：<a href="http://vlife.cc">vlife.cc</a>
      </div>
      <Divider>联系</Divider>
      <div className=" text-xl m-2">
        关注公众号 “vlife低代码”,获取最新平台开发资料
      </div>

      <div className=" text-xl m-2">需要技术支持请加vlife技术支持4群。</div>
    </Card>
  );
};
