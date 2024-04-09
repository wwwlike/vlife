import React, { ReactNode, useCallback, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Modal,
  TextArea,
  Tooltip,
  Typography,
} from "@douyinfe/semi-ui";
import classNames from "classnames";
import { VFBtn } from "./types";
import { Result } from "@src/api/base";
import { useNiceModal } from "@src/store";
import { useAuth } from "@src/context/auth-context";
import { isNull } from "lodash";
import { objectIncludes } from "@src/util/func";
import { useEffect } from "react";
import { IconSend } from "@douyinfe/semi-icons";
import IconContext from "@ant-design/icons/lib/components/Context";

//封装的按钮组件
export default ({ ...btn }: Partial<VFBtn>) => {
  const { Text } = Typography;
  const {
    datas,
    btnType = "button",
    actionType,
    position = "page",
    continueCreate,
    title,
    multiple = false,
    model,
    submitClose = false,
    submitConfirm,
    reaction,
    fieldOutApiParams,
    initData,
    otherBtns,
    className,
    permissionCode,
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
  const [_btn, setBtn] = useState({
    ...btn,
    disabledHide:
      btn.disabledHide ||
      btn.position === "tableLine" ||
      btn.position === "formFooter" //这2个位置的按钮如果不可用则默认是隐藏不显示的
        ? true
        : false,
  });
  const [btnData, setBtnData] = useState<any>();
  const [comment, setComment] = useState<string>();
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
        (btnData === null || btnData === undefined || btnData.id === undefined)
      ) {
        return true; //1. 新增可用
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
      //按钮直接不可用
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
        btns: otherBtns ? [btn, ...otherBtns] : [btn], //取消掉btns简化逻辑，弹出层值显示一个按钮(create按钮新增完需要继承存在)
        terse: !saveApi ? true : false, //紧凑
        fontBold: !saveApi ? true : false, //加粗
        readPretty: actionType === "api",
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
  }, [btnData, reaction]);

  // 工作流审核框弹出
  const flowCommentShow = useCallback(() => {
    let commentTemp: string;
    Modal.info({
      title: `确认`,
      content: (
        <TextArea
          onChange={(s) => {
            commentTemp = s;
          }}
          rows={4}
          placeholder="请输入审核意见"
        />
      ),
      icon: <IconSend />,
      hasCancel: true,
      onOk: () => {
        submit({ comment: commentTemp });
      },
    });
  }, [btnData, comment]);

  //按钮提交 flowInfo审核的流程数据
  const submit = useCallback(
    (flowInfo?: any) => {
      const save = () => {
        setLoading(true);
        const saveResult = saveApi?.(
          flowInfo
            ? onSaveBefore
              ? onSaveBefore({ ...btnData, ...flowInfo })
              : { ...btnData, ...flowInfo }
            : onSaveBefore
            ? onSaveBefore(btnData)
            : btnData
        );
        const submitAfter = (data: any) => {
          setTimeout(() => {
            if (submitClose) {
              formModal.hide();
            }
            if (onSubmitFinish) {
              onSubmitFinish(data);
            }
            setLoading(undefined);
          }, 500);
        };
        if (saveResult instanceof Promise) {
          return saveResult.then(
            (d: Result<any>) => {
              submitAfter(d.data);
              return d.data;
            },
            (error: any) => {
              setTimeout(() => {
                setLoading(undefined);
              }, 500);
            }
          );
        } else {
          submitAfter(saveResult);
          return saveResult;
        }
      };

      if (saveApi && btnData) {
        return onFormilySubmitCheck
          ? onFormilySubmitCheck().then((dLboolean) => {
              return save();
            })
          : save();
      }
    },
    [position, btnData, comment]
  );

  //按钮点击
  const btnClick = useCallback(() => {
    if (onClick) {
      onClick(btnData);
    } else if (position !== "formFooter" && model) {
      //1 页面(非modal)的按钮，model不为空,则触发model的弹出
      show();
    } else if (btn.comment && position !== "comment") {
      flowCommentShow();
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
              return submit();
            },
          })
          .then((data: any) => {
            confirmModal.hide();
          });
      } else {
        return submit()?.then((d: any) => {
          return d;
        });
      }
    }
  }, [btnData, position, continueCreate, reaction]);

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
      } else if (
        btn.actionType === "save" &&
        position !== "tableToolbar" &&
        btnData
      ) {
        return "修改";
      } else if (
        btn.actionType === "save" &&
        (btnData === undefined || position === "tableToolbar")
      ) {
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

    if (position === "dropdown" && _btn.disabled === true) {
      //dropdown场景不存在不可用但是可见的disable状态
      return <></>;
    }

    return btnType !== "icon" || position === "formFooter" ? (
      <>
        {position === "dropdown" && btn.divider === true && (
          <Divider>{btn.divider}</Divider>
        )}
        {position === "dropdown" &&
          btn.divider &&
          typeof btn.divider === "string" && (
            <Divider>
              <span className=" font-thin text-gray-800 text-xs">
                {btn.divider}
              </span>
            </Divider>
          )}
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
      </>
    ) : (
      //图标
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
  }, [_btn, btnIcon, btnTitle, position, loading, reaction]);
  return authPass && !(_btn.disabledHide && _btn.disabled === true) ? (
    <>
      {/* {btn.actionType === "flow" &&
        btn.position === "formFooter" &&
        JSON.stringify(btnData?.username)} */}
      {_btn.tooltip && _btn.disabled === true ? (
        <Tooltip content={_btn.tooltip}>{BtnComp}</Tooltip>
      ) : (
        BtnComp
      )}
    </>
  ) : (
    <>{/* 没有权限 */}</>
  );
};
