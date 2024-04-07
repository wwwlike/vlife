//带描述的Switch的card形式的组件

import { Checkbox, Switch } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/component";
import classNames from "classnames";
import { ReactNode } from "react";
import SelectIcon from "../SelectIcon";

export interface SwitchCardProps extends VfBaseProps<boolean> {
  divider?: boolean; //分割线
  icon?: string; //图标
  iconNode?: ReactNode; //图标组件
  title: string; //标题
  placeholder?: string; //描述
  component?: "switch" | "checkbox"; //具体组件
}
export default (props: SwitchCardProps) => {
  const {
    divider,
    icon,
    iconNode,
    title,
    placeholder,
    value,
    onDataChange,
    component = "switch",
    ...rest
  } = props;
  return (
    <div className=" w-full flex  items-center    ">
      <div className="w-10 pt-2">
        {iconNode && iconNode}
        {!iconNode && icon && <SelectIcon value={icon} read></SelectIcon>}
        {iconNode === undefined && icon === undefined && (
          <i className=" text-3xl icon-supervised_user_circle" />
        )}
      </div>
      <div
        className={` flex-1 pt-2  ${classNames({
          "border-t": divider,
        })}`}
      >
        <div className="flex justify-between">
          <span className="block font-bold justify-start">{title}</span>

          {component === "switch" && (
            <Switch
              className="justify-end"
              checked={value}
              onChange={onDataChange}
            />
          )}
          {component === "checkbox" && (
            <Checkbox
              className="justify-end"
              checked={value}
              onChange={(e) => {
                onDataChange(e.target.checked ? true : false);
              }}
            />
          )}
        </div>
        <div className="font-thin text-gray-400">{placeholder}</div>
      </div>
      {/* */}
    </div>
  );
};
