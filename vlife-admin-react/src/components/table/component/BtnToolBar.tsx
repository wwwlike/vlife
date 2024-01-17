import React, { ReactNode, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { Button, Dropdown, Tag, Tooltip, Typography } from "@douyinfe/semi-ui";
import { IdBean, Result } from "@src/api/base";
import { useAuth } from "@src/context/auth-context";
import { useNiceModal } from "@src/store";
import { objectIncludes } from "@src/util/func";
import { VFBtn } from "../types";
import { IconMore } from "@douyinfe/semi-icons";
/**
 * 显示场景
 * tableToolbar:列表工具栏|(可多多条数据操作，可新增)
 * tableLine:列表行 (对单条数据操作，有模型和直接操作api)
 * formFooter:表单底部 (单条数据操作，只能对有模型的进行操作)
 * page:  其他场景页面
 */
type BtnToolBarPosition = "tableToolbar" | "tableLine" | "formFooter" | "page";
/**
 * 区块按钮组定义
 */
export interface BtnToolBarProps<T extends IdBean> {
  btnType?: "button" | "link"; //按钮类型
  className?: string;
  dropdown?: boolean; //是否下拉
  btns: VFBtn[]; //按钮对象
  formModel?: string; //传入，则会对btns根据model进行过滤
  datas?: T[]; //操作的数据
  position?: BtnToolBarPosition; //显示场景(过滤出满足条件的按钮)
  line?: number; //行号 tableLine模式下使用 临时数据可用行号当索引进行操作
  readPretty?: boolean; //当前页面模式(过滤按钮使用)
  onDataChange?: (datas: any[]) => void; //数据修订好传输出去
  onBtnNum?: (num: number) => void; //当前按钮数量
}

/**
 * 按钮栏组件
 * --------------------------
 * 1. 根据数据对按钮显示隐藏控制
 * 2. 根据用户权限对按钮显示隐藏控制
 */
export default <T extends IdBean>({
  datas,
  btns,
  btnType = "button",
  className,
  formModel,
  readPretty,
  dropdown = false,
  onDataChange,
  position = "page",
  onBtnNum,
  ...props
}: BtnToolBarProps<T>) => {
  const { Text } = Typography;
  const { checkBtnPermission } = useAuth();
  const formModal = useNiceModal("formModal");
  const [loadbtn, setLoadbtn] = useState<string>(); //正在加载的按钮
  const [btnDatas, setBtnDatas] = useState<T[] | undefined>(datas); //当前操作的数据
  const confirmModal = useNiceModal("confirmModal");
  useEffect(() => {
    setBtnDatas(datas);
  }, [datas]);

  //数据提交
  const submit = useCallback(
    (vfBtn: VFBtn, saveApiObj: T[], index: number) => {
      // if(position==="line")

      const savaData = vfBtn.onSaveBefore
        ? vfBtn.onSaveBefore(vfBtn.multiple ? saveApiObj : saveApiObj[0])
        : vfBtn.multiple
        ? saveApiObj
        : saveApiObj[0];

      const save = (btn: VFBtn, saveApiFunc: any) => {
        setLoadbtn(`${position}btn${index}`);
        return saveApiFunc(savaData).then(
          (d: Result<any>) => {
            onDataChange && onDataChange([d.data]);
            setTimeout(() => {
              if (btn.submitClose) {
                formModal.hide();
              }
              if (btn.onSubmitFinish) {
                btn.onSubmitFinish(d.data);
              }
              setLoadbtn(undefined);
            }, 500);
          },
          (error: any) => {
            setTimeout(() => {
              setLoadbtn(undefined);
            }, 500);
          }
        );
      };
      if (vfBtn.saveApi && saveApiObj) {
        return vfBtn.onFormilySubmitCheck
          ? vfBtn.onFormilySubmitCheck().then((dLboolean) => {
              return save(vfBtn, vfBtn.saveApi);
            })
          : save(vfBtn, vfBtn.saveApi);
      } else if (vfBtn.onClick) {
        vfBtn.onClick(savaData);
      }
    },
    [position]
  );

  //按钮点击
  const btnClick = useCallback(
    (btn: VFBtn, index: number) => {
      if (position !== "formFooter" && btn.model) {
        //1 页面(非modal)的按钮有模型信息打开页面
        show(btn);
      } else if (btn.saveApi && btnDatas) {
        //2. 按钮触发接口调用
        if (btn.submitConfirm) {
          // 需确认;
          confirmModal.show({
            title: `确认${btn.title}${
              btnDatas?.length === 1 ? "该" : btnDatas.length
            }条记录?`,
            saveFun: () => {
              return submit(btn, btnDatas, index).then((d: any) => {});
            },
          });
          // .then((data: any) => {
          //   confirmModal.hide();
          // });
        } else {
          submit(btn, btnDatas, index).then((d: any) => {});
        }
      } else if (btn.onClick) {
        if (btn.multiple || btnDatas === undefined) {
          btn.onClick(btnDatas);
        } else {
          btn.onClick(btnDatas[0]);
        }
      }
    },
    [btnDatas, btns, position]
  );

  // 按钮名称计算
  const btnTitle = useCallback(
    (btn: VFBtn): string | ReactNode => {
      if (typeof btn.title === "string") {
        if (position === "formFooter") {
          if (
            btn.actionType == "save" ||
            btn.actionType == "create" ||
            btn.actionType === "edit"
          ) {
            return "保存";
          }
        } else if (position === "tableToolbar") {
          if (btn.actionType === "save" || btn.actionType === "create") {
            if (!btn.title.startsWith("新增")) {
              if (btn.title === "") {
                return "新增";
              } else {
                return "新增" + btn.title;
              }
            }
          }
        } else if (position === "tableLine") {
          if (btn.actionType === "save") {
            if (btn.title !== "修改") {
              if (btn.title === "") {
                return "修改";
              } else {
                return "修改" + btn.title;
              }
            }
          }
        }
      }
      return btn.title;
    },
    [position]
  );

  //弹出(划出待实现)
  const show = useCallback(
    (btn: VFBtn) => {
      const modal = (data: any) => {
        formModal.show({
          type: btn.model,
          formData:
            btn.actionType === "create" ||
            (btn.actionType === "save" && position === "tableToolbar")
              ? {}
              : data,
          btns: [btn], //取消掉btns简化逻辑，弹出层值显示一个按钮
          terse: !btn.saveApi ? true : false, //紧凑
          fontBold: !btn.saveApi ? true : false, //加粗
          readPretty: btn.actionType === "api" || !btn.saveApi ? true : false,
          onDataChange(d: any) {
            setBtnDatas([d]);
          },
          reaction: btn.reaction,
        });
      };
      if (
        btn.actionType === "create" ||
        (btn.actionType === "save" && position === "tableToolbar")
      ) {
        modal([]);
      } else if (btn.loadApi === undefined) {
        modal(btnDatas?.[0] || btn.initData || {});
      } else if (btnDatas) {
        btn.loadApi(btnDatas[0]).then((d) => {
          modal(d.data);
        });
      }
    },
    [btnDatas, btns, props]
  );

  //1权限检查
  const permissionCheck = useCallback((btn: VFBtn) => {
    return (
      (btn.permissionCode && checkBtnPermission(btn.permissionCode)) ||
      btn.permissionCode === undefined
    );
  }, []);

  //可用性比对检查 false&&string不可用， true可用
  const btnUsableMatch = useCallback(
    (btn: VFBtn): boolean | string | Promise<boolean | string> => {
      //布尔值匹配
      if (
        (btn.actionType === "create" && btn.usableMatch === undefined) ||
        (btn.actionType === "save" && position === "tableToolbar")
      ) {
        return true;
      } else if (typeof btn.usableMatch === "boolean") {
        return btn.usableMatch;
      } else if (typeof btn.usableMatch === "string") {
        return btn.usableMatch;
      } else if (btn.usableMatch instanceof Promise<boolean | string>) {
        //异步函数转同步返回
        const result = btn.usableMatch;
        return result;
      } else if (typeof btn.usableMatch === "object") {
        if (datas === undefined || datas.length === 0) {
          return false;
        }
        //属性值匹配
        return (
          //所有数据都满足
          btnDatas?.filter((a: any) => objectIncludes(a, btn.usableMatch))
            .length === btnDatas?.length
        );
      } else if (typeof btn.usableMatch === "function") {
        //同步函数
        return btn.usableMatch(
          position === "tableToolbar"
            ? btnDatas || []
            : btnDatas
            ? btnDatas[0]
            : undefined
        );
      } else if (btnDatas === undefined || btnDatas?.length === 0) {
        //1 没有选中数据，非创建类按钮不可用
        return false;
      } else if (btn.usableMatch === undefined) {
        return true;
      }
      return true;
    },
    [btnDatas, position]
  );
  //当前页面应该显示的按钮
  const [currBtns, setCurrBtns] = useState<VFBtn[]>([]);
  //筛选出应该在当前场景下可以使用的按钮
  useEffect(() => {
    const fetchData = async () => {
      let toolBarBtns: VFBtn[] = [];
      //筛选当前场景应该显示的按钮
      if (position === "tableToolbar") {
        //列表工具栏 新增和操作多个数据的按钮
        toolBarBtns = btns.filter(
          (b) =>
            b.multiple === true ||
            b.actionType === "create" ||
            b.actionType === "save"
        );
      } else if (position === "tableLine") {
        //行按钮->排除新增和多个操作的按钮
        toolBarBtns = btns.filter(
          (b) => b.actionType !== "create" && b.multiple !== true
        );
      } else if (position === "formFooter") {
        //明细页按钮
        if (btnDatas === undefined || btnDatas?.[0]?.id === undefined) {
          //模型数据为空
          toolBarBtns = btns.filter(
            (b) =>
              (b.actionType === "create" || b.actionType === "save") &&
              (formModel ? b.model === formModel : true)
          );
        } else {
          //模型数据为空
          toolBarBtns = btns.filter(
            (b) =>
              b.actionType !== "create" &&
              b.saveApi !== undefined &&
              (b.multiple === false || b.multiple === undefined)
          );
        }
      } else {
        toolBarBtns = btns;
      }

      const filteredBtns = toolBarBtns
        .filter((btn) => (formModel ? btn.model === formModel : true)) //模型过滤
        .filter((btn) => (readPretty ? btn.actionType === "api" : true)) //只读过滤
        .filter((btn) => permissionCheck(btn)); //权限过滤

      const btnPromises = filteredBtns.map(async (btn, index) => {
        let tooltip = btnUsableMatch(btn);
        if (tooltip instanceof Promise) {
          // 取出异步的提示信息
          tooltip = await tooltip;
        }
        let disabled = typeof tooltip === "boolean" ? !tooltip : true; //是否可用
        return typeof tooltip === "string"
          ? { ...btn, tooltip, disabled: disabled }
          : { ...btn, disabled };
      });

      const results = await Promise.all(btnPromises);
      const filteredResults = results.filter((d) =>
        d.disabled && d.disabledHide ? false : true
      );
      setCurrBtns((d) => filteredResults);
    };

    fetchData();
  }, [position, btns, btnDatas, formModel, readPretty]);

  // //根据useableMatch属性判断产生按钮的disabled属性
  // useEffect(() => {
  //   positionBtns.forEach(async (btn, index) => {
  //     //每个按钮进行能否访问判断
  //     const tooltip = btnUsableMatch(btn);
  //     if (tooltip instanceof Promise) {
  //       const d = await tooltip; //异步返回的数据
  //       const disabled = typeof d === "boolean" ? !d : true;
  //       setCurrBtns((cbtns) => {
  //         const newCurrBtns = (cbtns.length > 0 ? cbtns : positionBtns)
  //           .map((currBtn, i) => {
  //             if (i === index) {
  //               return typeof d === "string"
  //                 ? { ...btn, tooltip: d, disabled: disabled }
  //                 : { ...btn, disabled };
  //             } else {
  //               return currBtn;
  //             }
  //           })
  //           .filter((d) => (d.disabled && d.disabledHide ? false : true));
  //         return newCurrBtns;
  //       });
  //     } else {
  //       console.log("1111111111");
  //       const disabled = typeof tooltip === "boolean" ? !tooltip : true;
  //       setCurrBtns((cbtns) => {
  //         const newCurrBtns = (cbtns.length > 0 ? cbtns : positionBtns)
  //           .map((currBtn, i) => {
  //             if (i === index) {
  //               return typeof tooltip === "string"
  //                 ? { ...btn, tooltip, disabled: disabled }
  //                 : { ...btn, disabled };
  //             } else {
  //               return currBtn;
  //             }
  //           })
  //           .filter((d) => (d.disabled && d.disabledHide ? false : true));
  //         return newCurrBtns;
  //       });
  //     }
  //   });
  // }, [positionBtns, setCurrBtns, currBtns]);

  useEffect(() => {
    //返回按钮数量
    onBtnNum && onBtnNum(currBtns.length);
  }, [currBtns]);

  return dropdown === false ? (
    <div className={` ${className} space-x-1`}>
      {currBtns.map((btn, index) => {
        if (
          position !== "formFooter" &&
          (btn.onlyIcon === true || btn.onlyIcon?.includes(position))
        ) {
          return (
            <div
              key={`icon${index}`}
              onClick={() => {
                if (!btn.disabled) {
                  btnClick(btn, index);
                }
              }}
            >
              {btn.title ? (
                <Tooltip content={btn.title}>{btn.icon}</Tooltip>
              ) : (
                <>{btn.icon}</>
              )}
            </div>
          );
        } else {
          const Btn: any = btnType === "button" ? Button : Text;
          const key = `${position}btn${index}`;
          const BtnComp = (
            <Btn
              onClick={() => {
                if (!btn.disabled) {
                  btnClick(btn, index);
                }
              }}
              loading={loadbtn && loadbtn === key}
              theme={`${
                (btn.actionType === "edit" ||
                  btn.actionType === "create" ||
                  btn.actionType === "save") &&
                position === "formFooter"
                  ? "solid"
                  : "light"
              }`}
              className={`hover:cursor-pointer  ${classNames({
                "cursor-pointer hover:text-blue-600 hover:font-bold":
                  position === "tableLine",
              })} ${btn.className}`}
              key={key}
              icon={btnType === "link" ? undefined : btn.icon}
              disabled={btn.disabled}
            >
              <span className=" space-x-2 items-center">
                {/* {btn.icon} */}
                {btnTitle(btn)}
              </span>
            </Btn>
          );
          return (
            <span key={`${position}btn${index}`}>
              {btn.tooltip ? (
                <Tooltip content={btn.tooltip}>{BtnComp}</Tooltip>
              ) : (
                BtnComp
              )}
            </span>
          );
        }
      })}
    </div>
  ) : (
    <div className={`${className}`}>
      <Dropdown
        trigger={"click"}
        position={"bottom"}
        clickToHide={true}
        render={
          <Dropdown.Menu>
            {currBtns.map((btn, index) => {
              return (
                <Dropdown.Item
                  key={`${position}btn${index}`}
                  className={` text-xs`}
                  onClick={() => {
                    if (!btn.disabled) {
                      btnClick(btn, index);
                    }
                  }}
                  icon={btn.icon}
                >
                  {btnTitle(btn)}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        }
      >
        {/* <Tag className=" hidden w-4 text-xl "> */}
        {/* 默认图标 */}
        <i className=" icon-more_vert hover:bg-gray-200 p-1 rounded-md" />
        {/* </Tag> */}
      </Dropdown>
    </div>
  );
};
