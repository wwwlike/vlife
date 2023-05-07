//所有菜单路由进入权限管理
//对菜单纳入模块管理
import {
  SysResources,
  listAll as resourcesAll,
  saveResources,
} from "@src/api/SysResources";
import { listAll as menuAll } from "@src/api/SysMenu";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  ButtonGroup,
  Dropdown,
  Input,
  Layout,
  List,
  Nav,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Tree,
} from "@douyinfe/semi-ui";
import { IconSave } from "@douyinfe/semi-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconHelpCircle,
  IconLoopTextStroked,
  IconClose,
  IconForward,
} from "@douyinfe/semi-icons";
import Column from "@douyinfe/semi-ui/lib/es/table/Column";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { listAll } from "@src/api/SysRole";
import { SysMenu } from "@src/api/SysMenu";
import { useNiceModal } from "@src/store";
import { TreeNodeData } from "@douyinfe/semi-ui/lib/es/tree";
import { entityModels, FormVo } from "@src/api/Form";
import VlifeButton from "@src/components/vlifeButton";
import SelectIcon from "@src/components/SelectIcon";
import { arrayToTreeData } from "@src/util/func";

//对菜单下接入的权限进行启用停用
export interface ResourcesConfProps {
  menuId?: string;
}
export default ({ menuId }: ResourcesConfProps) => {
  const [sysMenuId, setSysMenuId] = useState<string | null>(
    menuId || localStorage.getItem("currMenuId")
  );
  const [role, setRole] = useState<{ label: string; value: string }[]>(); //所有角色
  const [resources, setResources] = useState<Partial<SysResources>[]>(); //最新资源
  const [dbResources, setDbResources] = useState<Partial<SysResources>[]>(); //数据库资源
  const [menus, setMenus] = useState<SysMenu[]>(); //所有菜单
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
  const menu = useMemo((): SysMenu | undefined => {
    if (menus && sysMenuId) {
      return menus.filter((m) => m.id === sysMenuId)[0];
    }
  }, [menus, sysMenuId]);
  /**
   * 抓取当前菜单路由下的接口
   */
  const catchResources = useMemo((): string[] => {
    if (menu && window.localStorage.getItem(menu.url) !== null)
      return JSON.parse(window.localStorage.getItem(menu.url) || "");
    return [];
  }, [menu]);

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
  useEffect(() => {
    if (sysMenuId) {
      //全量资源
      loadResourcesData();
      //菜单信息
      menuAll().then((m) => {
        setMenus(m.data);
        setFilter({
          state: "-1",
          entityType:
            m.data?.filter((mm) => mm.id === sysMenuId)[0].entityType || "",
        });
      });
      //角色信息
      listAll().then((d) => {
        setRole(
          d.data?.map((d) => {
            return { label: d.name, value: d.id };
          })
        );
      });
      //所有实体信息
      entityModels().then((d) => {
        setEntitys(d.data);
      });
    }
  }, [sysMenuId]);

  const navigate = useNavigate();
  return (
    <Layout className="layout-page">
      <Layout.Header
        className="layout-header shadow"
        style={{ height: "50px" }}
      >
        <Nav
          mode="horizontal"
          header={
            <div className=" flex items-center">
              {/* <Label>{menuStr || `路由地址${menuCode}对应的菜单没找到`}</Label> */}
              当前菜单：
              <Label>
                {menu?.pcode &&
                  menus?.filter((m) => m.code === menu.pcode)[0].name + "/"}
                {menu?.name}
              </Label>
              <Button
                onClick={() => {
                  vlifeModal.show({
                    title: "菜单切换",
                    okFun: () => {},
                    children: (
                      <Tree
                        expandAll
                        selectedKey={sysMenuId}
                        onSelect={(
                          selectedKeys: string,
                          selected: boolean,
                          selectedNode: TreeNodeData
                        ) => {
                          if (selected) {
                            if (
                              menus?.filter(
                                (m: SysMenu) => m.id === selectedKeys
                              )[0].pcode
                            ) {
                              setSysMenuId(selectedKeys);
                              vlifeModal.hide();
                            }
                          }
                        }}
                        treeData={arrayToTreeData(
                          menus?.filter(
                            (m) => m.pcode === null || m.entityType !== null
                          ) || [],
                          "id"
                        )}
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
              <VlifeButton
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
              </VlifeButton>
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
            <Label>请选择接口进行绑定</Label>
            {/* <Breadcrumb className=" mt-2 ml-4"> */}
            {/* <Breadcrumb.Item></Breadcrumb.Item>
              <Breadcrumb.Item>接口选择</Breadcrumb.Item>
              <Breadcrumb.Item>
                {entitys?.filter((e) => e.type === filter?.entityType)[0].title}
              </Breadcrumb.Item>
            </Breadcrumb> */}
          </div>

          {/* <div >
            <Label>
              当前位置：
             
            </Label>
          </div> */}
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
                        {item.name}
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
            <Label>已绑定的接口资源</Label>
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
              render={(text, record, index) => (
                <Input
                  value={text}
                  onChange={(t) => {
                    const line = { ...record, name: t };
                    setResources(
                      resources?.map((r, i) => {
                        return record.id === r.id ? line : r;
                      })
                    );
                  }}
                />
                // <Input value={a} onChange={(t) => setA(t)} />
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
                  <div className=" absolute right-0 hidden group-hover:block">
                    复制
                  </div>
                </Label>
              )}
            />
            {/* <Column
              title="调用情况"
              dataIndex="auth"
              key="resourcesCode"
              width={100}
              render={(text, record: SysResources, index) =>
                record.resourcesType !== "1" ? (
                  catchResources.filter((s) => s.includes(record.url)).length >
                  0 ? (
                    <Tag type="light" color="blue">
                      已调用
                    </Tag>
                  ) : (
                    <Tag>未调用</Tag>
                  )
                ) : (
                  <></>
                )
              }
            /> */}
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
          {
            // resources?.filter(
            //   (r) =>
            //     r.entityType?.toLowerCase() ===
            //       menu?.entityType.toLowerCase() && r.menuId === null
            // ).length
            // JSON.stringify(saveResources)
          }
        </div>
      </div>
    </Layout>
  );
};
