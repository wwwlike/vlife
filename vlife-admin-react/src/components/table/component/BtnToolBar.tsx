import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { Button, Typography } from "@douyinfe/semi-ui";
import { IdBean, Result } from "@src/api/base";
import { VfAction } from "@src/components/form/VF";
import { useAuth } from "@src/context/auth-context";
import { useNiceModal } from "@src/store";
import { objectIncludes } from "@src/util/func";
import { VFBtn } from "../types";

/**
 * 区块按钮组定义
 */
export interface BtnToolBarProps<T extends IdBean> {
  btns: VFBtn[]; //按钮对象
  model?: string; //模型名称 只取该模型相关的按钮
  datas?: T[]; //操作的数据
  position: "tableToolbar" | "tableLine" | "formFooter"; //显示场景 列表工具栏|列表行|表单底部
  className?: string;
  //form表单需要;
  line?: number; //行号 tableLine模式下使用 临时数据可用行号当索引进行操作
  reaction?: VfAction[]; //form联动关系
  validate?: {
    [key: string]: (val: any, formData: object) => string | Promise<any> | void;
  };
  dataComputer?: { funs: (data: any) => any; watchFields?: string[] };
  readPretty?: boolean; //当前页面模式
  onDataChange: (datas: any[]) => void; //数据修订号传输出去
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
  position,
  className,
  model,
  readPretty,
  onDataChange,
  ...props
}: BtnToolBarProps<T>) => {
  const { Text } = Typography;
  const { checkBtnPermission } = useAuth();
  const formModal = useNiceModal("formModal");
  const [loadbtn, setLoadbtn] = useState<string>();
  const [btnDatas, setBtnDatas] = useState<T[] | undefined>(datas);
  const confirmModal = useNiceModal("confirmModal");
  useEffect(() => {
    setBtnDatas(datas);
  }, [datas]);
  //数据提交
  const submit = useCallback((vfBtn: VFBtn, saveApiObj: T[], index: number) => {
    const savaData = vfBtn.onSaveBefore
      ? vfBtn.onSaveBefore(vfBtn.multiple ? saveApiObj : saveApiObj[0])
      : vfBtn.multiple
      ? saveApiObj
      : saveApiObj[0];
    const save = (btn: VFBtn, saveApiFunc: any) => {
      setLoadbtn(`${position}btn${index}`);
      return saveApiFunc(savaData).then(
        (d: Result<any>) => {
          onDataChange([d.data]);
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
  }, []);

  //按钮点击
  const btnClick = useCallback(
    (btn: VFBtn, index: number) => {
      if (
        (position === "tableToolbar" || position === "tableLine") &&
        btn.model
      ) {
        //1 页面(非modal)的按钮有模型信息打开页面
        show(btn);
      } else if (btn.saveApi && btnDatas) {
        //2. 按钮触发接口调用
        if (btn.submitConfirm) {
          // 需确认;
          confirmModal
            .show({
              title: `确认${btn.title}${
                btnDatas?.length === 1 ? "该" : btnDatas.length
              }条记录?`,
              saveFun: () => {
                return submit(btn, btnDatas, index).then((d: any) => {});
              },
            })
            .then((data: any) => {
              confirmModal.hide();
            });
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

  // 按钮名称
  const btnTitle = useCallback(
    (btn: VFBtn): string => {
      //对于编辑类型按钮(actionType=edit)在表单页且按钮模型和表单模型一致，则名称改为保存
      if (btn.actionType !== "api" && position === "formFooter") {
        return "保存";
      }
      return btn.title;
    },
    [position]
  );

  const show = useCallback(
    (btn: VFBtn) => {
      const modal = (data: any) => {
        formModal.show({
          type: btn.model,
          formData: data,
          btns,
          readPretty: btn.actionType === "api" ? true : false,
          fontBold: btn.actionType === "api" ? true : false,
          onDataChange(d: any) {
            setBtnDatas([d]);
          },
          ...props,
        });
      };
      if (btn.loadApi === undefined) {
        modal(
          btnDatas?.[0] || btn.initData || {}
          // btn.actionType === "create"
          //   ? btn.initData || {}
          //   : btnDatas
          //   ? btnDatas[0]
          //   : undefined
        );
      } else if (btnDatas) {
        btn.loadApi(btnDatas[0].id).then((d) => {
          modal(d.data);
        });
      }
    },
    [btnDatas, btns, props]
  );

  //1权限检查
  const permissionCheck = useCallback(
    (btn: VFBtn) => {
      return (
        (btn.permissionCode && checkBtnPermission(btn.permissionCode)) ||
        btn.permissionCode === undefined
      );
    },
    [btnDatas]
  );

  //可用性比对检查 false不可用， true可用
  const usableMatch = useCallback(
    (btn: VFBtn): boolean => {
      const data = btnDatas ? btnDatas.filter((b) => b.id) : [];
      if (
        btn.actionType !== "create" &&
        (data === undefined || data?.length === 0)
      ) {
        //1 没有选中数据，非创建类按钮不可用
        return false;
      }
      if (btn.usableMatch === undefined) {
        return true;
      } else if (typeof btn.usableMatch === "boolean") {
        return btn.usableMatch;
      } else {
        if (btn.usableMatch instanceof Array) {
          return (
            data?.filter((a: any) => {
              return (
                btn.usableMatch.filter((b: any) => objectIncludes(a, b))
                  .length > 0
              );
            }).length === data?.length
          );
        } else {
          return (
            //所有数据都满足
            data?.filter((a: any) => objectIncludes(a, btn.usableMatch))
              .length === data?.length
          );
        }
      }
    },
    [btnDatas]
  );

  //当前模式下的可用按钮数组
  const currBtns = useMemo(() => {
    let toolBarBtns: VFBtn[] = [];
    if (position === "tableToolbar") {
      //列表工具栏 新增和操作多个数据的按钮
      toolBarBtns = btns.filter(
        (b) => b.multiple === true || b.actionType === "create"
      );
    } else if (position === "tableLine") {
      //行按钮->排除新增和多个操作的按钮
      toolBarBtns = btns.filter(
        (b) => b.actionType !== "create" && b.multiple !== true
      );
    } else {
      //明细页按钮

      if (btnDatas === undefined || btnDatas[0].id === undefined) {
        //新增
        toolBarBtns = btns.filter((b) => b.actionType === "create");
        return toolBarBtns;
      } else {
        toolBarBtns = btns.filter(
          (b) =>
            b.actionType !== "create" &&
            (b.multiple === false || b.multiple === undefined)
        );
      }
    }
    return toolBarBtns
      .filter((btn) => (model ? btn.model === model : true)) //有传模型名称，则当前场景的按钮都是该模型
      .filter((btn) => (readPretty ? btn.actionType === "api" : true)) //预览模式下，则只有api直接操作的按钮可用
      .filter((btn) => permissionCheck(btn)) //没权限不展示
      .filter((btn) => {
        return !(btn.disabledHide && !usableMatch(btn)); //disabled且hide的也不展示
      });
  }, [position, btns, btnDatas, model, readPretty]);

  return (
    <div className={`${className} space-x-1`}>
      {currBtns.map((btn, index) => {
        const disabled = !usableMatch(btn);
        const Btn: any = position === "tableLine" ? Text : Button;
        const key = `${position}btn${index}`;
        const BtnComp = (
          <Btn
            onClick={() => {
              btnClick(btn, index);
            }}
            loading={loadbtn && loadbtn === key}
            theme={`${btnTitle(btn) === "保存" ? "solid" : "light"}`}
            className={`${classNames({
              "cursor-pointer hover:text-blue-600 hover:font-bold":
                position === "tableLine",
            })} `}
            key={key}
            icon={position === "tableLine" ? undefined : btn.icon}
            disabled={disabled}
          >
            {btnTitle(btn)}
          </Btn>
        );
        return <span key={`${position}btn${index}`}>{BtnComp}</span>;
      })}
    </div>
  );
};
