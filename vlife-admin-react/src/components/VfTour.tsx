/**
 * 使用步骤引导组件封装
 * 1. 先记录是否引导内容到localStroge里（后期记录到数据库），避免每次提醒
 * 2. 一个包裹组件，定义
 */
import React, { useEffect, useState } from "react";
import Tour, { ReactourStep } from "reactour";
interface VfTourProps {
  code: string; //当前提醒的版本；修订他则重新提醒
  children: any;
  every?: boolean; //是否
  steps: ReactourStep[]; //{ selector: string; content: any }[];
}
const VfTour = ({
  steps,
  code,
  every = false,
  children,
  ...props
}: VfTourProps) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(`tour${code}`) === null || every) {
      setTimeout(() => {
        setOpen(true);
      }, 1000);
      localStorage.setItem(`tour${code}`, "tour");
    }
  }, []);
  return (
    <>
      {children}
      <Tour
        // maskSpace={200}
        // showButtons={false}
        showNavigationNumber={false}
        // showNavigation={false}
        steps={steps}
        isOpen={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
export default VfTour;
