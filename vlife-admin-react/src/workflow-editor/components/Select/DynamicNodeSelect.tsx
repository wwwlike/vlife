import SwitchCard from "@src/components/checkbox/SwitchCard";
import { VfBaseProps } from "@src/dsl/component";
import { NodeUserInfo } from "@src/workflow-editor/classes/vlife";
import { useCallback } from "react";
/**
 * 动态节点选择
 */
export interface DynamicNodeSelectProps
  extends VfBaseProps<Partial<NodeUserInfo>[]> {}
export default ({ onDataChange, className, value }: DynamicNodeSelectProps) => {
  const click = useCallback(
    (node: Partial<NodeUserInfo>, checked?: boolean) => {
      if (checked) {
        onDataChange([...(value || []), node]);
      } else {
        onDataChange(value?.filter((v) => v.objectId !== node.objectId));
      }
    },
    [onDataChange, value]
  );

  return (
    <div className={`${className}`}>
      <SwitchCard
        title={"申请人"}
        iconNode={
          <i className=" text-blue-400 text-3xl  icon-account_circle" />
        }
        value={value?.filter((v) => v.objectId === "sqr")?.length === 1}
        placeholder="可将申请人设置为节点负责人"
        component="checkbox"
        onDataChange={(data?: boolean | undefined) => {
          click(
            {
              objectId: "sqr",
              userType: "dynamic",
              label: "申请人",
            },
            data
          );
        }}
      />
    </div>
  );
};
