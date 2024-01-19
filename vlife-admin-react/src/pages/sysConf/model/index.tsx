import react, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Dropdown,
  SideSheet,
  TabPane,
  Tabs,
  Tooltip,
} from "@douyinfe/semi-ui";
import { FormVo, list, save } from "@src/api/Form";
import { renderIcon } from "@src/pages/layout/components/sider";
import Scrollbars from "react-custom-scrollbars";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconClose,
  IconLive,
  IconMenu,
  IconRegExp,
  IconTerminal,
} from "@douyinfe/semi-icons";
import {
  listAll,
  save as menuSave,
  MenuVo,
  saveMenuResourcesDto,
  detailMenuResourcesDto,
} from "@src/api/SysMenu";
import classNames from "classnames";
import BtnToolBar from "@src/components/table/component/BtnToolBar";
import { VF } from "@src/dsl/VF";
import VfTour from "@src/components/VfTour";
import LinkMe from "@src/pages/layout/components/header/LinkMe";
import RelationModel from "./component/RelationModel";
import { useNiceModal } from "@src/store";
import { useDetail } from "@src/api/base/baseService";
import { VFBtn } from "@src/components/table/types";

export type modelForm = FormVo & {
  list?: FormVo[];
  req?: FormVo[];
  form?: FormVo[];
  bean?: FormVo[];
};
type appEntityType = { [menuCode: string]: modelForm[] };

const Model = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //所有菜单
  const [menus, setMenus] = useState<MenuVo[]>([]);
  //所有实体模型
  const [forms, setForms] = useState<modelForm[]>([]);
  //当前选中模型标识
  const [entityType, setEntityType] = useState<string | undefined>();
  //回退到上一页标识
  const [back, setBack] = useState(false);
  //当前活动的tab页签
  const [tabKey, setTabKey] = useState<string>();
  //侧边栏可见标识
  const [visible, setVisible] = useState<boolean>(false);
  //系统应用
  const apps = useMemo((): MenuVo[] => {
    if (menus) {
      return menus.filter((f) => f.app);
    }
    return [];
  }, [menus]);
  //应用与模型关联对象

  const appEntity = useMemo((): appEntityType => {
    const entitys: appEntityType = {};
    if (apps && forms) {
      apps?.forEach((app) => {
        entitys[app.code] = forms.filter((f) => f.sysMenuId === app.id);
      });
    }
    entitys["app_empty"] = forms.filter(
      (f) => f.sysMenuId === null || f.sysMenuId === undefined
    );
    return entitys;
  }, [apps, forms]);
  //当前实体
  const currEntity = useMemo((): modelForm => {
    return forms.filter((f) => f.entityType === entityType)?.[0];
  }, [forms, entityType]);

  //当前实体关联菜单
  const entityMenus = useMemo((): MenuVo[] => {
    if (menus && entityType && forms) {
      const entityId = forms.filter((f) => f.entityType === entityType)?.[0]
        ?.id;
      return menus.filter((f) => f.formId === entityId);
    }
    return [];
  }, [menus, forms, entityType]);

  //实体加载
  const entityLoad = useCallback(() => {
    list().then((result) => {
      const modelForms: modelForm[] =
        result.data
          ?.filter((f) => f.itemType === "entity")
          .map((entity) => {
            return {
              ...entity,
              list: [entity],
              form:
                result.data?.filter(
                  (f) =>
                    (f.itemType === "save" || f.itemType === "vo") &&
                    f.entityType === entity.entityType
                ) || [],
              req:
                result.data?.filter(
                  (f) =>
                    f.itemType === "req" && f.entityType === entity.entityType
                ) || [],
              bean:
                result.data?.filter(
                  (f) =>
                    f.itemType === "bean" && f.entityType === entity.entityType
                ) || [],
            };
          }) || [];
      setForms(modelForms);
    });
  }, []);
  //菜单加载
  const menuLoad = useCallback(() => {
    listAll().then((res) => {
      setMenus(res.data || []);
    });
  }, []);

  useEffect(() => {
    entityLoad();
    menuLoad();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramEntityType = searchParams.get("type") || undefined;
    const paramFormId = searchParams.get("formId") || undefined;
    setBack(searchParams.get("goBack") ? true : false);
    if (paramEntityType) {
      setEntityType(paramEntityType);
    } else if (paramFormId && forms) {
      setVisible(true);
      setEntityType(forms.filter((f) => f.id === paramFormId)?.[0]?.type);
    }

    if (
      tabKey === undefined &&
      paramEntityType === undefined &&
      apps &&
      apps?.length > 0
    ) {
      setTabKey(apps[0].code);
    }
  }, [location.search, apps, forms]);

  const card = useCallback(
    (e: modelForm, className?: string) => {
      const menuLength: number = menus.filter((m) => m.formId === e.id).length;

      return (
        <div
          key={e.entityType}
          className={`flex group relative  w-full h-24 border items-center justify-center
         transition duration-500 hover:-translate-y-1
        ${classNames({
          "bg-yellow-50": menuLength > 0,
          "bg-gray-50": menuLength === 0,
          "hover:border-gray-400 border-d": entityType !== e.entityType,
          "border-gray-400 !bg-blue-100 font-bold": entityType === e.entityType,
        })}
       group hover:bg-blue-50  border-dashed rounded-lg p-2 text-center  `}
        >
          <div
            className="group-hover:font-bold cursor-pointer"
            onClick={() => navigate(`/sysConf/model?type=${e.type}`)}
          >
            <p>{e.title}</p>
            <p>{e.type}</p>
          </div>
          <div className="   absolute right-1 bottom-1 group-hover:block ">
            <Tooltip
              content={`${
                1 +
                (e?.req?.length || 0) +
                (e?.list?.length || 0) +
                (e?.bean?.length || 0) +
                (e?.form?.length || 0)
              }个相关模型可配`}
            >
              <Avatar
                className="hover:bg-blue-500"
                size="extra-extra-small"
                alt="User"
                onClick={() => {
                  setVisible(true);
                  navigate(`/sysConf/model?type=${e.type}`);
                }}
              >
                {1 +
                  (e?.req?.length || 0) +
                  (e?.list?.length || 0) +
                  (e?.bean?.length || 0) +
                  (e?.form?.length || 0)}
              </Avatar>
            </Tooltip>
          </div>

          <Dropdown
            stopPropagation
            showTick={true}
            render={
              <Dropdown.Menu>
                <Dropdown.Title>所属应用</Dropdown.Title>
                {apps?.map((a) => (
                  <Dropdown.Item
                    active={a.code === tabKey}
                    onClick={() => {
                      if (a.code !== tabKey) {
                        setEntityType(undefined);
                        save({ ...e, sysMenuId: a.id }).then((d) => {
                          entityLoad();
                        });
                      }
                    }}
                    key={e.id + "change" + a.id}
                  >
                    {a.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            }
          >
            <i
              className={`${classNames({
                hidden: tabKey !== "app_empty",
                "group-hover:animate-bounce": tabKey === "app_empty",
              })} absolute  left-1 bottom-1 group-hover:block icon-out `}
            />
          </Dropdown>
        </div>
      );
    },
    [entityType, apps, tabKey]
  );

  useEffect(() => {
    if (entityType && appEntity) {
      const tab = Object.keys(appEntity).filter((code) => {
        return (
          appEntity[code]?.filter((v) => v.entityType === entityType)?.length >
          0
        );
      })?.[0];
      setTabKey(tab);
    }
  }, [appEntity, entityType]);

  const btns = useMemo((): VFBtn[] => {
    const _btns: VFBtn[] = [
      {
        className: "modeManage",
        title: `模型管理(${
          1 +
          (currEntity?.req?.length || 0) +
          (currEntity?.list?.length || 0) +
          (currEntity?.bean?.length || 0) +
          (currEntity?.form?.length || 0)
        })`,
        disabledHide: false,
        actionType: "click",
        icon: <i className="icon-task-model-three" />,
        onClick: () => {
          setVisible(true);
        },
      },
      {
        className: "tscode",
        title: "代码生成",
        disabledHide: false,
        actionType: "click",
        icon: <IconTerminal />,
        onClick: () => {
          navigate(
            `/sysConf/model/codeView/${entityType}?fullTitle=TS代码查看和下载`
          );
        },
      },
      {
        className: "createMenu",
        title: "创建菜单",
        disabledHide: true,
        actionType: "create",
        model: "sysMenu",
        icon: <IconMenu></IconMenu>,
        saveApi: menuSave,
        onSubmitFinish: menuLoad,
        reaction: [
          VF.then("name").value(currEntity?.title),
          VF.then("formId").value(currEntity?.id),
          VF.then("app").value(false).hide(),
          VF.field("confPage")
            .eq(true)
            .then("url", "formId", "placeholderUrl")
            .hide()
            .clearValue(),
          VF.then("formId").readPretty(),
          VF.field("confPage").eq(true).then("pageLayoutId").show(),
          VF.field("url")
            .endsWidth("*")
            .then("placeholderUrl")
            .show()
            .then("placeholderUrl")
            .required(),
        ],
      },
    ];
    if (entityMenus && entityMenus.length > 0) {
      entityMenus.forEach((m) => {
        _btns.push({
          title: m.name + "(功能预览)",
          actionType: "click",
          icon: <IconLive />,
          onClick: () => {
            const url =
              m.url && m.url.endsWith("*")
                ? m.url.replace("*", m.placeholderUrl)
                : m.url;
            navigate(`${url}?fullTitle=${m?.name}`);
          },
        });
      });
      entityMenus.forEach((m) => {
        _btns.push({
          title: m.name + "(权限关联)",
          actionType: "edit",
          icon: <IconRegExp />,
          model: "menuResourcesDto",
          loadApi: (d) => detailMenuResourcesDto({ id: m.id }),
          saveApi: saveMenuResourcesDto,
        });
      });
    }
    return _btns;
  }, [entityType, currEntity, entityMenus]);

  return (
    // <VfTour
    //   code="4444"
    //   steps={[
    //     {
    //       selector: ".tscode",
    //       content: "下载前端实体所有的数据模型和接口调用代码",
    //     },
    //     {
    //       selector: ".relationModel",
    //       content: "查看实体关联的req/vo/dto模型",
    //     },
    //     {
    //       selector: ".formDesign",
    //       content: "使用页面配置表单",
    //     },
    //     {
    //       selector: ".tableDesign",
    //       content: "使用页面配置列表",
    //     },
    //     {
    //       selector: ".resourceBind",
    //       content: "为当前模块关联的菜单绑定接口资源权限",
    //     },
    //     {
    //       selector: ".visitPage",
    //       content: "访问当前实体对应的页面功能",
    //     },
    //   ]}
    // >
    <Scrollbars autoHide={true}>
      <Tabs
        activeKey={tabKey}
        tabBarExtraContent={
          <div className=" w-full mr-10 ">
            <BtnToolBar
              position="page"
              btns={[
                {
                  icon: <i className=" icon-createFolder" />,
                  title: "创建应用",
                  actionType: "create",
                  model: "sysMenu",
                  saveApi: menuSave,
                  reaction: [
                    VF.then("app").value(true).hide(),
                    VF.then(
                      "url",
                      "formId",
                      "placeholderUrl",
                      "pcode",
                      "confPage"
                    )
                      .hide()
                      .clearValue(),
                    VF.then("name").title("应用名称"),
                  ],
                  onSubmitFinish: (res) => {
                    menuLoad();
                  },
                },
              ]}
            />
          </div>
        }
        onTabClick={(key) => {
          setEntityType(undefined);
          setTabKey(key);
        }}
        className="relative bg-white"
      >
        {entityType && tabKey !== "app_empty" && (
          <div className="flex p-1  items-center  space-x-2 bg-white  rounded-md ">
            <div className="flex justify-start gap-x-2">
              <div className="relative flex justify-center  text-sm font-bold  w-40  border rounded-md  border-dashed bg-slate-50 p-1  ">
                <div>
                  {forms.filter((d) => d.entityType === entityType)?.[0]?.title}
                </div>
                <i className=" absolute right-2 icon-sideslip_right text-xl  " />
              </div>
              <BtnToolBar
                key={"tableBtn"}
                onDataChange={(datas: any[]): void => {}}
                btns={btns}
                position="page"
                datas={currEntity ? [currEntity] : []}
              />
            </div>
          </div>
        )}

        {tabKey && appEntity[tabKey].length === 0 && (
          <div className="inline-block font-bold   text-center  text-sm  m-2 bg-yellow-50 border  py-2 px-2  border-dashed rounded-md">
            {appEntity["app_empty"]?.length > 0
              ? "请从未分配Tab页面里选择和当前应用相关的实体模型"
              : "请先在后台创建和本应用相关的`entity,vo,dto,req`模型"}
          </div>
        )}
        {tabKey &&
          appEntity[tabKey].length !== 0 &&
          entityType === undefined &&
          tabKey !== "app_empty" && (
            <>
              <div className="inline-block font-bold   text-center  text-sm  m-2 bg-yellow-50 border  py-2 px-2  border-dashed rounded-md">
                <i className="icon-chat_open" />
                已启用用模块
              </div>
              <div className="inline-block font-bold text-center  text-sm  m-2 bg-gray-50 border  py-2 px-2  border-dashed rounded-md">
                待启用模块(没有菜单关联)
              </div>
            </>
          )}

        {tabKey === "app_empty" && (
          <div className="inline-block text-center mx-2 text-sm bg-blue-50 border py-2 px-4 border-dashed rounded-md">
            请将模型关联到应用后进行配置 <i className="icon-out" />
          </div>
        )}

        {back && (
          <IconClose
            onClick={() => navigate(-1)}
            className="  absolute top-2 right-2 cursor-pointer hover:bg-blue-100"
          />
        )}

        {appEntity["app_empty"]?.length > 0 && (
          <TabPane
            itemKey={"app_empty"}
            key={`app_empty`}
            icon={<i className="icon-lift text-xl mr-2" />}
            tab={`未分配(${appEntity["app_empty"]?.length})`}
            className=" bg-white"
          >
            <div
              role="list "
              className="  p-2  border-t mt-2 border-dashed grid   gap-4  sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
            >
              <div
                className={`text-xl h-24 border  flex items-center justify-center border-gray-300 hover:border-gray-400 hover:bg-blue-50  border-dashed rounded-lg font-bold text-blue-500 hover:text-gray-500`}
              >
                未分配({appEntity["app_empty"]?.length})
              </div>

              {appEntity &&
                appEntity["app_empty"]
                  ?.sort((a, b) => a.entityType.localeCompare(b.entityType))
                  ?.map((e: any) => {
                    return card(e);
                  })}
            </div>
          </TabPane>
        )}
        {apps?.map((app, index) => (
          <TabPane
            icon={renderIcon(app.icon)}
            itemKey={app.code}
            key={`app${app.id}`}
            tab={`${app.name}(${appEntity[app.code].length})`}
            className=" bg-white"
          >
            <div
              role="list "
              className="p-2 border-t mt-2 border-dashed grid   gap-4  sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 "
            >
              <div
                className={`text-xl h-24 border hover:text-gray-500  flex items-center justify-center border-gray-300 hover:border-gray-400 hover:bg-blue-50  border-dashed rounded-lg font-bold text-blue-500`}
              >
                {app.name}({appEntity[app.code].length})
              </div>
              {appEntity &&
                appEntity[app.code]
                  .sort(
                    (a, b) =>
                      menus.filter((m) => m.formId === b.id).length -
                        menus.filter((m) => m.formId === a.id).length ||
                      b.type.localeCompare(a.type)
                  )
                  ?.map((e) => {
                    // @ts-ignore
                    return card(e);
                  })}
            </div>
          </TabPane>
        ))}
      </Tabs>
      {currEntity && (
        <SideSheet
          width={520}
          title={currEntity.title}
          visible={entityType !== undefined && visible}
          onCancel={() => {
            setVisible(false);
            // setEntityType(undefined);
          }}
        >
          <RelationModel modelForm={currEntity} />
        </SideSheet>
      )}

      <div className=" p-4 font-sm  font-chinese space-y-2 top-2 w-full  bg-white">
        <p>配置中心：</p>
        <span className="block">
          1.
          实时同步服务端模型信息(`eneity/req/vo/dto`,服务端设计完成后运行`maven
          package`)
        </span>
        <span className="block">2. 提供与模型接口匹配的`Typescript`代码</span>
        <span className="block">3. 各模型页面配置功能的入口</span>
        {/* <span className="block">4. 是各类和模型有关的页面配置功能的入口</span> */}
        <div className="flex">
          <p>欢迎反馈：</p>
          {/* <span className="block">如有体验疑惑或优化意见可联系反馈。</span> */}
          <LinkMe></LinkMe>
        </div>
      </div>
    </Scrollbars>
    // </VfTour>
  );
};

export default Model;
