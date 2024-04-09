import React from "react";
import { VfBaseProps } from "@src/dsl/component";
import { NodeUserInfo } from "@src/workflow-editor/classes/vlife";
import MemberSelect from "@src/workflow-editor/components/MemberSelect";
interface UserSelectProps extends VfBaseProps<string> {
  multiple?: boolean; //能否多选
}
/**
 * 用户选择器
 * 根据部门/角色进行筛选
 */
export default ({
  value,
  multiple = true,
  read,
  onDataChange,
}: UserSelectProps) => {
  return (
    <>
      <MemberSelect
        read={read}
        multiple={false}
        value={(value && [{ objectId: value, userType: "assignee" }]) || []}
        onDataChange={(datas?: Partial<NodeUserInfo>[]) => {
          onDataChange(
            datas
              ?.filter((i) => i.objectId)
              .map((i) => i.objectId as string)?.[0]
          );
        }}
        showUser={true}
      />
    </>
  );
};
