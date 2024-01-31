import React, { useCallback, useEffect, useMemo, useState } from "react";
import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import { Form, IFormFeedback } from "@formily/core";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import FormPage, { FormPageProps } from "../formPage";
import { VFBtn } from "@src/components/button/types";
import VfButton from "@src/components/button";
import { Button, Switch } from "@douyinfe/semi-ui";
import classNames from "classnames";
/**
 * 表单弹出层属性
 */
export interface FormModalProps extends FormPageProps<any> {
  width?: number; //modal宽度
  btns: VFBtn[]; //
  saveFun?: <T extends IdBean>(dto: Partial<T>) => Promise<T>; //表单保存触发的方法(已经废弃当前采用BtnToolBar里的保存)
}

/**
 * model信息没有在数据库里初始化则不能采用
 * 传save则用传入的save进行保存，否则就用通用保存方法进行
 * 因为是modal窗口，固数据不需要传输出去
 * initData 数据初始化
 * formData 表单录入后的数据
 * table里触发调用， formPage里获取组件返回给
 */
export const FormModal = createNiceModal(
  "formModal",
  ({
    modelInfo, //模型信息
    formData, //表单数据
    width,
    saveFun,
    onError,
    onDataChange,
    btns,
    ...props
  }: FormModalProps) => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const [_continueCreate, setContinueCreate] = useState<
      boolean | undefined
    >();

    const [formNumber, setFormNumber] = useState<number>(0);

    const [screenSize, setScreenSize] = useState({
      width: window.screen.width,
      height: window.screen.height,
    });

    //form能使用的按钮过滤，并且对按钮添加提交之前的前置校验方式
    const modal = useNiceModal("formModal");
    //modal里的表单数
    const [modifyData, setModifyData] = useState();
    const [data, setData] = useState(formData);
    const [form, setForm] = useState<Form>(); // formliy的form
    const [errors, setErrors] = useState<IFormFeedback[]>([]);
    const [formVo, setFormVo] = useState<FormVo | undefined>(modelInfo);
    // const [reload, setReload] = useState<number>(0);
    const title = useMemo(() => {
      const no = data?.no || "";
      if (props.title) return props.title;
      if (props.title === undefined && formVo === undefined) {
        return `“${props.type}”模型标识不存在`;
      }
      if (props.readPretty) {
        return formVo?.name + "详情" + no;
      } else {
        if (form?.values && form.values.id) {
          return formVo?.name + "" + no;
        } else {
          return "新建(" + formVo?.name + ")";
        }
      }
    }, [data, form, formVo && formVo.name]);

    //非按钮型直接提交
    const handleSubmit = useCallback(() => {
      if (formVo) {
        //提交按钮触发的事件
        if (saveFun && form) {
          //通用保存
          form
            .submit()
            .then((data) => {
              saveFun(form.values).then((data) => {
                modal.resolve(data);
                modal.hide();
              });
            })
            .catch((e) => {});
        }
      }
    }, [data, formVo, form]);

    //可用按钮过滤，以及提交检查函数封装
    const formBtns = useMemo(() => {
      if (btns && form) {
        return btns.map((f) => {
          return {
            ...f,
            onFormilySubmitCheck: (): Promise<boolean> => {
              return (
                form.submit().then((d) => {
                  return true;
                }) ||
                new Promise((resolve) => {
                  resolve(false);
                })
              );
            },
          };
        });
      }
      return [];
    }, [btns, form, formVo]);

    const footer = useMemo(() => {
      if (formBtns && formBtns.length > 0) {
        return (
          <div className="flex w-full justify-end relative  space-x-1">
            {formBtns.map((btn, index) => {
              return (
                <div key={`div_btn_${index}`}>
                  {btn.actionType === "create" &&
                    (_continueCreate !== undefined ||
                      btn.continueCreate !== false) && (
                      <div
                        key={`continueDIv_${index}`}
                        className=" absolute flex left-2  items-center"
                      >
                        <span
                          className={`text-gray-400 ${classNames({
                            " !text-gray-800":
                              _continueCreate !== undefined
                                ? _continueCreate
                                : btn.continueCreate,
                          })}`}
                        >
                          连续新增
                        </span>
                        <Switch
                          checked={
                            _continueCreate !== undefined
                              ? _continueCreate
                              : btn.continueCreate
                          }
                          onChange={(t) => {
                            setContinueCreate(t);
                          }}
                          checkedText="开"
                          uncheckedText="关"
                        />
                      </div>
                    )}
                  <VfButton
                    key={`model_btn_${index}`}
                    {...btn}
                    datas={data} //formPage的数据通过它传
                    position="formFooter"
                    onSubmitFinish={(_data) => {
                      if (
                        _continueCreate === true ||
                        (_continueCreate === undefined &&
                          btn.continueCreate === true)
                      ) {
                        setData(undefined);
                        setFormNumber((num) => num + 1);
                      } else {
                        setData(_data);
                      }
                      if (btn.onSubmitFinish) {
                        btn.onSubmitFinish(_data);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      } else {
        return (
          <div>
            <Button onClick={handleSubmit}>确定</Button>
          </div>
        );
      }
    }, [formBtns, data, form, _continueCreate]);

    return (
      <NiceModal
        id="formModal"
        height={(windowSize.height / 3) * 2}
        footer={footer}
        title={title}
        className=" max-h-96"
        width={
          width
            ? width
            : formVo?.modelSize === 4
            ? 1200
            : formVo?.modelSize === 3
            ? 1000
            : formVo?.modelSize === 2
            ? 800
            : formVo?.modelSize === 1
            ? 600
            : 900 //默认900
        }
        onOk={handleSubmit}
      >
        {/* 弹出层不传表单给formPage,并且还从回调接收FormVo */}
        <FormPage
          // className=" h-96"
          key={`modal${props.type + data?.id + formNumber}`}
          onError={setErrors}
          formData={data}
          modelInfo={modelInfo}
          modifyData={modifyData}
          onDataChange={(data, field) => {
            setData((d: any) => {
              return { ...data };
            });
          }}
          onForm={(f) => {
            setForm(f);
          }} //formily表单信息
          onVfForm={setFormVo} //vf模型信息
          {...props}
        />
      </NiceModal>
    );
  }
);

export default FormModal;
