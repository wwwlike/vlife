import { ToolFilled } from "@ant-design/icons";
import { Avatar, Checkbox, Tooltip } from "@douyinfe/semi-ui";
import { AvatarColor } from "@douyinfe/semi-ui/lib/es/avatar";
import { ISelect, ITreeData, VfBaseProps } from "@src/dsl/component";

/**
 * 级联多选组件
 */
export interface MultipleTreeSelectProps extends VfBaseProps<string[]> {
  label?: string; // 标签
  tooltip?: string; // 提示信息
  selectData: ISelect[];
}
const color = [
  "blue",
  "cyan",
  "green",
  "grey",
  "indigo",
  "light-blue",
  "light-green",
  "lime",
  "amber",
  "orange",
  "pink",
  "purple",
  "red",
  "teal",
  "violet",
  "yellow",
];
export default (props: MultipleTreeSelectProps) => {
  const { label, selectData, className, tooltip, value, onDataChange } = props;
  return (
    <div className={`${className}`}>
      <div className="font-bold flex justify-between pb-1">
        <div className="items-start">
          全选
          {tooltip && (
            <Tooltip content={tooltip}>
              <i className=" icon-help_outline" />
            </Tooltip>
          )}
        </div>
        <div className="items-end  pr-2">
          {/* <input
            type={"checkbox"}
            className="rounded-full h-4 w-4 border-2 border-gray-400 checked:bg-blue-500 checked:border-transparent"
            checked={value?.length === selectData.length}
            onClick={() => {
              if (value?.length === selectData.length) {
                onDataChange([]);
              } else {
                onDataChange(selectData.map((item) => item.value));
              }
            }}
          /> */}

          <Checkbox
            // value={item.value}
            checked={value?.length === selectData.length}
            onChange={() => {
              if (value?.length === selectData.length) {
                onDataChange([]);
              } else {
                onDataChange(selectData.map((item) => item.value));
              }
            }}
          />
        </div>
      </div>
      <>
        {selectData.map((item, index) => {
          return (
            <div
              key={`${index}`}
              onClick={() => {
                if (value?.includes(item.value)) {
                  onDataChange(value.filter((f) => f !== item.value));
                } else {
                  onDataChange([...(value ? value : []), item.value]);
                }
              }}
              className="flex justify-between cursor-pointer  hover:bg-slate-100 rounded"
            >
              <div className="items-start ">
                <Avatar
                  color={color[index] as AvatarColor}
                  className=" relative"
                  size="extra-small"
                  style={{ margin: 4 }}
                  alt="User"
                >
                  {item.label?.substring(0, 1)}
                </Avatar>
                <span className=" ml-2">{item.label}</span>
              </div>
              <div className="pr-2 flex items-center  justify-center">
                <Checkbox
                  value={item.value}
                  checked={value?.includes(item.value)}
                  onChange={() => {
                    if (value?.includes(item.value)) {
                      onDataChange(value.filter((f) => f !== item.value));
                    } else {
                      onDataChange([...(value ? value : []), item.value]);
                    }
                  }}
                />
                {/* <input
                  type="checkbox"
                  // defaultChecked
                  value={item.value}
                  checked={value?.includes(item.value)}
                  onChange={() => {
                    if (value?.includes(item.value)) {
                      onDataChange(value.filter((f) => f !== item.value));
                    } else {
                      onDataChange([...(value ? value : []), item.value]);
                    }
                  }}
                  className="rounded-full h-4 w-4 border-2 border-gray-400 checked:bg-blue-500 checked:border-transparent"
                /> */}
              </div>
            </div>
          );
        })}
      </>
    </div>
  );
};
