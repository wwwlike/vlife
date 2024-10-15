/**
 * 桌面
 */
import React from "react";
import {
  Avatar,
  Banner,
  Button,
  Card,
  Image,
  Tooltip,
} from "@douyinfe/semi-ui";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta";
import wxImage from "@src/assets/wx.jpg";
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
      title: "上手简单",
      description: "平台规约少,上手成本极低",
    },
    {
      title: "简化开发",
      description: "设计模型、写复杂接口是平台用户主要工作",
    },
    {
      title: "生产力",
      description: "妥妥的生产力工具，让开发效率翻倍",
    },
    {
      title: "研发专注",
      description: "重复琐碎的工作平台承担，让研发更加专注业务",
    },
    {
      title: "源码开放",
      description: "底层核心源码均开放，本地化部署二开无限制",
    },
    {
      title: "全栈开发",
      description: "让后端同学轻松上手全栈开发",
    },
    // {
    //   title: "DSL",
    //   description:
    //     "vlife平台提供了一套DSL，供开发者使用来进行组件和接口的定义，让复杂的组件与数据不匹配的接口也能组合在一起",
    // },
    // {
    //   title: "组件化思想",
    //   description:
    //     "在前端提供了完善的组件，后端使用它能够轻松完成全栈开发；在后端封装全量数据库操作接口，完全可不写SQL对数据库进行复杂操作",
    // },
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
                <li>开发toB,toG的各类信息化系统，人手不足</li>
                <li>平台可以方便的进行扩展开发、私有部署</li>
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
        <div className=" w-1/6 p-4 bg-white">
          <Banner
            className="h-full"
            fullMode={false}
            type="warning"
            bordered
            title="商务合作"
            icon={null}
            closeIcon={null}
            description={
              <div>
                <Image src={wxImage} />
                <div className=" font-bold  items-center flex justify-center">
                  (vlifeboot)
                </div>
                <div>
                  <ul className=" space-y-1 p-2">
                    <li>- 专业版/企业版授权服务</li>
                    <li>- 技术服务，服务外包</li>
                    <li>- 平台落地咨询与培训</li>
                  </ul>
                </div>
              </div>
            }
          />
        </div>
        <div className=" w-3/6 p-4  bg-white space-y-4">
          <div>快速了解平台是否适合您企业/团队</div>
          <iframe
            src="//player.bilibili.com/player.html?aid=113282027362511&amp;bvid=BV1Ms2GYMEKs&amp;cid=26226197694&amp;p=1&amp;high_quality=1&amp;autoplay=0"
            width="100%"
            height="600"
            scrolling="no"
          ></iframe>
          {/* <Banner
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
          /> */}
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
                  fontSize: "14px",
                  lineHeight: "24px",
                }}
              >
                降低研发难度,掌握以下前端组件联动，后端数据查询的语法就能完成更复杂的业务
              </div>
            }
            description={
              <div>
                <div className="  text-xs">
                  <div className=" mt-6 mb-2 text-xs">
                    前端主要编写复杂表单逻辑的语法代码
                  </div>
                  <LiveProvider
                    code={` VF.field("score").gt(95).then("state").value("优秀");`}
                  >
                    <LiveEditor
                      style={{
                        fontFamily: "Consolas",
                        fontSize: 18,
                        lineHeight: "1.5",
                      }}
                    />
                  </LiveProvider>
                  <div className=" mt-6 mb-2 text-xs">
                    后端主要掌握链式查询的语法代码
                  </div>
                  <LiveProvider
                    code={` QueryWrapper<SysUser> _qw=QueryWrapper.of(SysUser.class);
                    _qw.gt("age",15).eq("sex","girl");
                    List<SysUser> _items=dao.find(_qw);`}
                  >
                    <LiveEditor
                      style={{
                        fontFamily: "Consolas",
                        fontSize: 14,
                        lineHeight: "1.5",
                      }}
                    />
                  </LiveProvider>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
