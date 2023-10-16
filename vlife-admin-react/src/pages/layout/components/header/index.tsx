import React, { FC, useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;
import {
  Layout,
  Nav,
  Button,
  Avatar,
  Dropdown,
  Empty,
  SplitButtonGroup,
} from "@douyinfe/semi-ui";
import {
  IconDesktop,
  IconGithubLogo,
  IconSetting,
  IconTreeTriangleDown,
} from "@douyinfe/semi-icons";
import logo from "@src/logo.png";
import "../../index.scss";
import { useAuth } from "@src/context/auth-context";
import { useNiceModal } from "@src/store";
import {
  saveUserPasswordModifyDto,
  UserPasswordModifyDto,
} from "@src/api/SysUser";
import { useLocation, useNavigate } from "react-router-dom";
import { SysMenu } from "@src/api/SysMenu";
import SelectIcon from "@src/components/SelectIcon";
import FormModal from "@src/pages/common/modal/formModal";
import VlifeModal from "@src/pages/common/modal/vlifeModal";
import ConfirmModal from "@src/pages/common/modal/confirmModal";
import { MenuItem } from "../../types";

const { Header } = Layout;
/**
 *
 *  当前地址没有和菜单关联，如何定位一级菜单
 */
const Index: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loginOut, user, app, setApp, checkBtnPermission } = useAuth();
  const formModal = useNiceModal("formModal");
  const [menuItems, setMenuItems] = useState<Partial<MenuItem>[]>([]);

  function renderIcon(icon: any) {
    if (!icon) {
      return null;
    }
    if (typeof icon === "string") {
      return <SelectIcon read value={icon} />;
    }
    return icon.render();
  }
  useEffect(() => {
    const menus: SysMenu[] = user?.menus || [];

    const filterRootMenus = (): SysMenu[] | undefined => {
      if (user && user.menus) {
        return user.menus
          .filter((m) => m.app === true)
          ?.sort((a, b) => a.sort - b.sort);
      } else {
        return [];
      }
    };
    //应用信息
    const appMenus = filterRootMenus();

    //桌面页，无需设置appid
    if (pathname && pathname !== "/dashboard/workbeach") {
      //找path的菜单的根节点 初始化appId
      //判断是否一级页面的菜单
      let urlMenus = menus.filter((m) =>
        m.url && m.url.endsWith("*")
          ? m.url.substring(0, m.url.length - 1) + m.placeholderUrl === pathname
          : m.url === pathname
      );
      //二级页面的菜单匹配，则根据路由地址按照规则匹配菜单 /model 配置成菜单 /model/sysUser 明细页不是菜单，是二级页面
      if (urlMenus === undefined || urlMenus.length === 0) {
        urlMenus = menus.filter((m) =>
          m.url && m.url.endsWith("*")
            ? pathname.indexOf(
                m.url.substring(0, m.url.length - 1) + m.placeholderUrl
              ) !== -1
            : pathname.indexOf(m.url) !== -1
        );
      }
      // 递归查找根节点
      function appIdSet(all: SysMenu[], menu: SysMenu) {
        if (menu.pcode === null || menu.pcode === undefined) {
          setApp(menu);
        } else {
          appIdSet(all, all.filter((a) => a.code === menu.pcode)[0]);
        }
      }
      if (urlMenus && urlMenus.length > 0) {
        appIdSet(menus, urlMenus[0]);
      }
    }

    if (app == undefined && appMenus && appMenus?.length > 0) {
      setApp(appMenus[0]);
    }

    //用户拥有模块下任意一个菜单
    if (appMenus)
      setMenuItems(
        appMenus.map((m) => {
          return {
            itemKey: m.id,
            text: m.name,
            icon: m.icon ? renderIcon(m.icon) : null,
            onClick: () => {
              if (m.url) navigate(m.url);
              setApp(m);
            },
          };
        })
      );
  }, []);

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
                setApp(undefined);
              }}
            >
              <Empty
                className=" relative top-3  mr-4"
                image={
                  <img src={logo} style={{ width: 30, height: 30, top: 10 }} />
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
              ></Empty>
            </div>
          }
          defaultSelectedKeys={[(app && app.id) || ""]}
          items={menuItems}
          footer={
            <>
              {user?.superUser && (
                <SplitButtonGroup>
                  <Button
                    theme="borderless"
                    style={{
                      color: "var(--semi-color-text-2)",
                    }}
                    icon={<IconSetting />}
                  >
                    常用菜单
                  </Button>
                  <Dropdown
                    menu={[
                      {
                        node: "item",
                        name: "模型管理",
                        onClick: () => {
                          window.open(`/sysConf/model`, "_blank");
                          // navigate(`/sysConf/model`);
                        },
                      },
                      {
                        node: "item",
                        name: "菜单管理",
                        onClick: () => {
                          window.open(`/sysConf/menu`, "_blank");
                        },
                      },
                      {
                        node: "item",
                        name: "资源管理",
                        onClick: () => {
                          window.open(`/sysConf/resources`, "_blank");
                        },
                      },
                    ]}
                    trigger="click"
                    position="bottomRight"
                  >
                    <Button
                      style={{
                        padding: "8px 4px",
                        color: "var(--semi-color-text-2)",
                      }}
                      theme="borderless"
                      className=" hover:bg-slate-400"
                      icon={<IconTreeTriangleDown />}
                    ></Button>
                  </Dropdown>
                </SplitButtonGroup>
              )}

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
              <Button
                theme="borderless"
                icon={<IconGithubLogo size="large" />}
                style={{
                  color: "var(--semi-color-text-2)",
                  marginRight: "12px",
                }}
                onClick={() => {
                  window.open("https://github.com/wwwlike/vlife");
                }}
              >
                GITHUB
              </Button>

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
        ></Nav>
        {/* <FormModal />
        <VlifeModal />
        <ConfirmModal /> */}
      </Header>
    </>
  );
};

export default Index;
