//和流程相关的人员选择模块
import { TabPane, Tabs } from "@douyinfe/semi-ui";
import MultipleSelect from "@src/components/select/MultipleSelect";
import { ISelect, VfBaseProps } from "@src/dsl/component";
import { NodeUserInfo } from "@src/workflow-editor/classes/vlife";
import { useCallback, useEffect, useMemo, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import DynamicNodeSelect from "./DynamicNodeSelect";

export interface FlowSelectProps extends VfBaseProps<Partial<NodeUserInfo>[]> {
  showUser?: boolean; //仅使用用户
  multiple?: boolean; //是否能多选
  roleSelectData?: ISelect[];
  deptSelectData?: ISelect[];
  userSelectData?: ISelect[];
}

export default (props: FlowSelectProps) => {
  const {
    onDataChange,
    value,
    showUser = false,
    multiple = true,
    roleSelectData,
    deptSelectData,
    userSelectData,
  } = props;
  const [search, setSearch] = useState<string>(); //搜索的数据
  const [activeKey, setActiveKey] = useState<string>("assignee"); //当前页签

  //角色数据
  const roles = useMemo((): Partial<NodeUserInfo>[] => {
    return value?.filter((v) => v.userType === "role") || [];
  }, [value]);

  //用户数据
  const users = useMemo((): Partial<NodeUserInfo>[] => {
    return value?.filter((v) => v.userType === "assignee") || [];
  }, [value]);

  //dept数据
  const depts = useMemo((): Partial<NodeUserInfo>[] => {
    return value?.filter((v) => v.userType === "dept") || [];
  }, [value]);

  //动态节点数据
  const dynamics = useMemo((): Partial<NodeUserInfo>[] => {
    return value?.filter((v) => v.userType === "dynamic") || [];
  }, [value]);
  // const [dynamicFlowData, setDynamicFlowData] = useState<ISelect[]>(); //用户数据

  //选中或者取消一个节点
  const selectNode = useCallback(
    (selectDatas: ISelect[], type: string, ...ids: string[]) => {
      const vv = [
        ...(value?.filter((v) => v.userType !== type) || []),
        ...(ids?.map((v) => {
          return {
            userType: type,
            objectId: v,
            label: selectDatas.filter((s) => s.value === v)?.[0].label,
          };
        }) || []),
      ];
      onDataChange(vv);
    },
    [JSON.stringify(value), onDataChange]
  );

  return (
    <div className=" flex w-full h-full ">
      <Scrollbars autoHide={true} className="h-full w-full">
        <Tabs
          className="  mr-2 h-full "
          activeKey={activeKey}
          onTabClick={setActiveKey}
        >
          <TabPane tab="成员" itemKey="assignee">
            {userSelectData && (
              <MultipleSelect
                selectData={userSelectData || []}
                multiple={multiple}
                value={users.map((v) => v.objectId || "")}
                onDataChange={(vals?: string[]) => {
                  selectNode(userSelectData, "assignee", ...(vals || []));
                }}
              />
            )}
          </TabPane>

          {showUser === false && (
            <TabPane tab="部门" itemKey="dept">
              {deptSelectData && (
                <MultipleSelect
                  selectData={deptSelectData || []}
                  value={depts.map((v) => v.objectId || "")}
                  onDataChange={(vals?: string[]) => {
                    selectNode(deptSelectData, "dept", ...(vals || []));
                  }}
                />
              )}
            </TabPane>
          )}
          {showUser === false && (
            <TabPane tab="角色" itemKey="role">
              {roleSelectData && (
                <MultipleSelect
                  selectData={roleSelectData || []}
                  value={roles.map((v) => v.objectId || "")}
                  onDataChange={(vals?: string[]) => {
                    selectNode(roleSelectData, "role", ...(vals || []));
                  }}
                />
              )}
            </TabPane>
          )}
          {showUser === false && (
            <TabPane tab="动态" itemKey="dynamic">
              <DynamicNodeSelect
                value={dynamics}
                onDataChange={(data?: Partial<NodeUserInfo>[]) => {
                  onDataChange([
                    ...(value?.filter((v) => v.userType !== "dynamic") || []),
                    ...(data || []),
                  ]);
                }}
              />
            </TabPane>
          )}
        </Tabs>
      </Scrollbars>
      <div className=" border-l w-2/5">
        <div className=" flex justify-between">
          <div className=" item-start">
            <span className=" font-bold px-2">已选择</span>({value?.length || 0}
            )
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              onDataChange([]);
            }}
          >
            清空
          </div>
        </div>
        {/* 1. 成员已选择 */}
        {users && users.length > 0 && (
          <>
            <div className="pl-2 text-gray-400 font-bold">成员</div>
            <div className="flex flex-wrap">
              {users.map((user, index) => {
                return (
                  <div key={`${index}_role`} className="inline-flex p-1 ">
                    <div
                      onClick={() => {
                        onDataChange(
                          value?.filter((v) => v.objectId !== user.objectId)
                        );
                      }}
                      className="  text-sm bg-slate-200 hover:bg-slate-300 p-1 rounded font-thin cursor-pointer "
                    >
                      {user.label}
                      {(user.label === undefined || user.label === null) &&
                        user.userType === "assignee" &&
                        userSelectData &&
                        userSelectData.filter(
                          (data) => data.value === user.objectId
                        )?.[0]?.label}

                      <i className=" ml-1 icon-clear" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {/* 2. 部门已选择 */}
        {depts && depts.length > 0 && (
          <>
            <div className="pl-2 text-gray-400 font-bold">部门</div>
            <div className="flex flex-wrap">
              {/* {JSON.stringify(roles)} */}
              {depts.map((dept, index) => {
                return (
                  <div key={`${index}_role`} className="inline-flex p-1 ">
                    <div
                      onClick={() => {
                        onDataChange(
                          value?.filter((v) => v.objectId !== dept.objectId)
                        );
                      }}
                      className="  text-sm bg-slate-200 hover:bg-slate-300 p-1 rounded font-thin cursor-pointer "
                    >
                      {dept.label}
                      {(dept.label === undefined || dept.label === null) &&
                        dept.userType === "dept" &&
                        deptSelectData &&
                        deptSelectData.filter(
                          (data) => data.value === dept.objectId
                        )?.[0]?.label}

                      <i className=" ml-1 icon-clear" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {/* 3. 角色已选择 */}
        {roles && roles.length > 0 && (
          <>
            <div className="pl-2 text-gray-400 font-bold">角色</div>
            <div className="flex flex-wrap">
              {roles.map((role, index) => {
                return (
                  <div key={`${index}_role`} className="inline-flex p-1 ">
                    <div
                      onClick={() => {
                        onDataChange(
                          value?.filter((v) => v.objectId !== role.objectId)
                        );
                      }}
                      className=" text-sm bg-slate-200 hover:bg-slate-300 p-1 rounded font-thin cursor-pointer "
                    >
                      {role.label}
                      {(role.label === undefined || role.label === null) &&
                        role.userType === "role" &&
                        roleSelectData &&
                        roleSelectData.filter(
                          (data) => data.value === role.objectId
                        )?.[0]?.label}
                      <i className=" ml-1 icon-clear" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {dynamics && dynamics.length > 0 && (
          <>
            <div className="pl-2 text-gray-400 font-bold">动态</div>
            <div className="flex flex-wrap">
              {dynamics.map((dynamic, index) => {
                return (
                  <div key={`${index}_dynamic`} className="inline-flex p-1 ">
                    <div
                      onClick={() => {
                        onDataChange(
                          value?.filter((v) => v.objectId !== dynamic.objectId)
                        );
                      }}
                      className=" text-sm bg-slate-200 hover:bg-slate-300 p-1 rounded font-thin cursor-pointer "
                    >
                      {dynamic.label}
                      <i className=" ml-1 icon-clear" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
