import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IdBean } from "@src/api/base";
import {
  BtnToolBarPosition,
  btnType,
  VFBtn,
} from "@src/components/button/types";

import Button from "@src/components/button";
import { Dropdown, SplitButtonGroup, Switch } from "@douyinfe/semi-ui";
/**
 * 显示场景
 * tableToolbar:列表工具栏|(可新增和支持多数据操作型按钮)
 * tableLine:列表行 (对单条数据操作，有模型和直接操作api)
 * formFooter:表单底部 (单条数据操作，只能对有(model)模型的进行操作)
 * page:  默认场景：不做任何按钮筛选
 */
/**
 * 区块按钮组定义
 */
export interface BtnToolBarProps<T extends IdBean> {
  btnType?: btnType;
  className?: string;
  dropdown?: boolean; //是否下拉
  btns: VFBtn[]; //按钮对象
  formModel?: string; //传入，则会对btns根据model进行过滤
  datas?: T[]; //操作的数据
  position?: BtnToolBarPosition; //显示场景(过滤出满足条件的按钮)
  line?: number; //行号 tableLine模式下使用 临时数据可用行号当索引进行操作
  readPretty?: boolean; //当前页面模式(过滤按钮使用)
  // onDataChange?: (datas: any[]) => void; //数据修订好传输出去
  onBtnNum?: (num: number) => void; //当前按钮数量
}

/**
 * 按钮栏组件
 * --------------------------
 * 1. 根据场景筛选按钮
 * 2. 判断按钮可用性(权限、数据规则)
 * 3. 按钮触发动作执行
 */
export default <T extends IdBean>({
  datas,
  btns,
  btnType = "button",
  className,
  formModel,
  readPretty,
  line,
  dropdown = false,
  // onDataChange,
  position = "page", //默认场景
  onBtnNum,
  ...props
}: BtnToolBarProps<T>) => {
  const [btnDatas, setBtnDatas] = useState<T[] | undefined>(datas); //当前操作的数据
  const [currBtns, setCurrBtns] = useState<VFBtn[]>([]); //当前页面应该显示的按钮
  useEffect(() => {
    setBtnDatas(datas);
  }, [datas]);
  //返回按钮数量
  useEffect(() => {
    onBtnNum && onBtnNum(currBtns.length);
  }, [currBtns]);

  //筛选出应该在当前场景下可以使用的按钮
  useEffect(() => {
    const btnFilter = async () => {
      let toolBarBtns: VFBtn[] = [];
      if (position === "tableToolbar") {
        toolBarBtns = btns.filter(
          (b) =>
            b.multiple === true ||
            b.position === "tableToolbar" ||
            b.actionType === "create" ||
            b.actionType === "save"
        );
      } else if (position === "tableLine") {
        toolBarBtns = btns.filter(
          (b) =>
            (b.actionType !== "create" && b.multiple !== true) ||
            b.position === "tableLine"
        );
      } else if (position === "formFooter") {
        if (btnDatas === undefined || btnDatas?.[0]?.id === undefined) {
          //模型数据为空
          toolBarBtns = btns.filter(
            (b) =>
              (b.actionType === "create" || b.actionType === "save") &&
              (formModel ? b.model === formModel : true)
          );
        } else {
          toolBarBtns = btns.filter(
            (b) =>
              b.saveApi !== undefined &&
              (b.multiple === false || b.multiple === undefined)
          );
        }
      } else {
        //position=page
        toolBarBtns = btns;
      }
      const filteredBtns = toolBarBtns
        .filter((btn) => (formModel ? btn.model === formModel : true)) //模型过滤
        .filter((btn) => (readPretty ? btn.actionType === "api" : true)); //只读过滤

      setCurrBtns((d) => filteredBtns);
    };
    btnFilter();
  }, [position, btns, btnDatas, formModel, readPretty]);

  return (
    <div
      className={`flex ${className} !items-center ${classNames({
        "justify-center": position !== "formFooter",
        "justify-end": position === "formFooter",
      })} space-x-1`}
    >
      {dropdown !== true ? (
        currBtns.map((btn, index) => {
          return (
            <Button
              {...btn}
              btnType={
                btnType !== undefined && btn.btnType === undefined
                  ? btnType
                  : btn.btnType
              }
              position={
                position !== undefined && btn.position === undefined
                  ? position
                  : btn.position
              }
              datas={
                btn.actionType === "create" ||
                (btn.actionType === "save" && position === "tableToolbar")
                  ? btn.initData //新增类型按钮使用initData
                  : btn.datas || btnDatas
              }
              onDataChange={(d) => {
                // setBtnDatas(d);
              }}
              key={`btn_${line}_${index}`}
            />
          );
        })
      ) : (
        <Dropdown
          trigger={"click"}
          position={"bottom"}
          clickToHide={true}
          render={
            <div className=" flex-col p-2 space-y-1">
              {currBtns.map((btn, index) => {
                return (
                  <div key={`div_${line}_${index}`} className="">
                    <Button
                      {...btn}
                      position={"dropdown"}
                      datas={
                        btn.actionType === "create" ||
                        (btn.actionType === "save" &&
                          position === "tableToolbar")
                          ? []
                          : btn.datas || btnDatas
                      }
                      key={`btn_${line}_${index}`}
                      onDataChange={(d) => {
                        // setBtnDatas(d);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          }
        >
          <i className=" icon-more_vert hover:bg-gray-200 p-1 rounded-md" />
        </Dropdown>
      )}
    </div>
  );
};
