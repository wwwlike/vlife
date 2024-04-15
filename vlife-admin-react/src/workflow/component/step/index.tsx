import { Modal, Timeline } from "@douyinfe/semi-ui";
import { FlowNode } from "@src/api/workflow/Flow";

import FlowStep from "./FlowStep";
export default ({ historys }: { historys: FlowNode[] }) => {
  return (
    <Timeline>
      {historys?.map((h, index) => {
        return (
          <Timeline.Item
            type="success"
            className=" !pb-0"
            // time={}
            key={`step_${index}`}
          >
            <FlowStep {...h}></FlowStep>
          </Timeline.Item>
        );
      })}
      <div
        className=" flex justify-center items-center cursor-pointer"
        onClick={() => {
          Modal.info({
            title: "流程图",
            content: <div>稍后开放</div>,
          });
        }}
      >
        <i className=" text-2xl icon-workflow_webhook mr-2" />
        <span>查看流程图</span>
      </div>
    </Timeline>
  );
};
