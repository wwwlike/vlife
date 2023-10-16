import React, { useCallback, useEffect, useState } from "react";
import { localHistoryLoginUserName, useAuth } from "@src/context/auth-context";
import "./login.css";
import { useForm, useUrlQueryParam } from "@src/hooks/useForm";
import { useNavigate } from "react-router-dom";
import { Notification, Spin } from "@douyinfe/semi-ui";
import RegExp from "@src/util/expression";
import {
  RegisterDto,
  register as serverReg, //服务端注册
} from "@src/api/SysUser";
import { Result } from "@src/api/base";
import { useDebounceEffect, useInterval } from "ahooks";
import { Modal } from "@douyinfe/semi-ui";

const Index: React.FC = () => {
  const localUsername = window.localStorage.getItem(localHistoryLoginUserName);
  const { user, login, error } = useAuth();
  const navigate = useNavigate();
  const { values, errors, setFieldValue } = useForm<{
    username: string;
    password: string;
  }>({ username: localUsername || "", password: "" }, null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (user && user.id) {
      navigate("/");
    }
  }, [user]);

  //async 意义
  const handelSubmit = async () => {
    await login(values);
  };

  interface registerFlag {
    flag: boolean;
    msg?: string; //校验说明
  }

  const [open, setOpen] = useState<boolean>(false);
  const [registerFlag, setRegisterFlag] = useState<registerFlag>({
    flag: true,
  });

  return (
    <div
      className=" bg-fixed bg-cover bg-center  w-full
      flex items-center h-screen
      "
      style={{
        backgroundImage: `url(https://wwwlike.gitee.io/vlife-img/bj.jpg) `,
      }}
    >
      <div className="main-container login-wrapper ">
        <div>
          <section className="flex justify-between">
            <div
              style={{
                fontSize: "22px",
                color: "#262626",
                fontWeight: 500,
                lineHeight: "32px",
              }}
            >
              密码登录
            </div>
            <div className=" absolute top-2 right-2">
              <img
                src="https://wwwlike.gitee.io/vlife-img/wxgzh.jpg"
                className=" w-36 "
              />
              关注获取账号密码
            </div>
          </section>
          <section className="mt-5">
            <div className="flex flex-col">
              <p className="text-red-500 pt-2 text-center ">{error}</p>
              <div className="mb-1 pt-2 rounded">
                <input
                  type="text"
                  placeholder="账号"
                  id="username"
                  value={values.username || ""}
                  onChange={(evt) =>
                    setFieldValue("username", evt.target.value)
                  }
                  className=" h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                />
              </div>
              <div className="mb-2 pt-3 rounded ">
                <input
                  type="password"
                  id="password"
                  placeholder="密码"
                  value={values.password || ""}
                  onChange={(evt) =>
                    setFieldValue("password", evt.target.value)
                  }
                  className="h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                />
              </div>
              <div className="mb-12 relative"></div>
              <button
                className=" bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200"
                onClick={handelSubmit}
              >
                登 录
              </button>
            </div>
          </section>
        </div>

        <div
          onMouseOver={() => {}}
          onMouseOut={() => {}}
          className="absolute  cursor-pointer text-center w-full py-4 h-16 bottom-0 left-0  bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://static001.geekbang.org/resource/image/da/a9/da2f9b538e487ec57fecc41a5c88c9a9.png)",
            // color: "#fa8919",
            cursor: "pointer",
          }}
        >
          <a href="http://qm.qq.com/cgi-bin/qm/qr?k=786134846" target="_blank">
            技术支持QQ群：786134846
          </a>
        </div>
      </div>

      <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-white"></p>
      </div>

      <div className="max-w-lg mx-auto flex justify-center text-white">
        {/* <a href="#" className="hover:underline">联系我们</a>
        <span className="mx-3">•</span> */}
        {/* <a href="#" className="hover:underline">
          鄂ICP备2022008507号
        </a> */}
      </div>
    </div>
  );
};

export default Index;
