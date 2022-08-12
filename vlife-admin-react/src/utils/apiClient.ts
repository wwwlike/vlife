import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
const apiUrl = import.meta.env.VITE_APP_API_URL;
const localStorageKey = "__auth_provider_token__";
// const { user } = useAuth();
// 创建 axios 的实例

const instance = axios.create({
  // 实际项目中根据当前环境设置 baseURL
  baseURL: apiUrl,
  timeout: 30000,
  // 为所有请求设置通用的 header
  // headers: {
  //   Authorization: window.localStorage.getItem(localStorageKey) || true,
  // },
});
//       "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTc4NzA0NjAsInN1YiI6IjEiLCJ1c2VyIjp7ImlkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJwYXNzd29yZCI6IntGNFQ5dDJCRTNIQ3ZEOWtoTEN4TC9ueWliL0FkTTFXcVIvdE14NWVKSjJrPX1mMGFmYTc4M2JhNzYwNzA2MzYwNmZkYjQzYzJlNTVmYiIsImF1dGhvcml0aWUiOiJncm91cDEiLCJncm91cElkIjoiZ3JvdXAxIiwib3JnY29kZSI6bnVsbCwib3JndHlwZSI6bnVsbCwidXNlcnR5cGUiOiIxIiwib3JnSWQiOm51bGwsImFyZWFjb2RlIjpudWxsLCJlbmFibGVkIjp0cnVlLCJjcmVkZW50aWFsc05vbkV4cGlyZWQiOnRydWUsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJncm91cDEifV0sImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJhY2NvdW50Tm9uTG9ja2VkIjp0cnVlfX0.XiGMedi7pR4_b-HefixCFL6ytF3bMQ7sf5jloJK4zmI",

// const res = axios({
//   method: 'GET',
//   url: 'http://www.liulongbin.top:3006/api/getbooks'
// })

const whiteList = ["/login"];

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.method === "get" || config.method === "GET") {
      // console.log("get", qs.stringify(config.params, { arrayFormat: "comma" }));
      // config.params = qs.stringify(config.params, { arrayFormat: "comma" });
    }
    const token = window.localStorage.getItem(localStorageKey);
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
    if (res.status !== 200 || res.data.code != "200") {
      // console.error(res.data.code, res.data.msg);
      // window.localStorage.removeItem(localStorageKey);
    }
    console.log(res.data);
    return res.data;
    // return Promise.reject(res.data);
  },
  (err) => {
    if (err.response.status === 403) {
      window.localStorage.removeItem(localStorageKey);
      // alert("无权限");
      // 统一处理未授权请求，跳转到登录界面
      // document.location = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;
