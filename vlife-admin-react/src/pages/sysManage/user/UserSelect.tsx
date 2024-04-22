import React, { useEffect } from "react";
import { VfBaseProps } from "@src/dsl/component";
import { NodeUserInfo } from "@src/workflow-editor/classes/vlife";
import MemberSelect from "@src/workflow-editor/components/MemberSelect";
import { useAuth } from "@src/context/auth-context";
import { useUpdateEffect } from "ahooks";
interface UserSelectProps extends VfBaseProps<string> {
  defCurrUser?: boolean; //是否初始化用户为当前用户
}
/**
 * 用户选择器
 * 根据部门/角色进行筛选
 */
export default ({
  value,
  defCurrUser = false,
  read,
  onDataChange,
}: UserSelectProps) => {
  const { user } = useAuth();
  const [initValue, setInitValue] = React.useState<string | undefined>(
    defCurrUser && value === undefined ? user?.id : value
  );

  return (
    <MemberSelect
      read={read}
      multiple={false}
      value={
        initValue
          ? [{ objectId: value || initValue, userType: "assignee" }]
          : []
      }
      onDataChange={(datas?: Partial<NodeUserInfo>[]) => {
        setInitValue(
          datas?.filter((i) => i.objectId).map((i) => i.objectId as string)?.[0]
        );
        //仅需要id即可
        onDataChange(
          datas?.filter((i) => i.objectId).map((i) => i.objectId as string)?.[0]
        );
      }}
      showUser={true}
    />
  );
};
