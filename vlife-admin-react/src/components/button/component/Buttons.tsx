import React, { ReactNode, useEffect, useMemo } from "react";
import classNames from "classnames";
import { IdBean } from "@src/api/base";
import {
  BtnToolBarPosition,
  btnType,
  VFBtn,
} from "@src/components/button/types";
import Button from "@src/components/button";
import { Dropdown } from "@douyinfe/semi-ui";
import { useAuth } from "@src/context/auth-context";
import { _saveFunc } from "./buttonFuns";
import { usableDatasMatch } from "@src/components/queryBuilder/funs";
// import * as Icons from '@ant-design/icons';
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
  entity?: string; //实体类型
  btns: VFBtn[]; //按钮信息集合
  btnType?: btnType; //按钮展现形式
  className?: string;
  dropdown?: boolean | ReactNode; //是否下拉类型按钮组|ReactNode表示下拉图标
  dataType?: string; //传入，则会对btns根据model进行过滤,显示单一模型的按钮
  datas?: T[]; //操作的数据
  position?: BtnToolBarPosition; //显示场景(过滤出满足条件的按钮)
  line?: number; //行号 tableLine模式下使用 临时数据可用行号当索引进行操作
  readPretty?: boolean; //true 则只使用api的按钮
  activeKey?: string; //当前场景
  btnConf?: boolean; //按钮是否可配置
  onDataChange?: (...datas: T[]) => void; //数据修订好传输出去
  onBtnNum?: (num: number) => void; //当前按钮数量
  onActiveChange?: (key: string) => void; //当前场景切换
}

/**
 * 动态资源按钮组
 */
export default <T extends IdBean>({
  datas,
  btns,
  btnType = "button",
  className,
  dataType,
  entity,
  readPretty,
  line,
  dropdown = false,
  activeKey,
  btnConf = true,
  onDataChange,
  position = "page", //默认场景
  onBtnNum,
  onActiveChange,
}: BtnToolBarProps<T>) => {
  //接口资源
  const { resources, allButtons } = useAuth();

  //数据库按钮对象 {key:button}
  const customButtons = useMemo(() => {
    const result = allButtons.reduce<{ [key: string]: object }>((acc, item) => {
      acc[item.code] = item; // 将 item.value 存入以 item.code 为键的属性中
      return acc;
    }, {});
    return result;
  }, [allButtons]);

  //db按钮数据转换
  const _btns = useMemo((): VFBtn[] => {
    //有一个资源id表示当前是配置的按钮则需要进行转换
    return btns.map((b) => {
      if (b.sysResourcesId) {
        const _resources = resources[b.sysResourcesId || ""];
        const _model =
          _resources.paramType === "entity" || _resources.paramType === "dto"
            ? _resources.paramWrapper
            : undefined;
        const _multiple =
          _resources.paramWrapper.includes("List") ||
          _resources.paramWrapper.includes("[]");
        const _usableMatch = (_data: any) => {
          return b.conditionJson
            ? usableDatasMatch(JSON.parse(b.conditionJson), _data)
            : true;
        };
        const _actionType = _model ? "save" : "api";
        return {
          ...b,
          saveApi: _saveFunc(_resources),
          // permissionCode: _resources.url.replaceAll("/", ":"),
          permissionCode: _resources.code,
          actionType: _actionType,
          model: _model,
          // icon: <Icon />,
          title:
            b.title ||
            (_actionType === "api"
              ? _resources.methedType.startsWith("@DeleteMapping(")
                ? "删除"
                : _resources.name
              : "savecreate".includes(_actionType)
              ? b.position === "tableLine"
                ? "修改"
                : "新增"
              : ""),
          usableMatch: _usableMatch,
          multiple: _multiple,
        };
      } else if (b.code && customButtons[b.code]) {
        // 手写按钮与数据库按钮合并
        return { ...customButtons[b.code], ...b };
      } else {
        //手写按钮
        return b;
      }
    });
  }, [btns, customButtons]);

  //筛选出应该在当前场景下可以使用的按钮
  const currBtns = useMemo(() => {
    let toolBarBtns: VFBtn[] = [];
    if (position === "tableToolbar") {
      toolBarBtns = _btns.filter(
        (b) =>
          b.actionType !== "flow" &&
          (b.multiple === true ||
            b.position === "tableToolbar" ||
            b.actionType === "create" ||
            b.actionType === "save" ||
            (b.actionType === "edit" && b.allowEmpty === true))
      );
    } else if (position === "tableLine") {
      toolBarBtns = _btns.filter(
        (b) =>
          (b.actionType !== "create" && b.multiple !== true) ||
          b.position === "tableLine"
      );
    } else if (position === "formFooter") {
      if (datas === undefined || datas?.[0]?.id === undefined) {
        //模型数据为空
        toolBarBtns = _btns.filter(
          (b) =>
            (b.actionType === "create" ||
              b.actionType === "save" ||
              b.actionType === "flow" ||
              (b.actionType === "edit" && b.multiple)) && //多数据局编辑id可以为空
            (dataType
              ? b.model?.toLocaleLowerCase() === dataType.toLocaleLowerCase()
              : true)
        );
      } else {
        toolBarBtns = _btns.filter(
          (b) =>
            (b.sysResourcesId || b.saveApi !== undefined) &&
            (b.multiple === false || b.multiple === undefined)
        );
      }
    } else {
      //position=page
      toolBarBtns = _btns;
    }
    toolBarBtns = toolBarBtns
      //场景过滤
      .filter((btn) =>
        position
          ? btn.position === position ||
            btn.position === undefined ||
            btn.position === null
          : true
      )
      //模型过滤 datas的数据类型和模型的数据类型一致(屏蔽)
      // .filter((btn) =>
      //   dataType && btn.model && datas && datas.length > 0
      //     ? btn.model.toLocaleLowerCase() === dataType.toLocaleLowerCase() ||
      //       btn.loadApi !== undefined
      //     : true
      // )
      //只读过滤
      .filter((btn) => (readPretty ? btn.actionType === "api" : true))
      //tab场景签过滤
      .filter(
        (btn) =>
          !btn.activeTabKey ||
          (activeKey &&
            btn.activeTabKey &&
            btn.activeTabKey.includes(activeKey))
      );
    return toolBarBtns;
  }, [position, _btns, dataType, readPretty, datas]);

  //返回按钮数量
  useEffect(() => {
    onBtnNum && onBtnNum(currBtns.length);
  }, [currBtns]);

  return dropdown === false ? (
    <div
      className={`flex ${className} !items-center ${classNames({
        "justify-start": position !== "formFooter",
        "justify-end": position === "formFooter",
      })} space-x-1`}
    >
      {currBtns.map((btn, index) => {
        return (
          <Button
            groupIndex={index}
            groupTotal={currBtns.length}
            key={`btn_${line}_${index}`}
            {...btn}
            activeKey={activeKey}
            btnType={
              btnType !== undefined &&
              (btn.btnType === undefined || btn.btnType === null)
                ? btnType
                : btn.btnType
            }
            onActiveChange={btn.onActiveChange || onActiveChange}
            position={
              position !== undefined && btn.position === undefined
                ? position
                : btn.position
            }
            datas={
              btn.datas || datas
              // btn.actionType === "create" ||
              // (btn.actionType === "save" && position === "tableToolbar")
              //   ? btn.initData //新增类型按钮使用initData
              //   : btn.datas || btnDatas
            }
            btnConf={btnConf} //btn.btnConf ||
            entity={btn.entity || entity}
            onSubmitFinish={btn.onSubmitFinish || onDataChange}
            otherBtns={btns.filter(
              //排除掉当前按钮
              (b) =>
                !(
                  b.title === btn.title &&
                  b.actionType === btn.actionType &&
                  b.btnType === btn.btnType
                )
            )}
          />
        );
      })}
    </div>
  ) : (
    <div className={className}>
      <Dropdown
        trigger={"click"}
        position={"bottom"}
        clickToHide={true}
        render={
          <div className={` flex-col p-2 space-y-1  `}>
            {currBtns.map((btn, index) => {
              return (
                <div key={`div_${line}_${index}`}>
                  <Button
                    {...btn}
                    position={"dropdown"}
                    btnConf={btn.btnConf || btnConf}
                    datas={btn.datas || datas}
                    onActiveChange={btn.onActiveChange || onActiveChange}
                    onSubmitFinish={btn.onSubmitFinish || onDataChange}
                    otherBtns={
                      btn.actionType === "save" && btn.model ? currBtns : []
                    }
                    key={`btn_${line}_${index}`}
                  />
                </div>
              );
            })}
          </div>
        }
      >
        {dropdown === true ? (
          <i
            className="icon-more_vert hover:bg-gray-200 p-1 rounded-md"
            onClick={(event) => {
              event.cancelable = true; //阻止事件冒泡
              event.stopPropagation();
            }}
          />
        ) : (
          dropdown
        )}
      </Dropdown>
    </div>
  );
};
