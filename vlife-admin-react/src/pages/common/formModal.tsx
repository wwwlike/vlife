import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import React, { useCallback, useMemo, useState } from "react";
import FormPage, { FormPageProps } from "./formPage";
import { Form, IFormFeedback } from "@formily/core";
import { IdBean } from "@src/mvc/base";

export interface FormModalProps
  extends Omit<FormPageProps, "setFormData" | "formData"> {
  saveFun?: <T extends IdBean>(dto: Partial<T>) => Promise<T>;
  initData?: any;
}

/**
 * 传save则用传入的save进行保存，否则就用通用保存方法进行
 * 因为是modal窗口，固数据不需要传输出去
 * initData 数据初始化
 * formData 表单录入后的数据
 */
export const VlifeModal = createNiceModal(
  "formModal",
  ({
    saveFun,
    initData,
    entityName,
    modelName,
    onError,
    ...props
  }: FormModalProps) => {
    const modal = useNiceModal("formModal");
    const [formData, setFormData] = useState<any>(); //
    const [form, setForm] = useState<Form>(); //
    const [errors, setErrors] = useState<IFormFeedback[]>([]);
    const title = useMemo(() => {
      if (props.read) {
        return "详情";
      } else {
        if ((formData && formData.id) || (initData && initData.id)) {
          return "编辑";
        } else {
          return "新增";
        }
      }
    }, [initData, formData, props.type]);
    const handleSubmit = useCallback(() => {
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
    }, [formData, form]);

    return (
      <NiceModal
        id="formModal"
        title={title}
        width={900}
        onOk={handleSubmit}
        //  okButtonProps={
        //   {disabled:form&&form.errors.length>0}
        // }
      >
        <FormPage
          onError={setErrors}
          formData={initData}
          onDataChange={setFormData}
          entityName={entityName}
          modelName={modelName}
          onForm={setForm}
          {...props}
        />
      </NiceModal>
    );
  }
);

export default VlifeModal;
