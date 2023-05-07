import React, { useCallback, useEffect, useState } from "react";
import { localHistoryLoginUserName, useAuth } from "@src/context/auth-context";
import "./login.css";
import { useForm, useUrlQueryParam } from "@src/hooks/useForm";
import { useNavigate } from "react-router-dom";
import { Notification, Spin } from "@douyinfe/semi-ui";
import RegExp from "@src/util/expression";
import {
  checkEmail,
  RegisterDto,
  sendEmail,
  register as serverReg, //服务端注册
  ThirdAccountDto,
  giteeUrl,
  openCheckCode,
} from "@src/api/SysUser";
import { Result } from "@src/api/base";
import { useDebounceEffect, useInterval } from "ahooks";
import { Modal } from "@douyinfe/semi-ui";

const Index: React.FC = () => {
  const localUsername = window.localStorage.getItem(localHistoryLoginUserName);
  const { user, login, error, giteeLogin } = useAuth();
  const second: number = 99;
  const navigate = useNavigate();
  const { values, errors, setFieldValue } = useForm<{
    username: string;
    password: string;
  }>({ username: localUsername || "", password: "" }, null);

  const [count, setCount] = useState(0);
  // const [interval, setInterval] = useState<number | undefined>(1000);

  const clear = useInterval(() => {
    if (count !== 0) {
      setCount(count - 1);
    }
  }, 1000);
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
    email?: string; //已经发送的邮箱
  }
  /**
   * 注册的数据
   */
  const [registerData, setRegisterData] = useState<Partial<RegisterDto>>({});
  const [open, setOpen] = useState<boolean>(false);
  const [registerFlag, setRegisterFlag] = useState<registerFlag>({
    flag: true,
  });

  //检查注册信息
  useDebounceEffect(
    () => {
      setCount(0);
      const emailEmpty =
        registerData.email === "" || registerData.email === null;
      const pwdEmpty =
        registerData.password === "" || registerData.password === null;
      // const checkCodeEmpty =
      //   registerData.checkCode === undefined ||
      //   registerData.checkCode === "" ||
      //   registerData.checkCode === null;
      let f: registerFlag = { ...registerFlag };
      // 前端校验
      if (emailEmpty) {
        f = {
          flag: false,
          msg: "邮箱不能为空",
        };
      } else if (registerData.email && !RegExp.isEmail(registerData.email)) {
        f = { flag: false, msg: "邮箱格式错误" };
      } else if (pwdEmpty) {
        f = {
          flag: false,
          msg: "密码不能为空",
        };
      } else if (registerData.password && registerData.password.length < 6) {
        f = { flag: false, msg: "密码至少6位" };
      } else {
        f = { flag: true };
      }

      //前端校验通过，采用后端校验
      if (f.flag === true) {
        checkEmail(registerData.email || "").then((rs: Result<number>) => {
          //邮箱验证
          if (rs.data && rs.data > 0) {
            f = { ...registerFlag, flag: false, msg: "账号邮箱已经注册" };
          } else {
            f = { ...registerFlag, flag: true, msg: undefined };
          }

          if (registerData.password === undefined) {
            f = { ...f, flag: false };
          }
          //密码验证
          setRegisterFlag(f);
        });
      } else {
        if (
          registerData.email === undefined &&
          registerData.password === undefined
        ) {
          f = { ...f, flag: false };
        }
        setRegisterFlag(f);
      }
    },
    [registerData],
    {
      wait: 200,
    }
  );

  // const gitSubmit = async () => {
  //   await login(values);
  // };

  const [urlParam, setUrlParam] = useUrlQueryParam(["code", "from"]);
  //当前场景
  const [part, setPart] = useState<"login" | "register" | "qr">("login");
  const gitLogin = () => {
    giteeUrl().then((d) => {
      if (d.data) {
        window.location.href = d.data;
      } else {
        alert("服务端没有启用gitee快捷登录");
      }
    });
  };

  // const openRegCode = useCallback((): boolean => {
  //   const abc = async (): => {
  //     await openCheckCode();
  //   };

  // }, []);

  useEffect(() => {
    if (urlParam.code !== undefined) {
      if (urlParam.from === "gitee") {
        giteeLogin(urlParam.code).then(
          (account: ThirdAccountDto | undefined) => {}
        );
      }
    }
    openCheckCode().then((d: any) => {
      setOpen(d.data);
    });
  }, [urlParam]);

  const register = useCallback(() => {
    if (
      registerFlag.flag === true &&
      ((registerData.checkCode && open) || open === false) &&
      registerData.email &&
      registerData.password
    ) {
      serverReg({
        password: registerData.password,
        checkCode: registerData.checkCode || "",
        email: registerData.email,
      }).then((res) => {
        if (res.data === "" || res.data === null || res.data === undefined) {
          setPart("login");
          Modal.success({
            title: "注册成功",
            content: "请登录",
          });
          setFieldValue("username", registerData.email || "");
          setFieldValue("password", "");
        } else {
          Modal.warning({
            title: "注册结果",
            content: res.data,
          });
        }
      });
    }
  }, [registerData, registerFlag, open]);

  return (
    <div
      className=" bg-fixed bg-cover bg-center  w-full
      flex items-center h-screen
      "
      style={{
        // backgroundColor: `#00c1c1`,
        backgroundImage: `url(https://wwwlike.gitee.io/vlife-img/bj.jpg) `,
      }}
    >
      {/* <div className=" absolute  left-36 top-1/4 ">
        <h1 className=" text-6xl font-bold text-white text-center">
          vlife低代码研发平台
        </h1>
      </div> */}

      {/* <div className="relative flex left-1/3 w-4/12  h-px-96  bg-white     rounded-3xl shadow-3xl">
        <div
          id="side-slide-box"
          className=" w-1/3 bg-slate-200 m-0 h-full rounded-l-3xl"
        >
         带介绍的登录框
        </div>
        <div>22222222222222</div>
      </div> */}

      <div className="main-container login-wrapper ">
        <div className="gitee" onClick={gitLogin}>
          <div className="switch-tip">Gitee快捷登录</div>
        </div>
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
            <div
              className=" cursor-pointer"
              onClick={() => {
                setPart("register");
                setRegisterData({});
              }}
            >
              <a
                href="#"
                className="text-sm  text-blue-400 hover:text-blue-500 hover:underline mb-6"
              >
                账号注册
              </a>
            </div>
            {/* <p className="text-gray-600 pt-2">管理员：manage/123456</p>
          <p className="text-gray-600 pt-2">普通用户：admin/123456</p> */}
          </section>
          <section className="mt-5">
            <div className="flex flex-col">
              <p className="text-red-500 pt-2 text-center ">{error}</p>
              <div className="mb-1 pt-2 rounded">
                {/* <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="email"
              >
                账号
              </label> */}
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
                {/* <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="password"
              >
                密码
              </label> */}
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

                {/* <span className=" absolute right-8">
                  <IconEyeOpened size="large" />
                </span> */}
              </div>
              <div className="mb-12 relative">
                <div
                  onClick={gitLogin}
                  className=" absolute cursor-pointer right-0  text-base  text-blue-700 hover:text-blue-500 hover:underline"
                >
                  {/* Gitee快捷登录 */}
                </div>
              </div>
              <button
                className=" bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200"
                onClick={handelSubmit}
              >
                登 录
              </button>
            </div>
          </section>
          <div
            id="thirdLogin"
            className=" text-zinc-400 text-sm mt-4  text-center"
          >
            <div className="mb-2">— 更多登录方式 —</div>
            <ul className="flex w-full h-10 justify-evenly">
              <li className="cursor-pointer" onClick={gitLogin}>
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="7764"
                  width="32"
                  height="32"
                >
                  <path
                    d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"
                    fill="#C71D23"
                    p-id="7765"
                  ></path>
                </svg>
              </li>

              {/* <li className="ThirdParty_recommend_2xwMV">
                <i className="iconfont ThirdParty_icon_2R4Q4">
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2741"
                    width="32"
                    height="32"
                  >
                    <path
                      d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                      fill="#28C445"
                      p-id="2742"
                    ></path>
                    <path
                      d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                      fill="#28C445"
                      p-id="2743"
                    ></path>
                  </svg>
                </i>
              </li>
              <li className="">
                <i className="iconfont ThirdParty_icon_2R4Q4 ThirdParty_qq_1HNgt">
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="7231"
                    width="32"
                    height="32"
                  >
                    <path
                      d="M918.67136 594.22848c-15.26656-37.2352-35.32928-70.4064-56.28288-96.06016 9.82016-13.0304 16.0768-32.64256 16.0768-54.58176 0-30.01088-11.6992-55.65952-28.2112-66.07616 2.5792-16.48 3.92576-33.36448 3.92576-50.56128C854.17984 146.34752 706.68032 0 524.69888 0 342.8096 0 195.29728 146.34752 195.29728 326.94912c0 17.36064 1.37728 34.40128 4.00512 51.03104-16.14976 10.70976-27.50592 36.04736-27.50592 65.6064 0 17.15072 3.82592 32.88064 10.19392 45.15584-21.12512 22.8032-41.71392 52.03968-58.58048 85.6384-46.71104 93.10848-39.7376 187.2192-10.97088 202.54592 14.75584 7.85664 53.2352-16.82432 91.0272-62.62656 6.12992 53.89696 31.6352 103.09248 70.6688 142.68672-64.66816 19.12192-107.52768 56.8704-101.78432 95.18592 7.15392 48.41728 89.03808 79.4432 182.95552 69.31072 68.7296-7.44576 124.7936-34.87872 147.1232-68.04864 5.76256 0.25984 11.56352 0.39936 17.40416 0.39936 9.36832 0 18.63552-0.3584 27.79776-1.02016 22.82112 32.79872 76.86144 60.31616 142.4064 68.68992 91.05792 11.56864 169.87392-18.18624 175.99488-66.46912 4.90112-38.49088-37.76256-77.15968-101.35808-97.15072 37.82144-38.016 63.12192-84.98304 70.65984-136.51712 33.55904 45.888 67.87072 75.2 85.81888 71.25888C942.36288 787.97312 957.5232 689.01376 918.67136 594.22848z"
                      fill="#1296db"
                      p-id="7232"
                    ></path>
                  </svg>
                </i>
              </li> */}
            </ul>
          </div>
        </div>

        {part === "register" ? (
          <div className=" absolute top-0 left-0 p-8 pt-16 rounded-lg h-full w-full bg-white">
            <section className="flex justify-between">
              <div
                style={{
                  fontSize: "22px",
                  color: "#262626",
                  fontWeight: 500,
                  lineHeight: "32px",
                }}
              >
                账号注册
              </div>
              <div onClick={() => setPart("login")}>
                <a className=" cursor-pointer text-sm text-blue-400 hover:text-blue-500 hover:underline mb-6">
                  密码登录
                </a>
              </div>
            </section>
            <section className="mt-5">
              <div className="flex flex-col">
                <p className="text-red-500 pt-2 text-center h-6 ">
                  {/* {JSON.stringify(registerFlag)} */}
                  {registerFlag.msg}
                </p>
                <div className="mb-1 pt-2 rounded">
                  <input
                    type="text"
                    placeholder="邮箱"
                    id="username"
                    value={registerData.email}
                    onChange={(evt) => {
                      setRegisterData({
                        ...registerData,
                        email: evt.target.value,
                      });
                      setRegisterFlag({ ...registerFlag, email: undefined });
                    }}
                    className=" h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                  />
                </div>
                <div className="mb-1 pt-2 rounded">
                  <input
                    type="password"
                    id="password"
                    placeholder="密码"
                    value={registerData.password}
                    onChange={(evt) =>
                      setRegisterData({
                        ...registerData,
                        password: evt.target.value,
                      })
                    }
                    className="h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                  />
                  {/* <span className=" absolute right-8">
                    <IconEyeOpened size="large" />
                  </span> */}
                </div>

                {open && (
                  <div className="mb-6 pt-2 rounded flex">
                    <input
                      type="text"
                      placeholder="邮箱验证码"
                      id="code"
                      value={registerData.checkCode}
                      onChange={(evt) => {
                        setRegisterData({
                          ...registerData,
                          checkCode: evt.target.value,
                        });
                      }}
                      className=" h-12 text-xl  rounded w-1/2 text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                    />
                    <button
                      className={`p-4 absolute right-20 ${
                        registerFlag.flag === true &&
                        count === 0 &&
                        registerFlag.email !== "ing"
                          ? // && registerFlag.email === undefined
                            "bg-blue-400 hover:bg-blue-500"
                          : " bg-slate-400"
                      }   text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200`}
                      onClick={() => {
                        if (
                          registerData.email &&
                          registerFlag.flag === true &&
                          registerFlag.email !== "ing" &&
                          count === 0
                        ) {
                          sendEmail(registerData.email).then((d) => {
                            if (
                              d.data === "" ||
                              d.data === null ||
                              d.data === undefined
                            ) {
                              setRegisterFlag({
                                //发送成功
                                ...registerFlag,
                                email: registerData.email || "",
                              });
                              Notification.success({
                                content: `发送成功,请登录邮箱查看验证码`,
                              });
                              setCount(second); //倒计时
                            } else {
                              //发送失败
                              setRegisterFlag({ ...registerFlag, msg: d.data });
                            }
                          });

                          setRegisterFlag({
                            //发送中
                            ...registerFlag,
                            email: "ing",
                          });
                        }
                      }}
                    >
                      {registerFlag.email && registerFlag.email === "ing" && (
                        <>
                          发送中
                          <Spin size="small" />
                        </>
                      )}

                      {registerFlag.email &&
                        registerFlag.email !== "ing" &&
                        count > 0 &&
                        `重新发送${count}`}

                      {((count === 0 &&
                        registerFlag.email &&
                        registerFlag.email !== "ing") ||
                        registerFlag.email === undefined) &&
                        `发送邮件`}
                    </button>
                  </div>
                )}
                {/* {JSON.stringify(registerFlag)} */}
                <button
                  className={` ${
                    registerFlag.flag === true &&
                    ((registerData.checkCode?.length === 4 &&
                      open === true &&
                      registerFlag.email) ||
                      open === false)
                      ? "bg-blue-400 hover:bg-blue-500"
                      : "bg-slate-400"
                  } text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200`}
                  onClick={register}
                >
                  注册
                </button>
              </div>
            </section>
          </div>
        ) : part === "qr" ? (
          <div className=" absolute top-0 left-0 p-8 rounded-lg h-full w-full bg-white">
            qr
          </div>
        ) : (
          <></>
        )}
        <div
          onMouseOver={() => {
            // setPart("qr");
          }}
          onMouseOut={() => {
            // setPart("login");
          }}
          className="absolute  cursor-pointer text-center w-full py-4 h-16 bottom-0 left-0  bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://static001.geekbang.org/resource/image/da/a9/da2f9b538e487ec57fecc41a5c88c9a9.png)",
            // color: "#fa8919",
            cursor: "pointer",
          }}
        >
          技术讨论QQ群：786134846
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
