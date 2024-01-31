import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { Button, Switch, Tooltip, Typography } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { BtnToolBarPosition, btnType, VFBtn } from "./types";
import { Result } from "@src/api/base";
import { useNiceModal } from "@src/store";
import { useAuth } from "@src/context/auth-context";
import { isNull } from "lodash";
import { objectIncludes } from "@src/util/func";
import { useEffect } from "react";

//封装的按钮组件
export default ({ ...btn }: Partial<VFBtn>) => {
  const { Text } = Typography;

  const {
    datas,
    btnType = "button",
    disabled,
    actionType,
    position = "page",
    icon,
    continueCreate,
    title,
    multiple = false,
    model,
    submitClose = false,
    submitConfirm,
    reaction,
    fieldOutApiParams,
    initData,
    className,
    permissionCode,
    children,
    onFormilySubmitCheck,
    saveApi,
    loadApi,
    onSubmitFinish,
    // onDataChange,
    onClick,
    onSaveBefore,
  } = btn;
  const [loading, setLoading] = useState<boolean>();
  const formModal = useNiceModal("formModal");
  const confirmModal = useNiceModal("confirmModal");
  const { checkBtnPermission } = useAuth();
  const [_btn, setBtn] = useState(btn);
  const [btnData, setBtnData] = useState<any>();

  //按钮数据
  useEffect((): any => {
    if (datas) {
      if (
        (multiple && Array.isArray(datas)) ||
        (!multiple && !Array.isArray(datas))
      ) {
        setBtnData(datas);
      } else if (multiple && !Array.isArray(datas)) {
        setBtnData([datas]);
      } else if (!multiple && Array.isArray(datas)) {
        setBtnData(datas?.[0]);
      }
    }
  }, [datas, multiple]);

  // 鉴权方法
  const authPass = useMemo((): boolean => {
    return (
      (permissionCode && checkBtnPermission(permissionCode)) ||
      permissionCode === undefined
    );
  }, [permissionCode]);

  //设置按钮可用状态
  useEffect(() => {
    const setDisableAndTooltip = (matchResult: string | boolean) => {
      if (typeof matchResult === "string") {
        setBtn((btn) => {
          return { ...btn, tooltip: matchResult, disabled: true };
        });
      } else if (typeof matchResult === "boolean") {
        setBtn((btn) => {
          return { ...btn, disabled: !matchResult };
        });
      }
    };
    let dataMatchTooltip = btnUsableMatch();
    if (dataMatchTooltip instanceof Promise) {
      dataMatchTooltip.then((d) => {
        setDisableAndTooltip(d);
      });
    } else {
      setDisableAndTooltip(dataMatchTooltip);
    }
  }, [btnData]);

  // 按钮是否可用
  const btnUsableMatch = useCallback(():
    | boolean
    | string
    | Promise<boolean | string> => {
    if (btn.disabled !== true) {
      if (
        (btn.actionType === "create" || btn.actionType === "save") &&
        position === "tableToolbar"
      ) {
        return true;
      } else if (
        //任何字段都没有值判断
        btnData === undefined ||
        (Array.isArray(btnData) && btnData?.length === 0) ||
        (typeof btnData === "object" &&
          Object.values(btnData).every((value) => !value) === true)
      ) {
        return false;
      } else if (btn.usableMatch === undefined) {
        //2 无匹配方式
        return true;
      } else if (typeof btn.usableMatch === "object" && btnData) {
        if (Array.isArray(btnData)) {
          return (
            //所有数据都满足
            btnData?.filter((a: any) => {
              return objectIncludes(a, btn.usableMatch);
            }).length === btnData?.length
          );
        } else {
          return objectIncludes(btnData, btn.usableMatch);
        }
      } else if (typeof btn.usableMatch === "function") {
        //同步函数
        if (btn.usableMatch instanceof Promise<boolean | string>) {
          //异步函数转同步返回
          const result = btn.usableMatch;
          return result;
        } else {
          const match = btn.usableMatch(btnData);
          return match === undefined && btnData && btnData.length > 0
            ? true
            : match;
        }
      }
      return false;
    } else {
      return false;
    }
  }, [btnData, position]);

  // 修改了数据才往回传输数据
  const show = useCallback(() => {
    const modal = (formData: any) => {
      formModal.show({
        type: model,
        formData: formData,
        fieldOutApiParams: fieldOutApiParams, //指定字段访问api取值的补充外部入参
        btns: [btn], //取消掉btns简化逻辑，弹出层值显示一个按钮(create按钮新增完需要继承存在)
        terse: !saveApi ? true : false, //紧凑
        fontBold: !saveApi ? true : false, //加粗
        readPretty: actionType === "api" || !saveApi ? true : false,
        //屏蔽掉(这个是该入口按钮数据)
        // onDataChange(d: any) {
        //   setBtnData((data: any) => {
        //     return [d];
        //   });
        // },
        reaction: reaction,
      });
    };
    if (
      actionType === "create" ||
      (actionType === "save" && position === "tableToolbar")
    ) {
      modal(initData);
    } else if (loadApi === undefined) {
      modal(btnData || initData || {});
    } else if (btnData) {
      loadApi(btnData).then((d) => {
        modal(d.data);
      });
    }
  }, [btnData]);

  //按钮提交
  const submit = useCallback(
    (...datas: any) => {
      const save = () => {
        setLoading(true);
        return saveApi?.(onSaveBefore ? onSaveBefore(btnData) : btnData).then(
          (d: Result<any>) => {
            setTimeout(() => {
              if (submitClose) {
                formModal.hide();
              }
              if (onSubmitFinish) {
                onSubmitFinish(d.data);
              }
              setLoading(undefined);
            }, 500);
          },
          (error: any) => {
            setTimeout(() => {
              setLoading(undefined);
            }, 500);
          }
        );
      };
      if (saveApi && btnData) {
        return onFormilySubmitCheck
          ? onFormilySubmitCheck().then((dLboolean) => {
              return save();
            })
          : save();
      } else if (onClick) {
        onClick(btnData);
      }
    },
    [position, btnData]
  );

  //按钮点击
  const btnClick = useCallback(() => {
    if (position !== "formFooter" && model) {
      //1 页面(非modal)的按钮有模型信息打开页面
      show();
    } else if (saveApi && btnData) {
      //2. 按钮触发接口调用
      if (submitConfirm) {
        // 需确认;
        confirmModal
          .show({
            title: `确认${title}${
              Array.isArray(btnData) ? btnData.length : "该"
            }条记录?`,
            saveFun: () => {
              return submit(btnData)?.then((d: any) => {});
            },
          })
          .then((data: any) => {
            confirmModal.hide();
          });
      } else {
        submit(btnData)?.then((d: any) => {});
      }
    } else if (onClick) {
      onClick(btnData);
    }
  }, [btnData, position, continueCreate]);

  // 按钮名称计算
  const btnTitle = useMemo((): string | ReactNode => {
    if (position === "formFooter") {
      if (
        btn.actionType == "save" ||
        btn.actionType == "create" ||
        btn.actionType === "edit"
      ) {
        return "保存";
      }
    } else if (title === undefined) {
      if (btn.actionType === "create") {
        return "新增";
      } else if (btn.actionType === "edit") {
        return "修改";
      } else if (btn.actionType === "save" && btnData) {
        return "修改";
      } else if (btn.actionType === "save" && btnData === undefined) {
        return "新增";
      }
    } else if (position === "tableToolbar") {
      if (btn.actionType === "save" || btn.actionType === "create") {
        if (isNull(btn.title) || btn.title === undefined) {
          return "新增";
        } else if (!btn?.title?.startsWith("新增")) {
          return "新增" + btn.title;
        }
      }
    } else if (position === "tableLine") {
      if (btn.actionType === "save" || btn.actionType === "edit") {
        if (isNull(btn.title) || btn.title === undefined) {
          return "修改";
        } else {
          return btn.title;
        }
      }
    }
    return btn.title;
  }, [btn, position]);

  const btnIcon = useMemo(() => {
    if (btn.icon) {
      return btn.icon;
    } else if (btn.actionType === "create") {
      return <i className="  icon-add_circle_outline" />;
    } else {
      return <i className="  icon-gantt_chart" />;
    }
  }, [btn.icon, btn.actionType, position, btnData]);

  const BtnComp = useMemo((): ReactNode => {
    const Btn: any =
      btnType === "link" && position !== "formFooter" ? Text : Button;
    return btnType !== "icon" || position === "formFooter" ? (
      <Btn
        onClick={() => {
          if (!_btn.disabled) {
            btnClick();
          }
        }}
        loading={loading}
        theme={`${
          (_btn.actionType === "edit" ||
            _btn.actionType === "create" ||
            _btn.actionType === "save") &&
          _btn.disabled !== true &&
          position === "formFooter"
            ? "solid"
            : position === "dropdown"
            ? "borderless"
            : "light"
        }`}
        className={` ${className} hover:cursor-pointer  ${classNames({
          "cursor-pointer hover:text-blue-600 hover:font-bold":
            position === "tableLine",
          " !text-gray-800 !font-thin text-xs": position === "dropdown",
        })}`}
        icon={btnType === "link" ? undefined : btnIcon}
        disabled={_btn.disabled}
      >
        {/* {JSON.stringify(btnData?.id)} */}
        <span className=" space-x-2 items-center justify-center">
          {_btn.children ? _btn.children : btnTitle}
        </span>
      </Btn>
    ) : (
      <div
        className="flex w-6 hover:cursor-pointer items-center justify-center rounded-md cursor-pointer px-2 "
        onClick={() => {
          if (!_btn.disabled) {
            btnClick();
          }
        }}
      >
        {_btn.tooltip === undefined && btn.title ? (
          <Tooltip
            className={`${classNames({
              " text-gray-300": _btn.disabled === true,
            })}`}
            content={btn.title}
          >
            {btn.icon}
          </Tooltip>
        ) : (
          <span
            className={`${classNames({
              " text-gray-300": _btn.disabled === true,
            })}`}
          >
            {btn.icon}
          </span>
        )}
      </div>
    );
  }, [_btn, btnIcon, btnTitle, loading]);
  return authPass && !(btn.disabledHide && btn.disabled === true) ? (
    <>
      {_btn.tooltip && btn.disabled === true ? (
        <Tooltip content={btn.tooltip}>{BtnComp}</Tooltip>
      ) : (
        BtnComp
      )}
      {/* {JSON.stringify(btnData)} */}
    </>
  ) : (
    <>{/* 没有权限 */}</>
  );
};
