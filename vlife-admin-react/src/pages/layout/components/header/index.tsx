import React, { useMemo } from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;
import {
  Layout,
  Nav,
  Button,
  Avatar,
  Dropdown,
  Empty,
} from "@douyinfe/semi-ui";
import {
  IconDelete,
  IconDesktop,
  IconEditStroked,
  IconGithubLogo,
} from "@douyinfe/semi-icons";
import logo from "@src/logo.png";
import "../../index.scss";
import { useAuth } from "@src/context/auth-context";
import { useNiceModal } from "@src/store";
import { VF } from "@src/dsl/VF";
import {
  saveUserPasswordModifyDto,
  UserPasswordModifyDto,
} from "@src/api/SysUser";
import { useNavigate } from "react-router-dom";
import { MenuVo, remove, save } from "@src/api/SysMenu";
import SelectIcon from "@src/components/SelectIcon";
import { MenuItem } from "../../types";
import LinkMe from "./LinkMe";
import BtnToolBar from "@src/components/table/component/BtnToolBar";
const { Header } = Layout;

const Index = () => {
  const navigate = useNavigate();
  const formModal = useNiceModal("formModal");
  const {
    loginOut,
    user,
    app,
    setApp,
    checkBtnPermission,
    allMenus,
    setAllMenus,
  } = useAuth();
  const pathname = window.location.href;
  //所有菜单
  const userMenus = useMemo(() => {
    return user?.superUser && allMenus ? allMenus : user?.menus || [];
  }, [user, allMenus]);
  //所有应用
  const apps = useMemo((): MenuVo[] => {
    return (
      userMenus
        ?.filter((m) => m.app === true)
        ?.sort((a, b) => a.sort - b.sort) || []
    );
  }, [userMenus]);

  function renderIcon(icon: any) {
    if (!icon) {
      return null;
    }
    if (typeof icon === "string") {
      return <SelectIcon read value={icon} />;
    }
    return icon.render();
  }
  const menuItems = useMemo((): Partial<MenuItem>[] => {
    const _apps: Partial<MenuItem>[] = apps.map((m: MenuVo) => {
      return {
        itemKey: m.id,
        icon: m.icon ? renderIcon(m.icon) : null,
        onClick: () => {
          if (m.url) navigate(m.url);
          setApp(m);
        },
        text: user?.superUser ? (
          <div className=" z-10 flex items-center relative">
            {m.name}
            <div
              className="!z-20"
              onClick={(event) => {
                event.cancelable = true; //阻止事件冒泡
                event.stopPropagation();
              }}
            >
              <BtnToolBar
                dropdown={true}
                key={`app_${m.id}`}
                datas={[m]}
                btns={[
                  {
                    title: "新增模块",
                    icon: <i className="  icon-task_add-02" />,
                    actionType: "create",
                    continueCreate: true,
                    model: "sysMenu",
                    saveApi: save,
                    reaction: [
                      VF.then("name").title("模块名称"),
                      VF.then("app").hide().value(false),
                      VF.then("pcode").value(m.code).readPretty(),
                      VF.field("confPage")
                        .eq(true)
                        .then("url", "formId", "placeholderUrl")
                        .hide()
                        .clearValue(),
                      VF.field("url").isNotNull().then("formId").show(),
                      VF.result((sysMenu: any) => {
                        return sysMenu?.url && sysMenu.url.indexOf("*") !== -1;
                      })
                        .then("formId")
                        .required(),
                      VF.field("confPage").eq(true).then("pageLayoutId").show(),
                      VF.field("url")
                        .endsWidth("*")
                        .then("placeholderUrl")
                        .show()
                        .then("placeholderUrl")
                        .required(),
                    ],
                    onSubmitFinish: (...datas) => {
                      setAllMenus([
                        ...(allMenus?.filter((f) => f.id !== datas[0].id) ||
                          []),
                        datas[0],
                      ]);
                    },
                  },

                  {
                    title: "编辑应用",
                    icon: <IconEditStroked size="small" className="z-20" />,
                    actionType: "edit",
                    model: "sysMenu",
                    saveApi: save,
                    onSubmitFinish: (...datas) => {
                      setAllMenus([
                        ...(allMenus?.filter((f) => f.id !== datas[0].id) ||
                          []),
                        datas[0],
                      ]);
                    },
                    reaction: [
                      VF.then("app").value(true).hide(),
                      VF.then(
                        "url",
                        "formId",
                        "placeholderUrl",
                        "pcode",
                        "confPage"
                      )
                        .hide()
                        .clearValue(),
                      VF.then("name").title("应用名称"),
                    ],
                  },
                  {
                    title: "删除应用",
                    icon: <IconDelete size="small" className="z-20" />,
                    actionType: "api",
                    saveApi: (...data: any[]) => {
                      return remove([m.id]);
                    },
                    submitConfirm: true,
                    onSubmitFinish: (...datas) => {
                      setAllMenus([
                        ...(allMenus?.filter((f) => f.id !== m.id) || []),
                      ]);
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
          <BtnToolBar
            key={"createApp"}
            datas={[]}
            btns={[
              {
                title: "新增应用",
                icon: <i className="  icon-task_add-02" />,
                actionType: "save",
                model: "sysMenu",
                saveApi: save,
                onlyIcon: true,
                reaction: [
                  VF.then("app").value(true).hide(),
                  VF.then("url", "formId", "placeholderUrl", "pcode")
                    .hide()
                    .clearValue(),
                  VF.then("name").title("应用名称"),
                ],
                onSubmitFinish: (...datas) => {
                  setAllMenus([
                    ...(allMenus?.filter((f) => f.id !== datas[0].id) || []),
                    datas[0],
                  ]);
                  setApp(datas[0]);
                },
              },
            ]}
          />
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
              className=" flex items-center cursor-pointer "
              onClick={() => {
                navigate("/");
              }}
            >
              <Empty
                className=" relative top-3  mr-4"
                image={
                  <img src={logo} style={{ width: 40, height: 30, top: 10 }} />
                }
              ></Empty>
              <Empty
                className=" relative top-3 "
                image={
                  <img
                    src={"https://wwwlike.gitee.io/vlife-img/weilai.jpg"}
                    style={{ width: 80, height: 30, top: 10 }}
                  />
                }
              />
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
                      navigate("/sysConf/model");
                    }}
                    style={{
                      color: "var(--semi-color-text-2)",
                    }}
                    icon={
                      <i className="icon-settings text-xl text-indigo-500"></i>
                    }
                  >
                    配置中心
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
                    {checkBtnPermission(
                      "sysUser:save:userPasswordModifyDto"
                    ) && (
                      <Dropdown.Item onClick={editPassword}>
                        密码修改
                      </Dropdown.Item>
                    )}
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
