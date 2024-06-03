/**
 * 桌面
 */
import React, { useEffect, useState } from "react";
import { Avatar, Banner, Card, Empty, Image, Steps } from "@douyinfe/semi-ui";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta";
import { SysMenu } from "@src/api/SysMenu";
import { useAuth } from "@src/context/auth-context";
import { LiveProvider, LiveEditor } from "react-live";
const APP_TITLE = import.meta.env.VITE_APP_TITLE;
export default () => {
  const { user } = useAuth();
  interface IUser {
    id: number;
    name: string;
    age: number;
    address: IAddress;
  }

  interface IAddress {
    city: string;
    country: string;
    zipcode: number;
  }

  const featureList = [
    {
      title: "做研发接受的低码平台",
      description:
        "vlife了解开发过程中各环节存在的痛点和繁琐点。提供了全栈解决方案助力研发专注于逻辑和技能提升。",
    },
    {
      title: "开发流程与原生开发一致",
      description:
        "提供与原生企业级开发一致的开发体验。并配合图形化配置+低码开发成倍提升研发效能",
    },
    {
      title: "极简开发",
      description:
        "平台规则约束少，能快速上手，复杂的逻辑由开发来，繁琐的vlife搞定",
    },
    {
      title: "模型驱动",
      description:
        "设计模型(Javabean)、添加注释就能渲染出复杂关系的功能模块，这是vlife已经实现并还在不断深化的平台最显著的特点",
    },
    {
      title: "DSL",
      description:
        "vlife平台提供了一套DSL，供开发者使用来进行组件和接口的定义，让复杂的组件与数据不匹配的接口也能组合在一起",
    },
    {
      title: "组件化思想",
      description:
        "在前端提供了完善的组件，后端使用它能够轻松完成全栈开发；在后端封装全量数据库操作接口，完全可不写SQL对数据库进行复杂操作",
    },
  ];

  const minCard = (menu: SysMenu) => {
    return (
      <Card key={menu.code} style={{ maxWidth: 360 }}>
        <Meta
          title={menu.name}
          description={menu.name}
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
    <div className="w-full ">
      <Banner
        fullMode={false}
        type="success"
        className="border-2 border-dashed border-blue-500  p-4"
        icon={null}
        closeIcon={null}
        title={
          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "30px",
            }}
            className=" text-neutral-950"
          >
            <span className=" text-red-600">{user && user.name}</span>
            ,你好,欢迎使用{APP_TITLE}
          </div>
        }
        description={
          <ul>
            <li className=" font-bold "></li>
            <li></li>
          </ul>
        }
      />

      {/* <div className=" flex space-x-8 rounded-lg shadow-md">
            {apps.map((menu, index) => {
              return minCard(menu);
            })}
          </div> */}
      <div className="flex ">
        <div className="  w-1/3 bg-white rounded-2xl my-4  p-4 shadow-md shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-gray-50">
          <div className="flex flex-col md:flex-row gap-8 ">
            <div className="">
              <div className=" flex justify-between">
                <div className="text-2xl flex font-bold mb-4 items-start">
                  {/* <img src={logo} style={{ width: 30, height: 30 }} /> */}
                  <div>微徕(V-LIFE)低代码研发平台</div>
                </div>
                <div className="items-end">
                  <a
                    href="http://vlife.cc"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-1 rounded-md shadow-md inline-block"
                    target={"_blank"}
                  >
                    开发指南
                  </a>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                一款模型驱动的低代码平台，如果你有以下需求，Vlife
                就是为你设计的。
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>提升研发效能，优化开发流程，聚焦业务能力,沉淀研发资产</li>
                <li>
                  模型驱动的思想来实现复杂业务逻辑CRUD为主的信息系统的开发
                </li>
                <li>
                  平台可以方便的进行扩展开发、私有部署；可掌控全部代码和数据
                </li>
                <li>可免费使用，也可以付费获得更多技术支持</li>
              </ul>
            </div>
          </div>
        </div>
        <div className=" w-2/3">
          <div className="bg-gray-100 py-4">
            <div className="container px-4 mx-auto">
              <div className="grid grid-cols-3  gap-4">
                {featureList.map((feature, index) => (
                  <div
                    className="bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-gray-100"
                    key={index}
                  >
                    <div className="p-3">
                      <h3 className="text-xl font-semibold mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full  bg-white">
        <div className=" w-1/3 p-4  bg-white space-y-4">
          <Banner
            fullMode={false}
            type="danger"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                后台项目运行注意
              </div>
            }
            description={
              <ul>
                <li>1. 安装jdk8，openJDK会有问题</li>
                <li>
                  2. 模型信息发生变化，请务必运行maven
                  install；以免UI层面渲染数据不准确
                </li>
                <li>3. 掌握vlife里的entity,vo,dto,req模型的使用场景;</li>
                <li>4. 掌握VClass,VField注解的作用</li>
              </ul>
            }
          />
          <Banner
            fullMode={false}
            type="warning"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                团队招募
              </div>
            }
            description={
              <ul>
                <li className=" font-bold ">
                  我们在寻找全职、远程的产品设计、开发、测试的新同事加入团队，如果你对
                  vlife 有强烈的兴趣，欢迎给我们发邮件：vlifelowcode@163.com
                </li>
                <li></li>
              </ul>
            }
          />
        </div>
        <div className=" w-1/3 p-4">
          <Banner
            fullMode={false}
            type="success"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "24px",
                }}
              >
                前端项目运行
              </div>
            }
            description={
              <div>
                <div className=" font-bold">
                  <LiveProvider
                    code={`
 1. >> git clone https://gitee.com/wwwlike/vlife-admin-react
 2. >> cd  vlife-admin-react
 3. >> yarn
 4. >> npm run dev
 `}
                  >
                    <LiveEditor
                      style={{
                        fontFamily: "Consolas",
                        fontSize: 18,
                        lineHeight: "1.5",
                      }}
                    />
                  </LiveProvider>
                </div>
              </div>
            }
          />
        </div>
        <div className=" w-1/3 p-4 bg-white">
          <Banner
            className="h-full"
            fullMode={false}
            type="warning"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                技术支持
              </div>
            }
            description={
              <div className="flex">
                <div className=" w-1/3">
                  <div className=" font-bold">商务合作+V</div>
                  <Image
                    className={" w-28  h-28 top-4"}
                    src="https://wwwlike.gitee.io/vlife-img/wx.jpg"
                  />
                </div>
                <div className=" w-1/3">
                  <div className=" font-bold items-center">QQ群(786134846)</div>
                  <Image
                    className={" w-28 h-28 top-4"}
                    src="https://wwwlike.gitee.io/vlife-img/qqq.png"
                  />
                </div>
                <div className=" w-1/3">
                  <div className=" font-bold">微信群</div>
                  <Image
                    className={" w-28  h-28 top-4"}
                    src="https://wwwlike.gitee.io/vlife-img/wxq.png"
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
