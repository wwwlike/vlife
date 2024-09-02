/**
 * 支持流程节点信息展示的表单包裹容器
 */
import React, { ReactNode } from "react";
import { FlowNode } from "@src/api/workflow/Flow";
import Scrollbars from "react-custom-scrollbars";
import Step from "@src/workflow/component/step";
export interface FormContainerProps {
  children: ReactNode; //表单
  historys?: FlowNode[]; //审核历史信息
  className?: string;
}
export default (props: FormContainerProps) => {
  const { historys, className, children } = props;
  return (
    <div className={`${className} flex  h-full`}>
      <div className="flex-grow">{children}</div>
      {historys && historys.length > 0 && (
        <div className=" w-72 p-2   bg-gray-50 rounded-md ml-2">
          <Scrollbars autoHide={true} className="h-full">
            <Step historys={historys}></Step>
          </Scrollbars>
        </div>
      )}
    </div>
  );
};
