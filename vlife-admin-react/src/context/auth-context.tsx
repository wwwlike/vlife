/**
 * 把用户信息放置到 context里去
 */
import { AuthForm, useCurrUser, useLogin } from "@src/provider/userProvider";
import { useAllDict } from "@src/provider/dictProvider";
import { ModelInfo, Result, TranDict } from "@src/mvc/base";
import { useMount } from "ahooks";
import React, { ReactNode, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VfButton } from "@src/components/table";
import { SysDict } from "@src/mvc/SysDict";
import { UserDetailVo } from "@src/mvc/SysUser";
import { modelInfo } from "@src/provider/baseProvider";
import { addAbortSignal } from "stream";
import { FormVo, model } from "@src/mvc/model/Form";

const localStorageKey = "__auth_provider_token__";
//全局状态类型定义，初始化为undefiend ,注意这里返回的是Pomise函数
const AuthContext = React.createContext<
  | {
      //返回模型信息(旧待删除)
      getModelInfo: (
        entityName: string,
        modelName: string
      ) => Promise<ModelInfo | undefined>;
      //模型信息
      getFormInfo: (
        modelName: string,
        uiType: "save" | "vo" | "list" | "req"
      ) => Promise<FormVo | undefined>;
      //当前用户
      user: UserDetailVo | undefined;
      //所有模型
      models: any;
      login: (form: AuthForm) => void;
      loginOut: () => void;
      //获得字典信息,如果codes不传，则返回一级字典
      getDict: (obj: { emptyLabel?: string; codes?: string[] }) => TranDict[];
      //按钮权限认证
      checkBtnPermission: (code: string) => boolean; //检查按钮权限
      error: string | null | undefined;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

/**
 * AuthProvider 将 authContext页面层次进行了封装
 * 把 authContext需要的数据注入了进来
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDetailVo>();
  //存模型信息的对象，key是modelName, modelInfoProps
  // 要缓存最后计算的信息
  const [models, setModels] = useState<any>({});
  const [dicts, setDicts] = useState<SysDict[]>([]);
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { data: currUser, runAsync: runCurruser } = useCurrUser();
  const { runAsync: userLogin } = useLogin();
  const { data: allDict, runAsync } = useAllDict();
  //不刷新则只加载一次
  useMount(() => {
    //拉取用户信息的同时拉取字典信息
    runCurruser().then((res) => {
      setUser(res.data);
      runAsync().then((res) => {
        if (res.data) {
          setDicts(res.data);
        }
      });
    });
  });

  async function getModelInfo(
    entityName: string,
    modelName: string
  ): Promise<ModelInfo | undefined> {
    if (models[modelName] === undefined) {
      //简写
      let model = await (await modelInfo(entityName, modelName)).data;
      setModels({ ...models, modelName: model });
      // then的写法
      // await modelInfo(entityName,modelName).then(data=>{
      //   model=data.data;
      //   setModels({...models,modelName:model})
      // });
      return model;
    } else {
      return models[modelName];
    }
  }

  async function getFormInfo(
    modelName: string,
    uiType: "save" | "vo" | "list" | "req"
  ): Promise<FormVo | undefined> {
    if (models[modelName + uiType] === undefined) {
      //简写
      let form = await (await model({ uiType, modelName })).data;
      setModels({ ...models, [modelName + uiType]: form });
      return form;
    } else {
      return models[modelName + uiType];
    }
  }

  // /**
  //  * 获得模型信息，modelN
  //  * @param modelName
  //  * @returns
  //  */
  // const getModelInfo11= (entityName:string,modelName:string):ModelInfo | undefined=>{
  //   let modelResult =undefined;
  //   if(models[modelName]===undefined){
  //        modelResult = ( modelInfo(modelName,entityName)).data
  //       // setModels({...models,modelName:modelResult.data})
  //     }
  //   return modelResult;
  // }

  /**
   * @param codes 多条字典信息
   * @returns
   */
  const getDict = ({
    emptyLabel = "全部",
    codes,
  }: {
    emptyLabel?: string;
    codes?: string[];
  }): TranDict[] => {
    let tranDicts: TranDict[] = [];
    if (dicts) {
      if (codes) {
        //指定的字典
        codes.forEach((code) => {
          const codeDicts: Pick<SysDict, "title" | "val">[] = [];
          codeDicts.push({ val: undefined, title: emptyLabel });
          codeDicts.push(
            ...dicts.filter((sysDict) => {
              return sysDict.code === code && sysDict.val;
            })
          );

          tranDicts.push({ column: code, sysDict: codeDicts });
        });
      } else {
        //一级字典
        const codeDicts: Pick<SysDict, "title" | "val">[] = [];
        codeDicts.push({ val: undefined, title: emptyLabel });
        codeDicts.push(
          ...dicts.filter((sysDict) => {
            return sysDict.val === undefined || sysDict.val === null;
          })
        );

        tranDicts.push({ column: "", sysDict: codeDicts });
      }
    }
    return tranDicts;
  };

  const login = useCallback((from: AuthForm) => {
    userLogin(from).then((result) => {
      if (result.code == "200" && result.data) {
        window.localStorage.setItem(localStorageKey, result.data);
        runCurruser().then((res) => {
          setUser(res.data);
          runAsync().then((res) => {
            if (res.data) {
              setDicts(res.data);
            }
          });
        });
      } else {
        setError(result.msg);
      }
    });
  }, []);

  /**
   * @param btnObj 检查按钮权限
   * @returns
   */
  const checkBtnPermission = useCallback(
    (code: string): boolean => {
      console.log("code", code);
      // if (user?.username === "manage") {
      //   return true;
      // }
      //按钮有模块和key就校验权限
      if (user && user.resourceCodes && code) {
        return user?.resourceCodes?.includes(code);
      }
      return false;
    },
    [user?.resourceCodes]
  );

  const loginOut = useCallback(() => {
    window.localStorage.removeItem(localStorageKey);
    setUser(undefined);
    navigate("/login");
  }, []);

  return (
    <AuthContext.Provider
      children={children}
      value={{
        user,
        login,
        error,
        loginOut,
        getDict,
        checkBtnPermission,
        getModelInfo,
        getFormInfo,
        models,
      }}
    />
  );
};

/**
 *  这里是简化了context的调用
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
