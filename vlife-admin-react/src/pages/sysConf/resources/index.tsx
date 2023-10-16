/**
 * 资源于菜单绑定
 * 将资源纳入到菜单后，则可以参与角色接口绑定
 * 智能化配置2个方案：
 * 1. 根据各个模块页面使用接口情况自动导入；
 * 2. 该页面配置后（配置buttonConf里的内容），各页面模块可不写按钮配置，从这里进行读取
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SysResources,
  listAll as resourcesAll,
  saveResources,
} from "@src/api/SysResources";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Dropdown,
  Input,
  Layout,
  List,
  Nav,
  Popover,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Tree,
} from "@douyinfe/semi-ui";
import { Notification } from "@douyinfe/semi-ui";
import { IconSave } from "@douyinfe/semi-icons";
import {
  IconHelpCircle,
  IconLoopTextStroked,
  IconClose,
  IconForward,
} from "@douyinfe/semi-icons";
import Column from "@douyinfe/semi-ui/lib/es/table/Column";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { listAll } from "@src/api/SysRole";
import { MenuVo } from "@src/api/SysMenu";
import { useNiceModal } from "@src/store";
import { TreeNodeData } from "@douyinfe/semi-ui/lib/es/tree";
import { entityModels, FormVo } from "@src/api/Form";
import VfButton from "@src/components/VfButton";
import SelectIcon from "@src/components/SelectIcon";
import { arrayToTreeData } from "@src/util/func";
import VfTour from "@src/components/VfTour";
import { useAuth } from "@src/context/auth-context";
//对菜单下接入的权限进行启用停用
export interface ResourcesConfProps {
  menuId?: string;
}
export default ({ menuId }: ResourcesConfProps) => {
  const [sysMenuId, setSysMenuId] = useState<string | null>(
    menuId || localStorage.getItem("currMenuId")
  );
  const inputVal = useRef(null);
  const { user } = useAuth();
  const [role, setRole] = useState<{ label: string; value: string }[]>(); //所有角色
  const [resources, setResources] = useState<Partial<SysResources>[]>(); //最新资源
  const [dbResources, setDbResources] = useState<Partial<SysResources>[]>(); //数据库资源
  const [menus, setMenus] = useState<MenuVo[]>(); //所有菜单
  const [entitys, setEntitys] = useState<FormVo[]>();
  const submitData = useMemo((): Partial<SysResources>[] => {
    const saves: Partial<SysResources>[] = [];
    if (resources && dbResources) {
      resources.forEach((r) => {
        dbResources.forEach((rr) => {
          if (rr.id === r.id && JSON.stringify(rr) !== JSON.stringify(r)) {
            saves.push(r);
          }
        });
      });
      return saves;
    }
    return [];
  }, [resources, dbResources]);
  const [filter, setFilter] = useState<{
    state: "1" | "0" | "-1";
    entityType?: string;
  }>(); //所有菜单
  const vlifeModal = useNiceModal("vlifeModal");
  const menu = useMemo((): MenuVo | undefined => {
    if (menus && sysMenuId) {
      return menus.filter((m) => m.id === sysMenuId)[0];
    }
  }, [menus, sysMenuId]);

  const oneKeySet = (code: string): string => {
    if (code.includes("save")) return "IconSave";
    return "IconSave";
  };

  const renderList = useMemo(() => {
    const dataSource =
      filter?.state === "-1" //相关联接口
        ? resources?.filter(
            (r) =>
              (r.sysMenuId === null || r.sysMenuId === undefined) &&
              r?.entityType?.toLowerCase() ===
                filter?.entityType?.toLowerCase() &&
              r.state === "-1"
          )
        : filter?.state === "0"
        ? resources?.filter(
            (r) =>
              r?.entityType?.toLowerCase() ===
                filter?.entityType?.toLowerCase() && r.state === "0"
          )
        : [];
    return dataSource;
  }, [resources, filter, menu]);

  const loadResourcesData = useCallback(() => {
    resourcesAll({ menuCode: undefined }).then((d) => {
      setResources(d.data); //可修改的
      setDbResources(d.data); // init提取的资源
    });
  }, []);

  const treeData = useMemo(() => {
    const selectMenu =
      menus?.filter((m) => m.url === null || m.entityType !== null) || [];

    return arrayToTreeData(selectMenu, "id");
  }, [menus]);

  useEffect(() => {
    if (sysMenuId) {
      //全量资源
      loadResourcesData();
      if (user) {
        setMenus(user.menus);
        setFilter({
          state: "-1",
          entityType:
            user.menus?.filter((mm) => mm.id === sysMenuId)[0].entityType || "",
        });
      }
      //角色信息
      listAll().then((d) => {
        setRole(
          d.data?.map((d) => {
            return { label: d.name, value: d.id };
          })
        );
      });
      //所有实体信息
      entityModels({}).then((d) => {
        setEntitys(d.data);
      });
    }
  }, [sysMenuId, user]);

  const navigate = useNavigate();
  return (
    <VfTour
      code="468"
      steps={[
        {
          selector: ".fieldSelectTour",
          content: "选择需要关联权限的菜单",
        },
        {
          selector: ".move",
          content: "选择接口进行权限组关联",
        },
      ]}
    >
      <Layout className="layout-page">
        <Layout.Header
          className="layout-header shadow"
          style={{ height: "50px" }}
        >
          <Nav
            mode="horizontal"
            header={
              <div className=" flex items-center">
                当前菜单：
                <Label>
                  {menu?.pcode &&
                    menus?.filter((m) => m.code === menu.pcode)[0].name + "/"}
                  {menu?.name}
                </Label>
                <Button
                  className="fieldSelectTour"
                  onClick={() => {
                    vlifeModal.show({
                      title: `菜单切换`,
                      okFun: () => {},
                      children: (
                        <Tree
                          // expandAll
                          selectedKey={sysMenuId}
                          onSelect={(
                            selectedKeys: string,
                            selected: boolean,
                            selectedNode: TreeNodeData
                          ) => {
                            if (selected) {
                              if (
                                //有关联实体的可以进行权限设置
                                menus?.filter(
                                  (m: MenuVo) => m.id === selectedKeys
                                )[0].entityType
                              ) {
                                setSysMenuId(selectedKeys);
                                vlifeModal.hide();
                              } else {
                                alert(
                                  "只能选择与实体关联的菜单进行权限资源绑定"
                                );
                              }
                            }
                          }}
                          treeData={treeData}
                        />
                      ),
                    });
                  }}
                  icon={<IconLoopTextStroked className=" cursor-pointer " />}
                ></Button>
              </div>
            }
            footer={
              <Space>
                {/* <VlifeButton
                code="sysResources:save"
                onClick={() => {
                  setResources(
                    resources?.map((r: Partial<SysResources>) => {
                      return { ...r, icon: oneKeySet(r.code || "") };
                    })
                  );
                }}
                icon={<IconSave />}
              >
                一键配置
              </VlifeButton> */}
                <VfButton
                  disabled={
                    JSON.stringify(resources) === JSON.stringify(dbResources)
                  }
                  onClick={() => {
                    saveResources(submitData).then((d: any) => {
                      loadResourcesData();
                    });
                  }}
                  code="sysResources:save"
                  icon={<IconSave />}
                >
                  保存
                </VfButton>
                <Button
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  返回
                </Button>
              </Space>
            }
          />
        </Layout.Header>
        <div className="h-full flex overscroll-auto">
          <div className=" mt-2 mr-2 bg-white w-1/3">
            <div className="pt-2 pl-4">
              <Label>
                <Tooltip content="用户需关联权限组，该权限组再关联一个或者多个权限角色，角色在这里关联相应的接口资源，从而使用户能够获得权限组所包含角色所拥有的接口资源">
                  请选择要纳入权限管理的后台API接口
                </Tooltip>
              </Label>
            </div>

            <Space className="mt-4 ml-4">
              <Dropdown
                render={
                  <div className=" w-96  bg-slate-100 p-4  grid grid-cols-3 space-x-2 space-y-2">
                    {entitys?.map((entity) => (
                      <Tag
                        className=" hover:bg-slate-400"
                        size="large"
                        type={
                          filter?.state === "-1" &&
                          filter.entityType === entity?.type
                            ? "solid"
                            : "ghost"
                        }
                        key={`entity${entity.type}`}
                        onClick={() => {
                          setFilter({ state: "-1", entityType: entity.type });
                        }}
                      >
                        {entity.title}
                      </Tag>
                    ))}
                  </div>
                }
              >
                <Tag
                  // color="blue"
                  size="large"
                  type={filter?.state === "-1" ? "solid" : "ghost"}
                >
                  待选择接口
                </Tag>
              </Dropdown>

              <Dropdown
                render={
                  <div className=" w-96  bg-slate-100 p-4  grid grid-cols-3 space-x-2 space-y-2">
                    {entitys?.map((entity) => (
                      <Tag
                        className=" hover:bg-slate-400"
                        size="large"
                        type={
                          filter?.state === "0" &&
                          filter.entityType === entity?.type
                            ? "solid"
                            : "ghost"
                        }
                        key={`entity${entity.type}`}
                        onClick={() => {
                          setFilter({ state: "0", entityType: entity.type });
                        }}
                      >
                        {entity.title}
                      </Tag>
                    ))}
                  </div>
                }
              >
                <Tag
                  size="large"
                  type={filter?.state === "0" ? "solid" : "ghost"}
                >
                  已忽略接口
                </Tag>
              </Dropdown>
            </Space>

            <div className=" p-2">
              {/* <Scrollbars > */}
              <List
                dataSource={renderList}
                renderItem={(item, index) => (
                  <List.Item
                    className=" relative border "
                    key={item.id}
                    header={
                      <>
                        <SelectIcon value={item.icon} read />
                        {/* {JSON.stringify(item.icon)} */}
                      </>
                    }
                    main={
                      <div>
                        <span
                          style={{
                            color: "var(--semi-color-text-0)",
                            fontWeight: 100,
                          }}
                        >
                          {item.name}/{`(${item.remark})`}
                        </span>
                        <p>{item.url}</p>
                      </div>
                    }
                    extra={
                      <ButtonGroup
                        className=" absolute top-0 right-0"
                        theme="borderless"
                      >
                        <Button
                          icon={<IconForward />}
                          className="move"
                          onClick={() => {
                            resources &&
                              setResources(
                                resources.map((r) => {
                                  return r.id === item.id
                                    ? {
                                        ...item,
                                        sysMenuId: sysMenuId || "",
                                        state: "1",
                                      }
                                    : r;
                                })
                              );
                          }}
                        />

                        <Button
                          icon={<IconClose />}
                          onClick={() => {
                            resources &&
                              setResources(
                                resources.map((r) => {
                                  return r.id === item.id
                                    ? {
                                        ...item,
                                        sysMenuId: undefined,
                                        state: "0",
                                      }
                                    : r;
                                })
                              );
                          }}
                        />
                      </ButtonGroup>
                    }
                  />
                )}
              />
              {/* </Scrollbars> */}
            </div>
          </div>
          <div className="w-full bg-white mt-2">
            <div className="p-2">
              <Label>菜单权限绑定</Label>
            </div>
            <Table
              dataSource={resources?.filter((r) => r.sysMenuId === menu?.id)}
              pagination={false}
            >
              <Column title="接口地址" width={200} dataIndex="url" key="url" />
              <Column
                title="接口名称"
                dataIndex="name"
                width={140}
                key="name"
                className="group"
                render={(text, record, index) => (
                  <div className="flex">
                    <div className="  mr-2">{text}</div>
                    <Popover
                      content={
                        <div className="  p-2 ">
                          <Input
                            ref={inputVal}
                            onChange={(v) => {
                              const line = { ...record, name: v };
                              setResources(
                                resources?.map((r, i) => {
                                  return record.id === r.id ? line : r;
                                })
                              );
                            }}
                            placeholder="请输入修改后的名称"
                          />
                        </div>
                      }
                      trigger="click"
                    >
                      <div className="hidden group-hover:block">修改</div>
                    </Popover>
                  </div>
                )}
              />
              <Column
                title="图标"
                dataIndex="icon"
                key="icon"
                width={110}
                render={(text, record, index) => (
                  <SelectIcon
                    key={"icon" + record.id}
                    value={text}
                    onDataChange={(icon) => {
                      setResources(
                        resources?.map((r, i) => {
                          return record.id === r.id ? { ...r, icon } : r;
                        })
                      );
                    }}
                  />
                )}
              />
              <Column
                title="模块"
                dataIndex="entityType"
                key="entityType"
                width={110}
              />
              <Column
                className="group"
                title="编码"
                dataIndex="code"
                key="code"
                width={180}
                render={(text, record, index) => (
                  <Label>
                    {text}
                    <div
                      className=" absolute right-0 hidden group-hover:block"
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        Notification.info({
                          duration: 3,
                          title: "已复制",
                          position: "bottomRight",
                        });
                      }}
                    >
                      复制
                    </div>
                  </Label>
                )}
              />

              <Column
                width={120}
                title={
                  <>
                    主要接口
                    <Tooltip content="进入该菜单模块一定会访问到的接口">
                      <IconHelpCircle />
                    </Tooltip>
                  </>
                }
                dataIndex="menuRequired"
                key="menuRequired"
                render={(text: boolean, record: SysResources, index) => (
                  <Switch
                    checked={text}
                    onChange={(menuRequired) => {
                      setResources(
                        resources?.map((r, i) => {
                          return record.id === r.id
                            ? { ...r, menuRequired: menuRequired }
                            : r;
                        })
                      );
                    }}
                  />
                )}
              />
              <Column
                width={150}
                title={
                  <>
                    关联角色
                    {/* <IconHelpCircle /> */}
                  </>
                }
                dataIndex="sysRoleId"
                key="sysRoleId"
                render={(text: string, record, index) => (
                  <Select
                    showClear
                    style={{ width: "150px" }}
                    optionList={role}
                    value={text}
                    onChange={(role) => {
                      setResources(
                        resources?.map((r, i) => {
                          return r.id === record.id
                            ? {
                                ...r,
                                sysRoleId: role ? role + "" : undefined,
                              }
                            : r;
                        })
                      );
                    }}
                  />
                )}
              />

              <Column
                title="移除"
                dataIndex="id"
                key="id"
                render={(id: string, record, index) => (
                  <Button
                    onClick={() => {
                      setResources(
                        resources?.map((r, i) => {
                          return r.id === record.id
                            ? {
                                ...record,
                                sysMenuId: undefined,
                                sysRoleId: undefined,
                                state: "-1",
                              }
                            : r;
                        })
                      );
                    }}
                  >
                    移除
                  </Button>
                )}
              />
            </Table>
          </div>
        </div>
      </Layout>
    </VfTour>
  );
};
