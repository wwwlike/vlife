import React, { useEffect, useMemo, useState } from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;
import {
  Layout,
  Nav,
  Button,
  Avatar,
  Dropdown,
  Empty,
} from "@douyinfe/semi-ui";
import { IconDesktop, IconGithubLogo } from "@douyinfe/semi-icons";
import logo from "@src/logo.png";
import "../../index.scss";
import { useAuth } from "@src/context/auth-context";
import { useNiceModal } from "@src/store";
import { VF } from "@src/dsl/VF";
import {
  detail,
  saveUserPasswordModifyDto,
  UserPasswordModifyDto,
  save as userSave,
} from "@src/api/SysUser";
import { useLocation, useNavigate } from "react-router-dom";
import { listAll, MenuVo, remove, save } from "@src/api/SysMenu";
import SelectIcon from "@src/components/SelectIcon";
import { MenuItem } from "../../types";
import LinkMe from "./LinkMe";
import VfButton from "@src/components/button";
import { findSubs, findTreeRoot } from "@src/util/func";
import { urlMenu, visitTopMenu } from "../sider";
import weilai from "@src/assets/weilai.jpg";
import BtnResourcesToolBar from "@src/components/button/component/BtnResourcesToolBar";
const { Header } = Layout;
const APP_TITLE = import.meta.env.VITE_APP_TITLE;
const Index = () => {
  const navigate = useNavigate();
  const formModal = useNiceModal("formModal");
  const {
    loginOut,
    user,
    app,
    setApp,
    allMenus,
    setMenu,
    sysVar,
    setAllMenus,
  } = useAuth();

  //所有应用
  const apps = useMemo((): MenuVo[] => {
    return (
      allMenus
        ?.filter((m) => m.app === true)
        ?.sort((a, b) => a.sort - b.sort) || []
    );
  }, [allMenus]);

  const location = useLocation();
  const { pathname } = location;

  //刷新和路由为空时候确定选中的APP
  useEffect(() => {
    //路由为空情况选择第一个应用
    if (user && allMenus) {
      if (pathname === "/" && apps) {
        setApp(apps[0]);
      } else if (app === undefined) {
        //查找菜单
        const currMenu = urlMenu(allMenus, pathname);
        if (currMenu) {
          //查找应用
          const currApp = findTreeRoot(allMenus, currMenu);
          if (currApp) {
            setApp(currApp);
          }
        } else {
          setApp(apps[0]);
        }
      }
    }
  }, [pathname]);

  function renderIcon(icon: any) {
    if (!icon) {
      return null;
    }
    if (typeof icon === "string") {
      return <SelectIcon read value={icon} />;
    }
    return icon.render();
  }

  const visitMenu = (menu?: MenuVo) => {
    if (menu && menu.routerAddress) {
      navigate(menu.routerAddress);
    }
  };

  //切换到暗黑模式
  const switchMode = () => {
    const body = document.body;
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode");
      // 以下这行代码，window.setMode仅用于当通过本Demo切换时，通知Semi官网Header记录更新当前模式（只用于演示）。在您的代码里无需存在。
      //@ts-ignore
      window.setMode("light");
    } else {
      body.setAttribute("theme-mode", "dark");
      //@ts-ignore
      window.setMode("dark");
    }
  };

  const menuItems = useMemo((): Partial<MenuItem>[] => {
    const _apps: Partial<MenuItem>[] = apps.map((m: MenuVo) => {
      return {
        itemKey: m.id,
        icon: m.icon ? renderIcon(m.icon) : null,
        onClick: () => {
          setApp(m);
          visitMenu(visitTopMenu(findSubs(allMenus, m), m.code));
        },
        text: user?.superUser ? (
          <div className=" z-10 flex !items-center relative">
            {m.name}
            <div
              className="!z-20"
              onClick={(event) => {
                event.cancelable = true; //阻止事件冒泡
                event.stopPropagation();
              }}
            >
              <BtnResourcesToolBar
                dropdown={true}
                key={`app_${m.id}`}
                btns={[
                  {
                    title: "应用编辑",
                    icon: <i className=" icon-edit" />,
                    actionType: "save",
                    model: "sysMenu",
                    datas: [m],
                    reaction: [
                      VF.then("app").value(true).hide(),
                      VF.then(
                        "url",
                        "formId",
                        "placeholderUrl",
                        "pcode",
                        "confPage",
                        "pageLayoutId"
                      )
                        .hide()
                        .clearValue(),
                      VF.then("name").title("应用名称"),
                    ],
                    saveApi: save,
                    onSubmitFinish: (...datas) => {
                      setAllMenus([
                        ...(allMenus?.filter((f) => f.id !== datas[0].id) ||
                          []),
                        datas[0],
                      ]);
                      setApp(datas[0]);
                    },
                  },

                  {
                    title: "创建菜单",
                    icon: <i className="  icon-add_software" />,
                    actionType: "create",
                    continueCreate: false,
                    model: "sysMenu",
                    saveApi: save,
                    reaction: [
                      VF.then("name").title("模块名称"),
                      VF.then("app").hide().value(false),
                      VF.then("pcode").value(m.code).readPretty(),
                      VF.field("url").isNotNull().then("formId").show(),
                      VF.result((sysMenu: any) => {
                        return sysMenu?.url && sysMenu.url.indexOf("*") !== -1;
                      })
                        .then("formId")
                        .required(),
                      VF.field("url")
                        .endsWidth("*")
                        .then("placeholderUrl")
                        .show()
                        .then("placeholderUrl")
                        .required(),
                      VF.field("confPage").eq(true).then("pageLayoutId").show(),
                    ],
                    onSubmitFinish: (...datas) => {
                      listAll().then((d) =>
                        setAllMenus([
                          ...(d.data?.filter((f) => f.id !== datas[0].id) ||
                            []),
                          datas[0],
                        ])
                      );
                      setApp(m);
                    },
                  },
                  // {
                  //   title: "模型管理",
                  //   icon: <i className="  icon-view_module" />,
                  //   datas: [m],
                  //   actionType: "click",
                  //   onClick: () => {
                  //     navigate(`/sysConf/model?appCode=${m.code}`);
                  //   },
                  // },
                  {
                    title: "应用删除",
                    icon: <i className="  icon-delete" />,
                    actionType: "api",
                    datas: [[m.id]],
                    submitConfirm: true,
                    saveApi: remove,
                    usableMatch: () => {
                      return allMenus.filter((f) => f.pcode === m.code).length >
                        0
                        ? "应用下有模块不能删除"
                        : true;
                    },
                    onSubmitFinish: (...datas) => {
                      setAllMenus([
                        ...(allMenus?.filter((f) => f.code !== m.code) || []),
                      ]);
                      setApp(apps[0]);
                    },
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          m.name
        ),
      };
    });
    if (user?.superUser) {
      _apps.push({
        itemKey: "createApp",
        text: (
          <div className=" h-full items-center flex">
            <VfButton
              key={`createApp_${pathname}`}
              title="新增应用"
              icon={<i className="  icon-task_add-02" />}
              actionType="create"
              model="sysMenu"
              btnType="icon"
              reaction={[
                VF.then("app").value(true).hide(),
                VF.then("url", "formId", "placeholderUrl", "pcode")
                  .hide()
                  .clearValue(),
                VF.then("name").title("应用名称"),
              ]}
              saveApi={save}
              onSubmitFinish={(...datas) => {
                setAllMenus([
                  ...(allMenus?.filter((f) => f.id !== datas[0].id) || []),
                  datas[0],
                ]);
                setApp(datas[0]);
              }}
            />
          </div>
        ),
      });
    }
    return _apps;
  }, [apps, pathname]);

  const editPassword = () => {
    formModal
      .show({
        title: "密码修改",
        type: "userPasswordModifyDto",
        formData: { id: user?.id }, //数据
        saveFun: (pwd: UserPasswordModifyDto) => {
          return saveUserPasswordModifyDto(pwd);
        },
      })
      .then((saveData) => {
        loginOut();
      });
  };

  return (
    <>
      <Header className="layout-header shadow">
        <Nav
          mode={"horizontal"}
          header={
            <div
              className=" flex !items-center cursor-pointer "
              onClick={() => {
                navigate("/");
              }}
            >
              {sysVar.systemIcon ? (
                <Empty
                  className=" relative top-3  mr-4"
                  image={
                    <img
                      src={apiUrl + "/sysFile/image/" + sysVar.systemIcon}
                      style={{ width: 30, height: 30, top: 10 }}
                    />
                  }
                />
              ) : (
                <Empty
                  className=" relative top-3  mr-4"
                  image={
                    <img
                      src={logo}
                      style={{ width: 30, height: 30, top: 10 }}
                    />
                  }
                />
              )}
              <span className="text-xl font-bold ml-2">
                {sysVar.systemName || (
                  <Empty
                    className=" relative top-3 "
                    image={
                      <img
                        src={weilai}
                        style={{ width: 80, height: 30, top: 10 }}
                      />
                    }
                  />
                )}
              </span>
            </div>
          }
          selectedKeys={[app?.id || ""]}
          items={menuItems}
          footer={
            <>
              {user?.superUser && (
                <>
                  <Button
                    theme="borderless"
                    onClick={() => {
                      navigate("/sysConf/dbTableManage");
                      setMenu(
                        allMenus.find(
                          (_m) => _m.url === "/sysConf/dbTableManage"
                        )
                      );
                    }}
                    style={{
                      color: "var(--semi-color-text-2)",
                    }}
                    icon={
                      <i className="icon-settings text-xl text-indigo-500"></i>
                    }
                  >
                    数据库管理
                  </Button>
                  <Button
                    theme="borderless"
                    style={{
                      color: "var(--semi-color-text-2)",
                    }}
                    onClick={() => {
                      navigate("/sysConf/icon");
                    }}
                    icon={<i className="icon-descending-order2 text-xl"></i>}
                  >
                    图标库
                  </Button>
                  <LinkMe />
                  <Button
                    theme="borderless"
                    icon={<IconDesktop size="large" />}
                    style={{
                      color: "var(--semi-color-text-2)",
                      marginRight: "12px",
                    }}
                    onClick={() => {
                      window.open("http://vlife.cc");
                    }}
                  >
                    使用指南
                  </Button>
                  <Button
                    theme="borderless"
                    icon={<IconGithubLogo size="large" />}
                    style={{
                      color: "var(--semi-color-text-2)",
                      marginRight: "12px",
                    }}
                    onClick={() => {
                      window.open("https://gitee.com/wwwlike/vlife");
                    }}
                  >
                    GITEE
                  </Button>
                </>
              )}
              <Dropdown
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={loginOut}>退出登录</Dropdown.Item>
                    <Dropdown.Item>
                      <VfButton
                        btnType="link"
                        loadApi={detail}
                        model="sysUser"
                        actionType="edit"
                        reaction={[
                          VF.then(
                            "name",
                            "username",
                            "sysDeptId",
                            "sysGroupId"
                          ).readPretty(),
                          VF.then("superUser", "state").hide(),
                        ]}
                        datas={{ id: user?.id }}
                        allowEmpty={true}
                        saveApi={userSave}
                        title="基本信息"
                      />
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <VfButton
                        btnType="link"
                        datas={{ id: user?.id }}
                        model="userPasswordModifyDto"
                        actionType="edit"
                        submitClose={true}
                        saveApi={saveUserPasswordModifyDto}
                        onSubmitFinish={(data) => {
                          loginOut();
                        }}
                        title="密码修改"
                      />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                {user?.avatar ? (
                  <Avatar
                    alt="beautiful cat"
                    size="small"
                    src={`${apiUrl}/sysFile/image/${user?.avatar}`}
                    style={{ margin: 4 }}
                  />
                ) : (
                  <Avatar color="orange" size="small">
                    {user?.name[0]}
                  </Avatar>
                )}
              </Dropdown>
            </>
          }
        />
      </Header>
    </>
  );
};
export default Index;
