import { Notification } from "@douyinfe/semi-ui";
import axios, { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_APP_API_URL;
const canRemove: string = import.meta.env.VITE_APP_SAVE_REMOVE;
const localStorageKey = "__auth_provider_token__";
//待启用
const errorMessage = [
  { code: 400, msg: "请求错误" },
  { code: 401, msg: "未授权，请登录" },
  { code: 403, msg: "拒绝访问" },
  { code: 404, msg: "请求地址出错" },
  { code: 408, msg: "请求超时" },
  { code: 500, msg: "服务器内部错误" },
  { code: 501, msg: "服务未实现" },
  { code: 502, msg: "网关错误" },
  { code: 503, msg: "服务不可用" },
  { code: 504, msg: "网关超时" },
  { code: 505, msg: "HTTP版本不受支持" },
];

// const { user } = useAuth();
// 创建 axios 的实例

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
});

const whiteList = ["/login"];

const CancelToken = axios.CancelToken;
let source = CancelToken.source();

const diseaseApi = [
  "remove", //所有都不能删除
  "sysRole/save",
  "sysResources/save",
  "sysGroup/save",
  "sysUser/save",
];
// const navigate = useNavigate();

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.cancelToken = source.token; // 写入取消请求的标识
    const isEnabled =
      diseaseApi.filter((str) => config.url?.indexOf(str) != -1).length > 0;
    if (canRemove === "false" && isEnabled) {
      source.cancel("演示环境不能进行该操作"); //取消请求
      source = CancelToken.source(); //终止cancel;否则全部请求都会取消
    }
    const token = window.localStorage.getItem(localStorageKey);

    if (token === null && config.url?.indexOf("/login") === -1) {
      source.cancel("请先登录"); //取消请求
      source = CancelToken.source(); //终止cancel;否则全部请求都会取消
    }

    if (
      config.url &&
      !whiteList.includes(config.url) &&
      token &&
      config.headers
    ) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 听过 axios 定义拦截器预处理所有请求
instance.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      Notification.error({
        content: `服务端运行异常，异常代码${res.status}`,
      });
    } else if (res.data.code != 200) {
      //业务逻辑异常
      Notification.error({
        content: `${res.data.msg}`,
      });
    }

    if (res.config.method === "post") {
      Notification.success({
        content: `操作成功`,
      });
    }
    //
    return res.data;
    // return Promise.reject(res.data);
  },
  (err) => {
    if (err.code === "ERR_NETWORK") {
      //服务端连接异常
      Notification.error({
        content: `服务端异常`,
      });
    } else if (err.code === "ERR_CANCELED") {
      //请求取消
      Notification.error({
        content: `${err.message}`,
      });
    } else if (err.response.status === 403) {
      Notification.error({
        content: `没有权限`,
      });
      // alert("无权限访问");
      window.localStorage.removeItem(localStorageKey);
      // 统一处理未授权请求，跳转到登录界面
      // document.location = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;
