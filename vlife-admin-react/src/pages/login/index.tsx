import React, { useEffect } from "react";
import { localHistoryLoginUserName, useAuth } from "@src/context/auth-context";
import "./login.css";
import { useForm } from "@src/hooks/useForm";
import { useNavigate } from "react-router-dom";
import logo from "@src/logo.png";
import backgroundImage from "@src/assets/login_bg.jpg";
import loginLeftImage from "@src/assets/login_left.png";
import wxgzh from "@src/assets/wxgzh.jpg";
import weilai from "@src/assets/weilai.jpg";
import LinkMe from "../layout/components/header/LinkMe";
const apiUrl = import.meta.env.VITE_APP_API_URL;
const Index: React.FC = () => {
  const localUsername = window.localStorage.getItem(localHistoryLoginUserName);
  const { user, login, error, sysVar, setAllMenus } = useAuth();
  const navigate = useNavigate();
  const { values, setFieldValue } = useForm<{
    username: string;
    password: string;
  }>({ username: localUsername || "", password: "" }, null);

  useEffect(() => {
    if (user && user.id) {
      navigate("/");
      setAllMenus(user.menus);
    }
  }, [user]);

  const handelSubmit = async () => {
    await login(values);
  };
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      className="bg-fixed relative bg-cover bg-center w-full justify-center flex items-center h-screen"
    >
      <div
        style={{ width: "748px", height: "334px" }}
        className="  flex justify-center items-center"
      >
        <div
          style={{
            width: "398px",
            backgroundImage: `url(${loginLeftImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-full bg-white rounded-l-3xl shadow-xl shadow-left shadow-top shadow-bottom"
        />
        <div
          style={{ width: "358px", height: "334px" }}
          className="relative  flex justify-center items-center bg-white rounded-r-3xl shadow-xl shadow-right shadow-top shadow-bottom"
        >
          <div className=" absolute top-1 right-3  ">
            <img src={wxgzh} className=" w-24 " />
            关注获取账号
          </div>
          {/* <div className="gitee" onClick={gitLogin}>
            <div className="switch-tip">Gitee登录</div>
          </div> */}
          <div
            style={{ width: "258px" }}
            className="flex flex-col  justify-center items-center"
          >
            <div className=" flex justify-left w-full ">
              <img
                src={
                  sysVar.systemIcon
                    ? `${apiUrl}/sysFile/image/${sysVar.systemIcon}`
                    : logo
                }
                style={{ width: 40, height: 30, top: 10 }}
              />
              {sysVar.systemName ? (
                <span className="text-xl font-bold ml-2">
                  {sysVar.systemName}
                </span>
              ) : (
                <img src={weilai} style={{ width: 80, height: 30, top: 10 }} />
              )}
            </div>
            <p className="text-red-500 pt-2 text-center ">{error}</p>
            <div className="mb-1 pt-2 rounded">
              <input
                type="text"
                placeholder="请输入账号"
                id="username"
                value={values.username || ""}
                onChange={(evt) => setFieldValue("username", evt.target.value)}
                className="  itali h-10 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
              />
            </div>
            <div className="mb-2 pt-3 rounded ">
              <input
                type="password"
                id="password"
                placeholder="请输入密码"
                value={values.password || ""}
                onChange={(evt) => setFieldValue("password", evt.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handelSubmit();
                  }
                }}
                className="h-10  text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
              />
            </div>

            <button
              className=" mt-4 w-64 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200"
              onClick={handelSubmit}
            >
              登 录
            </button>
            <LinkMe className="absolute bottom-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
