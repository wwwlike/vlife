import { Avatar, Modal, Tooltip } from "@douyinfe/semi-ui";
import { AvatarColor } from "@douyinfe/semi-ui/lib/es/avatar";
import { VfBaseProps } from "@src/dsl/component";
import { NodeUserInfo } from "@src/workflow-editor/classes/vlife";
import FlowSelect from "@src/workflow-editor/components/Select/FlowSelect";

import { useEffect, useState } from "react";
interface VfUserSelectProps extends VfBaseProps<Partial<NodeUserInfo>[]> {
  label?: string;
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
/**
 * 用户选择器
 * 根据部门/角色进行筛选
 */
export default ({ value, label, read, onDataChange }: VfUserSelectProps) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [modalState, setModalState] = useState(false); //模态窗口状态
  const [modalSelected, setModalSelected] = useState<Partial<NodeUserInfo>[]>(
    value || []
  ); //modal层选中的数据
  // const [confirmed, setConfirmed] = useState<NodeUserInfo[]>(); //点ok确认选中的数据

  useEffect(() => {
    setModalSelected(value || []);
  }, [value]);

  //首次数据加载
  return (
    <div>
      {/* {JSON.stringify(value)} */}
      <Modal
        height={windowSize.height / 2}
        title={`${label || "请"}选择`}
        visible={modalState}
        onOk={() => {
          setModalState(false);
          onDataChange?.(modalSelected);
        }}
        centered
        onCancel={() => {
          setModalState(false);
          setModalSelected(value || []);
        }}
        width={900}
      >
        <FlowSelect
          value={modalSelected}
          onDataChange={(d?: Partial<NodeUserInfo>[]) => {
            setModalSelected(d ? d : []);
          }}
        />
      </Modal>
      <div className=" flex items-center">
        {read !== true && (
          <i
            onClick={() => setModalState(true)}
            className=" cursor-pointer hover:text-orange-400 text-2xl icon-task-add-member-circle"
          />
        )}
        {value?.map((d, index) => {
          return (
            <div key={`${index}_selected`} className="relative group">
              <Tooltip content={d.label} position="bottom">
                <Avatar
                  color={color[index] as AvatarColor}
                  className=" relative"
                  size="extra-small"
                  style={{ margin: 4 }}
                  alt="User"
                >
                  {d?.label?.substring(0, 1)}
                </Avatar>
              </Tooltip>
              {read !== true && (
                <i
                  onClick={() => {
                    onDataChange?.(
                      value.filter((i) => i.objectId !== d.objectId)
                    );
                  }}
                  className="absolute cursor-pointer hover:text-red-400 -top-2 right-0 hidden group-hover:block  icon-closeelement-bg-circle"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
