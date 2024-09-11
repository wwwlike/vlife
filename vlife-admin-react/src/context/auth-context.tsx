import { Result, TranDict } from "@src/api/base";
import { list as resourcesList } from "@src/api/SysResources";
import { useMount, useSize } from "ahooks";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import { list as dictList, SysDict } from "@src/api/SysDict";
import {
  currUser,
  SysUser,
  ThirdAccountDto,
  UserDetailVo,
  detail,
} from "@src/api/SysUser";
import { login as userLogin } from "@src/api/login";
import { FormVo, formPageReq, list } from "@src/api/Form";
import { SysResources } from "@src/api/SysResources";
import { useEffect } from "react";
import { listAll, SysGroup } from "@src/api/SysGroup";
import { MenuVo } from "@src/api/SysMenu";
import { gitToken } from "@src/api/pro/gitee";
import { varObj } from "@src/api/SysVar";
import { useMemo } from "react";
import { list as buttonList } from "@src/api/Button";
import { VFBtn } from "@src/components/button/types";
import { buttonToVfBtn } from "@src/components/button/component/buttonFuns";
export const localStorageKey = "__auth_provider_token__";
const mode = import.meta.env.VITE_APP_MODE;
export interface dictObj {
  [key: string]: {
    data: {
      value: string | undefined;
      label: string;
      sys?: boolean;
      ["type"]: string;
      color: string;
    }[];
    label: string;
  };
}
/**
 * 上次登录的用户名,清除token不会清除它
 */
export const localHistoryLoginUserName = "__local_history_login_username__";
type MenuState = "show" | "mini" | "hide";
//全局状态和函数
const AuthContext = React.createContext<
  | {
      //系统变量
      sysVar: { [key: string]: any };
      //当前用户
      user: UserDetailVo | undefined;
      //菜单展开状态
      menuState: MenuState;
      setMenuState: (state: MenuState) => void;
      //所有菜单
      allMenus: MenuVo[];
      setAllMenus: (allMenus: MenuVo[]) => void;
      app?: MenuVo; //当前应用
      setApp: (app: MenuVo | undefined) => void; //当前应用
      menu?: MenuVo; //当前菜单id
      setMenu: (menu: MenuVo | undefined) => void; // 设置当前菜单
      //当前屏幕大小
      screenSize?: { width: number; height: number; sizeKey: string };
      // 所有字典信息
      dicts: dictObj;
      //全局错误信息
      error: string | null | undefined;
      //所有权限组
      groups: { [id: string]: SysGroup };
      //待缓存的模型信息提取
      findModels: (params: {
        type?: string;
        id?: string;
      }) => Promise<Result<FormVo[]>>;
      getFormInfo: (params: formPageReq) => Promise<FormVo | undefined>;
      getUserInfo: (id: string) => Promise<SysUser | undefined>;
      //模型缓存信息清除
      clearModelInfo: (modelName?: string) => void;

      //登录(可以移除到一般service里)
      login: (form: { password: string; username: string }) => void;
      giteeLogin: (code: string) => Promise<ThirdAccountDto | undefined>;
      loginOut: () => void;
      //指定key字典信息
      getDict: (obj: { emptyLabel?: string; codes?: string[] }) => TranDict[]; //如果codes不传，则返回字典类目
      //按钮权限认证
      checkBtnPermission: (code: string) => boolean; //检查按钮权限
      resources: { [code: string]: SysResources }; //全部接口权限
      menuButtons: VFBtn[]; //当前菜单的按钮
      allButtons: VFBtn[]; //所有按钮
      datasInit: () => void;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

/**
 * AuthProvider 将 authContext页面层次进行了封装
 * 把 authContext需要的数据注入了进来
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //系统变量
  const [sysVar, setVar] = useState<{ [key: string]: any }>({});
  /**
   * 当前模块menuId
   */
  const [app, setApp] = useState<MenuVo | undefined>();

  /**
   * 当前模块menuId
   */
  const [menu, setMenu] = useState<MenuVo | undefined>();

  /** 当前用户信息 */
  const [user, setUser] = useState<UserDetailVo>();
  /** 当前菜单状态 */
  const [menuState, setMenuState] = useState<MenuState>("show");
  /**
   * 权限权限资源信息
   */
  const [resources, setResources] = useState<{ [id: string]: SysResources }>(
    {}
  );

  /**
   * 权限权限资源信息
   */
  const [codeResources, setCodeResources] = useState<{
    [code: string]: SysResources;
  }>({});

  /**
   * 所有配置按钮
   */
  const [allButtons, setAllButtons] = useState<VFBtn[]>([]);

  //存模型信息的对象，key是modelName, modelInfoProps
  // 与数据库一致的，有UI场景的模型信息
  const [models, setModels] = useState<{ [key: string]: FormVo | undefined }>(
    {}
  );

  const [users, setUsers] = useState<{ [key: string]: SysUser | undefined }>(
    {}
  );
  //所有的模型信息
  const [allModels, setAllModels] = useState<FormVo[]>();
  /** 数据库结构的字典信息 */
  const [dbDicts, setDbDicts] = useState<SysDict[]>([]);
  /** 权限组集合 */
  const [groups, setGroups] = useState<{ [key: string]: SysGroup }>({});

  /**封装好的全量字典信息 */
  const [dicts, setDicts] = useState<dictObj>({});

  const [allMenus, setAllMenus] = useState<MenuVo[]>([]);

  const [error, setError] = useState<string | null>();

  /**
   * 字典数据加载则更新
   */
  useEffect(() => {
    const obj: dictObj = {};
    dbDicts.forEach((d) => {
      if (obj[d.code] === undefined) {
        if (d.val === null) {
          obj[d.code] = { label: d.title, data: [] };
        } else {
          obj[d.code] = {
            label: "",
            data: [
              { label: d.title, value: d.val, color: d.color, type: d.type },
            ],
          };
        }
      } else {
        if (d.val === null) {
          obj[d.code].label = d.title;
        } else {
          obj[d.code].data.push({
            label: d.title,
            value: d.val,
            color: d.color,
            type: d.type,
          });
        }
      }
    });
    obj["vlife"] = {
      label: "字典类目",
      data: dbDicts
        .filter((d) => d.level === 1)
        .map((d) => {
          return {
            value: d.code,
            label: d.title,
            sys: d.sys,
            color: d.color,
            type: d.type,
          };
        }),
    };
    setDicts(obj);
  }, [dbDicts]);

  const menuButtons = useMemo((): VFBtn[] => {
    return allButtons
      ?.filter((f) => f.sysMenuId === menu?.id)
      .sort((a, b) => a.sort || 0 - (b.sort || 0));
  }, [allButtons, menu]);

  /**
   * 登录成功后数据数据提取初始化
   */
  const datasInit = useCallback(() => {
    //字典初始化
    dictList().then((res) => {
      setDbDicts(res.data || []);
    });
    //同步拉取全量资源信息
    resourcesList().then((d) => {
      const _IdKeyObjectResources: { [key: string]: SysResources } =
        d?.data?.reduce<Record<string, SysResources>>((accumulator, item) => {
          accumulator[item.id] = item;
          return accumulator;
        }, {}) || {};
      setResources(_IdKeyObjectResources);
      const _codeKeyObjectResources: { [key: string]: SysResources } =
        d?.data?.reduce<Record<string, SysResources>>((accumulator, item) => {
          accumulator[item.code] = item;
          return accumulator;
        }, {}) || {};
      setResources(_IdKeyObjectResources);
      setCodeResources(_codeKeyObjectResources);
      buttonList().then((buttonData) => {
        const btns =
          buttonData.data?.map((button) => {
            return buttonToVfBtn(_IdKeyObjectResources, button);
          }) || [];
        setAllButtons(btns);
      });
    });

    //所有模型信息拉取
    list().then((f) => {
      setAllModels(f.data);
      const modelObj =
        f.data?.reduce((acc: { [key: string]: FormVo }, obj) => {
          acc[obj.type] = obj;
          return acc;
        }, {}) || {};
      setModels(modelObj);
    });
    //角色组全量提取
    listAll().then((t) => {
      let obj: { [id: string]: SysGroup } = {};
      t.data?.forEach((d) => {
        obj[d.id] = d;
      });
      setGroups({ ...obj });
    });
  }, [groups]);

  //不刷新则只加载一次
  useMount(() => {
    //拉取用户信息的同步拉拉取字典信息
    const token = window.localStorage.getItem(localStorageKey);
    //取到token情况下，加载缓存数据
    if (token) {
      currUser().then((res) => {
        if (res.data?.state === "-1") {
          window.localStorage.removeItem(localStorageKey);
          window.localStorage.removeItem(localHistoryLoginUserName);
          setError("账号已禁用");
        } else {
          setUser(res.data);
          // alert(res.data?.menus.map((d) => d.routerAddress).join(","));
          datasInit();
          setAllMenus(res.data?.menus || []);
        }
      });
    }
    //系统环境变量提取
    varObj({}).then((d: Result<any>) => {
      setVar(d || {});
    });
  });

  /**
   *
   * @param modelName 清除model缓存信息
   */
  function clearModelInfo(modelName?: string) {
    if (modelName === undefined) {
      setModels({});
    } else if (models[modelName]) {
      setModels({ ...models, [modelName]: undefined });
    }
  }
  //从缓存里取模型信息
  async function getFormInfo(params: formPageReq): Promise<FormVo | undefined> {
    const key = params.type || params.id;
    if (key) {
      if (models[key] === undefined) {
        //简写(promise形式返回数据出去)
        let forms = await (await list(params)).data;
        setModels({
          ...models,
          [key]: forms?.[0],
        });
        return forms?.[0];
      } else {
        return models[key];
      }
    }
    return undefined;
  }
  const getUserInfo = useCallback(
    (userId: string): Promise<SysUser | undefined> => {
      //简写(promise形式返回数据出去)
      if (users[userId] === undefined) {
        return detail({ id: userId }).then((res) => {
          setUsers((u: any) => {
            return { ...u, [userId]: res.data };
          });
          return res.data;
        });
      } else {
        return new Promise((resolve) => resolve(users[userId]));
      }
    },
    [users]
  );

  const findModels = useCallback(
    ({
      type,
      id,
    }: {
      type?: string;
      id?: string;
    }): Promise<Result<FormVo[]>> => {
      if (allModels) {
        return new Promise((resolve) =>
          resolve({
            code: "200",
            msg: "success",
            data: allModels
              .filter((m) => {
                if (id) {
                  return m.id === id;
                }
                return true;
              })
              .filter((m) => {
                if (type) {
                  return m.type === type;
                }
                return true;
              }),
          })
        );
      }
      return new Promise((resolve) =>
        resolve({ code: "200", msg: "success", data: [] })
      );
    },
    [allModels]
  );

  // const resources = useMemo((): { [key: string]: SysResources } => {
  //   if (allResources) {
  //     return allResources.reduce<Record<string, SysResources>>(
  //       (accumulator, item) => {
  //         accumulator[item.id] = item;
  //         return accumulator;
  //       },
  //       {}
  //     );
  //   }
  //   return {};
  // }, [allResources]);
  /**
   * @param codes 多条字典信息
   * @returns
   */
  const getDict = useCallback(
    ({
      emptyLabel = "全部",
      codes,
    }: {
      emptyLabel?: string;
      codes?: string[];
    }): TranDict[] => {
      let tranDicts: TranDict[] = [];
      if (dbDicts) {
        if (codes) {
          //指定的字典
          codes.forEach((code) => {
            const codeDicts: Pick<SysDict, "title" | "val">[] = [];
            codeDicts.push({ val: undefined, title: emptyLabel });
            codeDicts.push(
              ...dbDicts.filter((sysDict) => {
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
            ...dbDicts.filter((sysDict) => {
              return sysDict.val === undefined || sysDict.val === null;
            })
          );
          tranDicts.push({ column: "", sysDict: codeDicts });
        }
      }
      return tranDicts;
    },
    [dbDicts]
  );

  //giteelogin 方式登录】
  const giteeLogin = useCallback(
    (code: string): Promise<ThirdAccountDto | undefined> => {
      return gitToken(code, "gitee").then((result) => {
        if (result.code == "200" && result.data) {
          window.localStorage.setItem(localStorageKey, result.data.token);
          currUser().then((res) => {
            setUser(res.data);
            datasInit();
          });
        } else {
          setError(result.msg);
        }
        return result.data;
      });
    },
    []
  );

  const login = useCallback((from: { username: string; password: string }) => {
    userLogin({ username: from.username, password: from.password }).then(
      (result) => {
        if (result.code == "200" && result.data) {
          window.localStorage.setItem(localStorageKey, result.data);
          window.localStorage.setItem(localHistoryLoginUserName, from.username);
          currUser().then((res) => {
            if (res.data?.state === "-1") {
              window.localStorage.removeItem(localStorageKey);
              window.localStorage.removeItem(localHistoryLoginUserName);
              setError("账号已禁用");
            } else {
              setUser(res.data);
              datasInit();
            }
          });
        } else {
          setError(result.msg);
        }
      }
    );
  }, []);

  /**
   * @param btnObj 检查权限编码是否在用户能访问的范围里
   * 1. 资源绑定了菜单，但没有关联到角色，这样的资源非super也无法访问
   * 2. 不在资源里写错了的code目前允许访问(因为当前无校验提醒)
   * 3.
   * @returns
   */
  const checkBtnPermission = useCallback(
    (code: string): boolean => {
      //超级权限组，所有功能都能访问
      if (user?.superUser) {
        return true;
      }
      if (
        user &&
        user.resourceCodes &&
        code &&
        user?.resourceCodes?.includes(code)
      ) {
        //拥有权限可访问
        return true;
      } else if (
        //没导入资源可访问
        codeResources?.[code] &&
        codeResources?.[code].sysMenuId === null &&
        codeResources?.[code].pcode === null
      ) {
        return true;
      } else if (codeResources?.[code] === undefined) {
        //资源无法查询到，也让访问
        return true;
      }
      //用户没有此资源，此资源没有绑定模块
      return false;
    },
    [user?.resourceCodes, codeResources]
  );
  /**
   * 退出
   */
  const loginOut = useCallback(() => {
    window.localStorage.removeItem(localStorageKey);
    setUser(undefined);
    window.location.href = "/login";
    // navigate("/login");
  }, []);
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    sizeKey: string;
  }>();
  const ref = useRef(null);
  const size = useSize(ref);
  useEffect(() => {
    let sizeKey = "3xl";
    if (screenSize === undefined || screenSize.width < 640) {
      sizeKey = "sm";
    } else if (screenSize.width < 768) {
      sizeKey = "md";
    } else if (screenSize.width < 1024) {
      sizeKey = "lg";
    } else if (screenSize.width < 1280) {
      sizeKey = "xl";
    } else if (screenSize.width < 1536) {
      sizeKey = "2xl";
    }
    if (size) setScreenSize({ ...size, sizeKey });
  }, [size]);

  return (
    <div ref={ref}>
      <AuthContext.Provider
        children={children}
        value={{
          sysVar,
          user,
          menuState,
          setMenuState,
          app,
          setApp,
          menu,
          setMenu,
          allMenus,
          setAllMenus,
          findModels,
          screenSize,
          dicts,
          error,
          groups,
          getFormInfo,
          getUserInfo,
          clearModelInfo,
          login,
          giteeLogin,
          loginOut,
          getDict,
          resources,
          menuButtons,
          allButtons,
          checkBtnPermission,
          datasInit, //数据强制初始化
        }}
      />
    </div>
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
