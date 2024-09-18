import { Checkbox } from "@douyinfe/semi-ui";
import { SysGroupResources } from "@src/api/SysGroupResources";
import { MenuVo, SysMenu } from "@src/api/SysMenu";
import { SysResources } from "@src/api/SysResources";
import SelectIcon from "@src/components/SelectIcon";
import { VfBaseProps } from "@src/dsl/component";
import { useUpdateEffect } from "ahooks";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";

//资源绑定
export interface ResourcesBindingProps
  extends VfBaseProps<Partial<SysGroupResources>[]> {
  allResources: SysResources[];
  allMenu: MenuVo[];
}
export default (props: ResourcesBindingProps) => {
  const { allResources, allMenu, onDataChange, value, className } = props;

  const [selected, setSelected] = useState<Partial<SysGroupResources>[]>(
    value || []
  );
  const [app, setApp] = useState<MenuVo>();

  useEffect(() => {
    if (allMenu?.length > 0 && app === undefined) {
      setApp(allMenu.filter((a) => a.app)?.[0]);
    }
  }, [allMenu]);

  useUpdateEffect(() => {
    onDataChange(selected);
  }, [selected]);

  //查找当前app下的菜单
  const menus = useCallback(
    (_app: MenuVo) => {
      if (_app && allMenu && allResources) {
        const _menuIds = allResources
          .filter((r) => r.sysMenuId)
          .map((s) => s.sysMenuId);
        const _thisAppMenu: MenuVo[] = allMenu
          ?.filter((item) => item.code.startsWith(_app?.code))
          .filter((m) => _menuIds.includes(m.id));
        return _thisAppMenu;
        // .filter((r) => r.code.startsWith(app?.code));
      }
      return [];
    },
    [allMenu, allResources]
  );

  //可被选择的没有权限的菜单
  const noAuthMenus = useMemo((): MenuVo[] => {
    return app
      ? allMenu
          ?.filter(
            //无资源的二级菜单
            (m) =>
              m?.pcode?.startsWith(app?.code) &&
              (m.sysResourcesList === null ||
                m.sysResourcesList === undefined ||
                m.sysResourcesList.length === 0)
          )
          .sort((a, b) => a.sort - b.sort)
      : [];
  }, [allResources, app]);
  //选中指定菜单的资源数量
  const appSelectedCount = useCallback(
    (_app: MenuVo): number => {
      const appMenuIds: string[] = menus(_app).map((d) => d.id);
      const appResources = allResources?.filter(
        (r) => r.sysMenuId && appMenuIds.includes(r.sysMenuId)
      );
      //资源选中数量
      const resourcesSelectedCount = appResources?.filter((r) =>
        selected.map((s) => s.sysResourcesId).includes(r.id)
      ).length;
      //菜单选中数量
      const menuSelectedCount = allMenu
        .filter((m) =>
          selected
            .filter((s) => s.sysMenuId)
            .map((s) => s.sysMenuId)
            .includes(m.id)
        )
        .filter((m) => m.code.startsWith(_app?.code)).length;
      return resourcesSelectedCount + menuSelectedCount;
    },
    [selected, allResources, allMenu, menus]
  );
  //查询指定菜单是否全选
  const checkAllSelectecd = useCallback(
    (menuId: string): "all" | "part" | "empty" => {
      const _menuResources: SysResources[] = allResources.filter(
        (r) => r.sysMenuId === menuId && r.menuRequired !== true
      );

      const size = selected.filter(
        (s) =>
          s.sysResourcesId &&
          _menuResources.map((m) => m.id).includes(s.sysResourcesId)
      ).length;
      return size === _menuResources.length
        ? "all"
        : size > 0
        ? "part"
        : "empty";
    },
    [selected, allResources]
  );

  return (
    <div className={`${className} flex `}>
      {/* 应用 */}
      <div className=" w-28">
        {allMenu
          ?.filter((itema) => itema.app)
          .map((item, index) => {
            return (
              <div
                key={item.id}
                onClick={() => {
                  setApp(item);
                }}
                className={`flex justify-center  items-center hover:cursor-pointer h-10 ${classNames(
                  {
                    " bg-gray-100 border-blue-500 font-bold  border-r-2":
                      item.id === app?.id,
                    " bg-gray-50 border-r-2 border-blue-200":
                      item.id !== app?.id,
                  }
                )}`}
              >
                {item.icon && (
                  <>
                    <SelectIcon read value={item.icon} />
                    &nbsp;&nbsp;
                  </>
                )}
                {item.name}({appSelectedCount(item)})
              </div>
            );
          })}
      </div>
      {/* 资源绑定 */}
      {app && (
        <div className=" flex  flex-col flex-1 ">
          {noAuthMenus?.length > 0 && (
            <div className="flex border-b border-t  border-blue-100">
              <div className="bg-gray-50 p-4 w-32 h-full items-center flex justify-center  border-r-2 border-blue-100">
                菜单权限
              </div>
              <div className="flex flex-1  items-center flex-wrap bg-white">
                {noAuthMenus.map((r, index) => {
                  return (
                    <div key={r.id}>
                      <Checkbox
                        className="flex space-x-3 px-3 "
                        key={r.id}
                        value={r.id}
                        checked={selected
                          ?.filter((s) => s.sysMenuId !== null)
                          ?.map((s) => s.sysMenuId)
                          .includes(r.id)}
                        onChange={(v) => {
                          const exists = selected.find(
                            (s) => s.sysMenuId === r.id
                          );
                          if (!exists) {
                            setSelected((_selected) => [
                              ..._selected,
                              { sysMenuId: r.id },
                            ]);
                          } else {
                            setSelected((_selected) =>
                              _selected.filter((s) => s.sysMenuId !== r.id)
                            );
                          }
                        }}
                      >
                        {r.name}
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* <div className="h-10  font-bold flex">
            <div className="bg-gray-100 w-32 h-full items-center flex justify-center">
              菜单权限
            </div>
          </div> */}
          {menus(app)?.map((item, index) => {
            return (
              <div
                key={item.id}
                className="flex  border-b  border-blue-100  w-full  bg-gray-50 "
              >
                {/* 菜单 */}
                <div
                  onClick={() => {
                    const _selectedFlag = checkAllSelectecd(item.id);
                    //可选的资源
                    const _menuResources = allResources.filter(
                      (r) => r.sysMenuId === item.id
                    );
                    if (_selectedFlag === "all") {
                      setSelected((_selected) =>
                        _selected.filter(
                          (s) =>
                            s.sysMenuId ||
                            (s.sysResourcesId &&
                              !_menuResources
                                .map((resources) => resources.id)
                                .includes(s.sysResourcesId))
                        )
                      );
                    } else {
                      setSelected((_selected) => {
                        return [
                          ..._selected,
                          ..._menuResources
                            .filter(
                              (r) =>
                                !_selected
                                  .map((s) => s.sysResourcesId)
                                  .includes(r.id)
                            )
                            .map((r) => ({ sysResourcesId: r.id })),
                        ];
                      });
                    }
                  }}
                  className={`w-32 items-center hover:cursor-pointer  border-r-2 border-blue-100  p-4   ${classNames(
                    {
                      "font-bold": checkAllSelectecd(item.id) !== "empty",
                    }
                  )}`}
                >
                  <span className=" mr-2 text-blue-600 text-xl">
                    {checkAllSelectecd(item.id) === "all" && (
                      <i className=" icon-fact_check_black" />
                    )}
                    {checkAllSelectecd(item.id) === "empty" && (
                      <i className=" icon-check_box" />
                    )}
                    {checkAllSelectecd(item.id) === "part" && (
                      <i className=" icon-indeterminate_check_box" />
                    )}
                  </span>
                  <span>{item.name}</span>
                </div>
                {/* 资源 */}
                <div className="flex flex-1  items-center flex-wrap bg-white ">
                  {allResources
                    .filter(
                      (r) => r.sysMenuId === item.id && r.menuRequired !== true
                    )
                    .sort((a, b) => a.actionType.localeCompare(b.actionType))
                    .map((r) => {
                      return (
                        <Checkbox
                          className="flex space-x-3 px-3 "
                          key={r.id}
                          value={r.id}
                          checked={
                            selected &&
                            selected.map((s) => s.sysResourcesId).includes(r.id)
                          }
                          onChange={(v) => {
                            const exist = selected.find(
                              (s) => s.sysResourcesId === r.id
                            );
                            if (!exist) {
                              setSelected((_selected) => [
                                ..._selected,
                                { sysResourcesId: r.id },
                              ]);
                            } else {
                              setSelected((_selected) =>
                                _selected.filter(
                                  (s) => s.sysResourcesId !== r.id
                                )
                              );
                            }
                          }}
                        >
                          {r.name}
                        </Checkbox>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
