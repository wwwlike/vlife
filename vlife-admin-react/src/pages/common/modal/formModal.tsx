import React, { useCallback, useMemo, useState } from "react";
import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import { Form, IFormFeedback } from "@formily/core";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import FormPage, { FormPageProps } from "../formPage";
import BtnToolBar from "@src/components/table/component/BtnToolBar";
import { VFBtn } from "@src/components/table/types";
import { Button } from "@douyinfe/semi-ui";
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

    const [screenSize, setScreenSize] = useState({
      width: window.screen.width,
      height: window.screen.height,
    });

    //form能使用的按钮过滤，并且对按钮添加提交之前的前置校验方式
    const modal = useNiceModal("formModal");
    //modal里的表单数九
    const [modifyData, setModifyData] = useState();
    // const [data, setData] = useState(formData);
    const [form, setForm] = useState<Form>(); // formliy的form
    const [errors, setErrors] = useState<IFormFeedback[]>([]);
    const [formVo, setFormVo] = useState<FormVo | undefined>(modelInfo);
    // const [reload, setReload] = useState<number>(0);
    const title = useMemo(() => {
      const no = formData?.no || "";
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
    }, [formData, form, formVo && formVo.name]);

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
                //  pageRefresh();
                modal.hide();
              });
            })
            .catch((e) => {});
        }
      }
    }, [formData, formVo, form]);

    const formBtns = useMemo(() => {
      if (btns)
        return btns
          .filter((f) => true)
          .map((f) => {
            return {
              ...f,
              onFormilySubmitCheck: (): Promise<boolean> => {
                return (
                  form?.submit().then((d) => {
                    return true;
                  }) ||
                  new Promise((resolve) => {
                    resolve(false);
                  })
                );
              },
            };
          });
      return [];
    }, [btns, form, formVo]);

    const footer = useMemo(() => {
      if (formBtns && formBtns.length > 0) {
        return (
          <BtnToolBar
            // entityName={modelInfo?.entityType || ""}
            key={"modalBtn"}
            btns={formBtns}
            formModel={props.type}
            position="formFooter"
            datas={[form?.values || formData]}
            readPretty={props.readPretty}
            onDataChange={(d) => {
              setModifyData(d[0]);
            }}
          />
        );
      } else {
        return (
          <div>
            <Button onClick={handleSubmit}>确定</Button>
          </div>
        );
      }
    }, [formBtns, form]);

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
          key={`modal${props.type + formData?.id}`}
          onError={setErrors}
          formData={formData}
          modelInfo={modelInfo}
          modifyData={modifyData}
          onDataChange={(data, field) => {
            if (onDataChange) {
              onDataChange(data, field);
            }
          }}
          onForm={setForm} //formily表单信息
          onVfForm={setFormVo} //vf模型信息
          {...props}
        />
      </NiceModal>
    );
  }
);

export default FormModal;
