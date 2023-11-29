import react, { useCallback, useEffect, useState } from "react";
import { TabPane, Tabs } from "@douyinfe/semi-ui";
import { FormVo, list } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { renderIcon } from "@src/pages/layout/components/sider";
import Scrollbars from "react-custom-scrollbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IconClose,
  IconCrop,
  IconList,
  IconMenu,
  IconPuzzle,
  IconRankingCardStroked,
  IconTerminal,
} from "@douyinfe/semi-icons";
import { listAll, SysMenu, save as menuSave, MenuVo } from "@src/api/SysMenu";
import classNames from "classnames";
import BtnToolBar from "@src/components/table/component/BtnToolBar";
import { VF } from "@src/dsl/VF";

const Model = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  //当前选中的实体模型名称
  const [entityType, setEntityType] = useState<string | undefined>();
  //当前模型关联的菜单
  const [menu, setMenu] = useState<MenuVo>();

  useEffect(() => {
    if (entityType) {
      listAll().then((menus) => {
        const menu = menus.data?.filter(
          (m) => m.entityType === entityType
        )?.[0];
        setMenu(menu);
        menu && window.localStorage.setItem("currMenuId", menu.id);
      });
    } else {
      setMenu(undefined);
    }
  }, [entityType]);

  const [back, setBack] = useState(false);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newValue = searchParams.get("type") || undefined;
    setBack(searchParams.get("goBack") ? true : false);
    setEntityType(newValue);
  }, [location.search]);
  //全部实体模型
  const [dbEntitys, setDbEntitys] = useState<FormVo[]>([]);
  //全部IModel模型
  const [imodel, setIModel] = useState<FormVo[]>([]);

  const color: any = {
    sys: "bg-yellow-50",
    conf: "bg-gray-50",
    page: "bg-blue-50",
    report: "bg-green-50",
    erp: "bg-red-50",
  };

  const apps = user?.menus.filter((f) => f.app && f.entityPrefix) || [];

  //当前模块各个分类的颜色块
  useEffect(() => {
    list({ itemType: "entity" }).then((d) => {
      if (d.data) {
        setDbEntitys(d.data);
      } else {
        setDbEntitys([]);
      }
    });

    list({ itemType: "bean" }).then((d) => {
      if (d.data) {
        setIModel(d.data);
      } else {
        setIModel([]);
      }
    });
  }, []);

  const card = useCallback(
    (e: FormVo) => {
      return (
        <Link
          className="!cursor-pointer"
          key={e.entityType}
          to={`/sysConf/model?type=${e.type}`}
        >
          <div
            key={e.entityType}
            onDoubleClick={() => {
              navigate(`/sysConf/formDesign/${entityType}`);
            }}
            className={`flex !cursor-pointer group relative  w-full h-24 border items-center justify-center
        ${color[e.module] !== undefined ? color[e.module] : "bg-white"} 

        ${classNames({
          "border-gray-300 hover:border-gray-400": entityType !== e.entityType,
          "border-blue-500 !bg-blue-100 ": entityType === e.entityType,
        })}
         border-dashed rounded-lg p-2 text-center   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <div>
              <span className="block text-sm font-medium text-gray-900">
                {e.title}
              </span>
              <p>{e.type}</p>
            </div>
          </div>
        </Link>
      );
    },
    [entityType]
  );

  /**
   * 模块下的实体
   */
  const liEntity = useCallback(
    (app: SysMenu): FormVo[] => {
      const entityPrefixs: string[] = app.entityPrefix.split(",");
      return dbEntitys
        .filter((d) => {
          const module = d.module;
          return (
            entityPrefixs.filter(
              (e) => d.module.toLocaleLowerCase() === e.toLocaleLowerCase()
            ).length > 0
          );
        })
        .sort((a, b) => {
          return a.entityType.localeCompare(b.entityType);
        });
    },
    [user?.menus, dbEntitys]
  );

  const [tabKey, setTabKey] = useState<string>();

  useEffect(() => {
    if (apps && dbEntitys && entityType) {
      setTabKey(
        apps.filter((a) =>
          a.entityPrefix.includes(
            dbEntitys.filter((d) => d.entityType === entityType)?.[0]?.module
          )
        )[0]?.code
      );
    }
  }, [apps, entityType, dbEntitys]);
  // const activeKey = useMemo((): string => {
  //   if (activeKey) {

  //     dbEntitys.filter()
  //   } else {
  //     return apps[0].id;
  //   }
  //   return "";
  // }, [apps,dbEntitys, entityType]);
  return (
    <Scrollbars autoHide={true}>
      <Tabs
        activeKey={tabKey}
        onTabClick={(key) => {
          setEntityType(undefined);
          setTabKey(key);
        }}
        className="relative"
        onChange={() => {}}
      >
        {back && (
          <IconClose
            onClick={() => navigate(-1)}
            className=" absolute top-2 right-2 cursor-pointer hover:bg-blue-100"
          />
        )}
        {apps.map((m, index) => (
          <TabPane
            icon={renderIcon(m.icon)}
            itemKey={m.code}
            key={`app${m.id}`}
            tab={m.name}
            className="p-2 bg-white"
          >
            {entityType ? (
              <div className="flex  items-center space-x-2">
                <div className=" text-sm font-bold  w-40 text-center justify-center  border rounded-md  border-dashed bg-slate-50 p-1  ">
                  {
                    dbEntitys.filter((d) => d.entityType === entityType)?.[0]
                      ?.title
                  }
                  {`->`}
                </div>
                <BtnToolBar
                  className=" bg-white"
                  entityName={"form"}
                  key={"tableBtn"}
                  onDataChange={(datas: any[]): void => {
                    //根据id更新行数据，则可以不强制刷新
                  }}
                  btns={[
                    {
                      title: "前端代码",
                      disabledHide: false,
                      actionType: "custom",
                      icon: <IconTerminal />,
                      onClick: () => {
                        navigate(
                          `/sysConf/model/codeView/${entityType}?fullTitle=TS代码查看和下载`
                        );
                      },
                    },
                    {
                      title: "相关模型",
                      disabledHide: false,
                      actionType: "custom",
                      icon: <IconPuzzle />,
                      onClick: () => {
                        navigate(`/sysConf/model/detail/${entityType}`);
                      },
                    },
                    {
                      title: "表单设计",
                      disabledHide: false,
                      actionType: "custom",
                      icon: <IconRankingCardStroked />,
                      onClick: () => {
                        navigate(
                          `/sysConf/formDesign/${entityType}?fullTitle=表单设计`
                        );
                      },
                    },
                    {
                      title: "列表设计",
                      disabledHide: false,
                      actionType: "custom",
                      icon: <IconList />,
                      onClick: () => {
                        navigate(`/sysConf/tableDesign/${entityType}`);
                      },
                    },
                    {
                      title: "资源绑定",
                      disabledHide: false,
                      actionType: "custom",
                      usableMatch:
                        menu !== undefined ? true : "请先创建模型关联的菜单",
                      icon: <IconCrop />,
                      onClick: () => {
                        navigate(`/sysConf/resources`);
                      },
                    },
                    {
                      title: "创建菜单",
                      disabledHide: true,
                      actionType: "create",
                      model: "sysMenu",
                      icon: <IconMenu></IconMenu>,
                      usableMatch: !menu,
                      saveApi: menuSave,
                      reaction: [
                        VF.then(
                          "app",
                          "placeholderUrl",
                          "sysRoleId",
                          "code",
                          "confPage",
                          "pageLayoutId",
                          "entityPrefix",
                          "sort",
                          "entityType"
                        ).hide(),
                        VF.then("entityType").value(entityType).hide(),
                      ],
                    },
                    {
                      title: "查看菜单",
                      disabledHide: true,
                      icon: <IconMenu></IconMenu>,
                      actionType: "edit",
                      model: "sysMenu",
                      loadApi: (d: FormVo) => {
                        return listAll().then((menus) => {
                          return {
                            ...menus,
                            data: menus.data?.filter(
                              (m) => m.entityType === d.entityType
                            )[0],
                          };
                        });
                        // return und;
                      },
                      usableMatch: menu ? true : "请创建关联菜单",
                      saveApi: menuSave,
                      reaction: [
                        VF.then(
                          "app",
                          "placeholderUrl",
                          "sysRoleId",
                          "code",
                          "confPage",
                          "pageLayoutId",
                          "entityPrefix",
                          "sort",
                          "entityType"
                        ).hide(),
                      ],
                    },
                    {
                      title: "访问功能",
                      disabledHide: false,
                      icon: <IconMenu></IconMenu>,
                      actionType: "custom",
                      usableMatch: menu
                        ? true
                        : "还没有功能与该模型关联,请先创建菜单",
                      onClick: () => {
                        navigate(`${menu?.url}?fullTitle=${menu?.name}`);
                      },
                    },
                  ]}
                  position="page"
                  datas={
                    entityType
                      ? dbEntitys.filter((d) => d.entityType === entityType)
                      : []
                  }
                />
              </div>
            ) : (
              <>请选择一个模型进行操作</>
            )}

            <div
              role="list"
              className="   border-t mt-2 border-dashed grid   gap-4  sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
            >
              {liEntity(m).map((e) => {
                return card(e);
              })}
            </div>
            {/* liEntity */}
          </TabPane>
        ))}
        <TabPane itemKey={"bean"} key={`app_bean`} tab={"一般模型(IModel)"}>
          <div>
            <ul role="list" className="grid  p-2 gap-4 grid-cols-10">
              {imodel.map((model, index) => (
                <li
                  className="relative"
                  key={"li_" + model.type}
                  onClick={() => {
                    navigate(`/sysConf/formDesign/${model.type}`);
                  }}
                >
                  <div className="relative block w-full h-24 border-2 border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {model.title}
                    </span>
                    <p>{model.type}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabPane>
      </Tabs>
      <div className="p-4 font-sm text-blue-600 font-chinese space-y-2 top-2 w-full  bg-white">
        <p>配置中心</p>
        <span className="block">
          1.
          负责对entity及其关联的req\vo\dto模型使用表单和列表设计器进行功能设计
        </span>
        <span className="block">2. 可以获取前端模型和接口调用的代码</span>
        <span className="block">3. 可以将接口与菜单进行绑定</span>
        <p>注意</p>
        <span className="block">
          1. 后端需要运行maven install，前端才能获取同步的模型和接口数据。
        </span>
      </div>
    </Scrollbars>
  );
};

export default Model;
