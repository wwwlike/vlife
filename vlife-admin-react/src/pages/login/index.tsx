import React, { useEffect } from "react";
import { localHistoryLoginUserName, useAuth } from "@src/context/auth-context";
import "./login.css";
import { useForm, useUrlQueryParam } from "@src/hooks/useForm";
import { useNavigate } from "react-router-dom";
import { giteeUrl, openCheckCode, ThirdAccountDto } from "@src/api/SysUser";
import backgroundImage from "@src/assets/login_bg.jpg";
import loginLeftImage from "@src/assets/login_left.png";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import LinkMe from "../layout/components/header/LinkMe";
const Index: React.FC = () => {
  const localUsername = window.localStorage.getItem(localHistoryLoginUserName);
  const { user, login, error, giteeLogin } = useAuth();
  const navigate = useNavigate();
  const { values, errors, setFieldValue } = useForm<{
    username: string;
    password: string;
  }>({ username: localUsername || "", password: "" }, null);

  useEffect(() => {
    if (user && user.id) {
      navigate("/");
    }
  }, [user]);

  const handelSubmit = async () => {
    await login(values);
  };

  const gitLogin = () => {
    giteeUrl().then((d) => {
      if (d.data) {
        window.location.href = d.data;
      } else {
        alert("服务端没有启用gitee快捷登录");
      }
    });
  };

  const [urlParam, setUrlParam] = useUrlQueryParam(["code", "from"]);
  useEffect(() => {
    if (urlParam.code !== undefined) {
      if (urlParam.from === "gitee") {
        giteeLogin(urlParam.code).then(
          (account: ThirdAccountDto | undefined) => {}
        );
      }
    }
  }, [urlParam]);

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
        ></div>
        <div
          style={{ width: "358px", height: "334px" }}
          className="relative  flex justify-center items-center bg-white rounded-r-3xl shadow-xl shadow-right shadow-top shadow-bottom"
        >
          <div className=" absolute top-1 right-3  ">
            <img
              src="https://wwwlike.gitee.io/vlife-img/wxgzh.jpg"
              className=" w-24 "
            />
            关注获取账号
          </div>
          {/* <div className="gitee" onClick={gitLogin}>
            <div className="switch-tip">Gitee登录</div>
          </div> */}
          <div
            style={{ width: "258px" }}
            className=" flex flex-col  justify-center items-center"
          >
            <div className="text-center font-bold tracking-wider text-blue-400 opacity-100 text-2xl">
              vlife低代码
            </div>
            <p className="text-red-500 pt-2 text-center ">{error}</p>
            <div className="mb-1 pt-2 rounded">
              <input
                type="text"
                placeholder="请输入账号"
                id="username"
                value={values.username || ""}
                onChange={(evt) => setFieldValue("username", evt.target.value)}
                className=" h-10 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
              />
            </div>
            <div className="mb-2 pt-3 rounded ">
              <input
                type="password"
                id="password"
                placeholder="请输入密码"
                value={values.password || ""}
                onChange={(evt) => setFieldValue("password", evt.target.value)}
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
