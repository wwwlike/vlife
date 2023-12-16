import { Notification } from "@douyinfe/semi-ui";
import { formatDate } from '@src/util/func';
import axios, { AxiosRequestConfig } from "axios";
import qs from 'qs';
const apiUrl = import.meta.env.VITE_APP_API_URL;
const mode=import.meta.env.VITE_APP_MODE;
const canRemove: string = import.meta.env.VITE_APP_SAVE_REMOVE;
const localStorageKey = "__auth_provider_token__";
//待启用(让前端错误代码和ServletResponseEnum匹配紧密型)
export const errorMessage:{[key:string]:string} = {
  '4404': "请求地址出错", //匹配到的
  '4400':"入参格式不正确",
   '400': "请求错误",
  '401': "未授权，请登录",
   '403': "拒绝访问",
  '408': "请求超时",
  '500': "服务器内部错误",
 '501': "服务未实现",
 '502': "网关错误",
'503': "服务不可用",
 '504': "网关超时",
  '505': "HTTP版本不受支持",
};



const instance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
});

const whiteList = ["/login", "/git/token"];

const CancelToken = axios.CancelToken;
let source = CancelToken.source();

// const navigate = useNavigate();

function filterUndefinedParams(url: string): string {
  // 判断url中是否包含'?'
  if (url.includes('?')) {
    const [baseUrl, queryParams] = url.split('?');
    // 将查询参数转为对象
    const params = queryParams.split('&').reduce((obj, param) => {
      const [key, value] = param.split('=');
      obj[key] = value;
      return obj;
    }, {} as Record<string, string>);
    // 遍历params对象，删除值为"undefined"的参数
    for (const key in params) {
      if (params[key] === 'undefined') {
        delete params[key];
      }
    }
    // 将params对象转为查询参数
    const newQueryParams = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    return `${baseUrl}?${newQueryParams}`;
  }
  return url;
}


instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    //删除url里有undefined的键值对
    if(config.url&&config.url.indexOf("?")!==-1 &&config.url.indexOf("undefined")!==-1){
      config.url=filterUndefinedParams(config.url);
    }
    //  拦截器来过滤掉 GET 请求参数中值为空字符串的属性，从而不发送这些参数到后端
    if (config.method === "get") {
      // 过滤掉请求参数中值为空字符串的属性
      let params = config.params;
      for (let key in params) {
        if (params.hasOwnProperty(key) && (params[key] === "" ||  params[key]=== "undefined" ||  params[key]=== undefined ||params[key]===null)) {
          delete params[key];
        }
      }
  }
    //所有get 请求入参处理（get请求参数都需要封装到params里）
    config.paramsSerializer=(params)=>qs.stringify(params,{
        allowDots: true, //多级对象转str中间加点
      //  arrayFormat: "brackets", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
        serializeDate: (date) => {
          //日期格式化，否则后台报错
          return formatDate(date, "yyyy/MM/dd");
        }
      })
    config.cancelToken = source.token; // 写入取消请求的标识
    if (config.url&&!whiteList.includes(config.url)&&canRemove === "false"&&(config.method === 'delete' || config.method === 'post')) {
      source.cancel("演示环境不能进行该操作"); //取消请求
      source = CancelToken.source(); //终止cancel;否则全部请求都会取消
    }
    const token = window.localStorage.getItem(localStorageKey);
    if (
      token === null &&
      config.url?.indexOf("/login") === -1 &&
      config.url?.indexOf("git") === -1 && 
      config.url?.indexOf("Email") === -1 &&
      config.url?.indexOf("/register") === -1
    ) {
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

//  axios 定义拦截器预处理所有请求
instance.interceptors.response.use(
  (res) => {
    let url=res.config.url;
    if(url&&url.indexOf('?')!==-1){
       url= url.substring(0, url.indexOf('?'))
    }
    const { data } = res;
    // alert(JSON.stringify(data));

    if (res.status !== 200) {
      Notification.error({
        content: `服务端运行异常，异常代码${res.status}`,
      });
    } else if (res.data.code != 200 &&    window.location.href.indexOf("login") === -1) {
      if(mode==="dev"){
        Notification.error({
          content:(errorMessage[res.data.code]?errorMessage[res.data.code]:"")+ `${res.data.code}：${res.data.msg}`,
        });
      }else{//生产模式
        Notification.error({
          content: errorMessage[res.data.code]?errorMessage[res.data.code]:`${res.data.msg}`,
        });
      }
      return Promise.reject({...res.data,url,method:res.config.method}); //错误返回出去
    } else if ((res.config.method === "post"||res.config.method === "delete")&&
      window.location.href.indexOf("login") === -1
    ){
      Notification.success({
        content: `操作成功`,
        position:'bottomRight'
      });
    }

    if (res.data.code === 9999) {
      //超时删除token 系统异常也是9999（排查）
      // window.localStorage.removeItem(localStorageKey);
    }
    //接口写入当前访问路由localStorage里（开发时写入）
    // const  currRouter=window.localStorage.getItem("currRouter");
    // if(currRouter&&url){
    //   const currRouterApi=window.localStorage.getItem(currRouter);
    //   let apis:string[]=currRouterApi?JSON.parse(currRouterApi):[];
    //   if(!apis.includes(url)){
    //     apis.push(url)
    //     window.localStorage.setItem(currRouter,JSON.stringify(apis));
    //   }
    
    // }

      if(url){
        const menuCode=url.substring(1,url.substring(1).indexOf("/")+1)
        const currRouterApi=window.localStorage.getItem(menuCode);
        let apis:string[]=currRouterApi?JSON.parse(currRouterApi):[];
        if(!apis.includes(url)){
          apis.push(url)
          window.localStorage.setItem(menuCode,JSON.stringify(apis));
        }
    }
   
    //
    return res.data;
    // return Promise.reject(res.data);
  },
  (err) => {
    if (err.code === "ERR_NETWORK") {
      //服务端连接异常
      Notification.error({
        content: `服务端未启动`,
      });
    } else if (err.code === "ERR_CANCELED") {
      //请求取消
      if (window.location.href.indexOf("login") === -1){
        Notification.error({
          content: `${err.message}`,
        });
      }
    } else if (err.response.status === 403) {
      Notification.error({
        content: `没有权限`,
      });
      // alert("无权限访问");
      // window.localStorage.removeItem(localStorageKey);
      // 统一处理未授权请求，跳转到登录界面
      // document.location = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;
