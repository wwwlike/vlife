import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import React, { useCallback, useMemo, useState } from "react";
import { Form, IFormFeedback } from "@formily/core";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import FormPage, { FormPageProps } from "../formPage";
/**
 * 使用弹出层必须有modelInfo,需要确定弹框大小
 */
export interface FormModalProps extends FormPageProps<any> {
  //modal宽度，传则采用
  width?: number;
  //是否补充title,传入的title是动作，补充的是动作+模型名称
  fillTitie?: boolean;
  //表单保存触发的方法
  saveFun?: <T extends IdBean>(
    dto: Partial<T>
    // params: { entityType: string; type?: string }
  ) => Promise<T>;
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
    width, //宽度
    saveFun, //保存促发的方法
    onError,
    ...props
  }: FormModalProps) => {
    const modal = useNiceModal("formModal");
    //modal里的表单数九
    // const [fromModalData, setFromModalData] = useState<any>(); //
    const [form, setForm] = useState<Form>(); // formliy的form
    const [errors, setErrors] = useState<IFormFeedback[]>([]);
    const [formVo, setFormVo] = useState<FormVo | undefined>(modelInfo);
    const title = useMemo(() => {
      formVo;
      const no = formData?.no || "";
      if (props.title) return props.title;
      if (props.readPretty) {
        return formVo?.title + "详情" + no;
      } else {
        if (formData && formData.id) {
          return formVo?.title + "编辑" + no;
        } else {
          return "新建(" + formVo?.title + ")";
        }
      }
    }, [formData, formVo && formVo.title]);

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

    return (
      <NiceModal
        className={`${formVo ? "" : "hidden"}`}
        id="formModal"
        title={title}
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
        // className="{` w-full`}"
        onOk={handleSubmit}
        //  okButtonProps={
        //   {disabled:form&&form.errors.length>0}
        // }
      >
        {/* 弹出层不传表单给formPage,并且还从回调接收FormVo */}
        <FormPage
          // className=" h-96"
          key={`modal${props.type + formData?.id}`}
          onError={setErrors}
          formData={formData}
          modelInfo={modelInfo}
          // onDataChange={setFormData}
          onForm={setForm}
          onVfForm={(vfForm) => {
            setFormVo(vfForm);
          }}
          {...props}
        />
      </NiceModal>
    );
  }
);

export default FormModal;
