import React, { FC } from "react";
import {
  Layout,
  Nav,
  Button,
  Avatar,
  Badge,
  Dropdown,
  RadioGroup,
  Radio,
  Empty,
} from "@douyinfe/semi-ui";
import { IconDesktop, IconGithubLogo } from "@douyinfe/semi-icons";
import logo from "@src/logo.png";
import "../../index.scss";
import { useAuth } from "@src/context/auth-context";
import { useNiceModal } from "@src/store";
import {
  saveUserPasswordModifyDto,
  UserPasswordModifyDto,
} from "@src/api/SysUser";
import { useNavigate } from "react-router-dom";
import Label from "@douyinfe/semi-ui/lib/es/form/label";

const { Header } = Layout;

const Index: FC = () => {
  const navigate = useNavigate();
  const { loginOut, user } = useAuth();
  const formModal = useNiceModal("formModal");

  // const locale = useStore((state) => state.locale)
  // const changeLocale = useStore((state) => state.changeLocale)

  // const selectLocale = (locale: 'zh_CN' | 'en_GB') => {
  // 	changeLocale(locale)
  // 	localStorage.setItem('semi_locale', locale)
  // }

  const question = () => {
    window.open("https://github.com/xieyezi/semi-design-pro/issues");
  };

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
    <Header className="layout-header shadow">
      <Nav
        mode="horizontal"
        className=""
        header={
          <div
            className=" flex items-center cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <Empty
              className=" relative top-2"
              image={
                <img src={logo} style={{ width: 30, height: 30, top: 10 }} />
              }
            ></Empty>
            <span className="text-2xl font-chinese1111">微徕低代码</span>
          </div>
        }
        // children={
        //   <Nav
        //     // bodyStyle={{ height: 320 }}
        //     defaultOpenKeys={["job"]}
        //     items={[
        //       { itemKey: "user", text: "用户管理" },
        //       { itemKey: "union", text: "活动管理" },
        //       {
        //         itemKey: "union-management",
        //         text: "任务管理",
        //       },
        //       { itemKey: "job", text: "任务平台" },
        //     ]}
        //     onSelect={(data) => console.log("trigger onSelect: ", data)}
        //     onClick={(data) => console.log("trigger onClick: ", data)}
        //   />
        // }
        footer={
          <>
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
                window.open("https://github.com/wwwlike/vlife");
              }}
            >
              GITHUB
            </Button>
            {/* <Badge count={5} type="danger">
							<Button
								theme="borderless"
								icon={<IconBell />}
								style={{
									color: 'var(--semi-color-text-2)',
									marginRight: '12px'
								}}
							/>
						</Badge> */}

            <Dropdown
              render={
                <Dropdown.Menu>
                  {/* <Dropdown.Item >个人中心</Dropdown.Item>
									<Dropdown.Item>个人设置</Dropdown.Item> */}
                  <Dropdown.Item onClick={loginOut}>退出登录</Dropdown.Item>
                  <Dropdown.Item onClick={editPassword}>密码修改</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Avatar color="orange" size="small">
                {user && user.name.length > 3 ? user?.name : user?.name[0]}
              </Avatar>
            </Dropdown>

            {/* <RadioGroup type="button" defaultValue={locale} style={{ marginLeft: '20px' }}>
							<Radio value={'zh_CN'} onChange={() => selectLocale('zh_CN')}>
								中文
							</Radio>
							<Radio value={'en_GB'} onChange={() => selectLocale('en_GB')}>
								EN
							</Radio>
						</RadioGroup> */}
          </>
        }
      ></Nav>
      {/* <Tags /> */}
    </Header>
  );
};

export default Index;
