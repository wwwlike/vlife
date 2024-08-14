import React, { useCallback, useEffect, useState } from "react";
import { FormVo } from "@src/api/Form";
import FormPage from "@src/pages/common/formPage";
import { FormItemCondition } from "@src/dsl/base";

/**
 * 对req模型产生的查询结果适配转换成
 * condition
 */
interface ConditionRequestProps {
  className: string;
  form: FormVo;
  layout: "horizontal " | "vertical";
  data: any;
  // 传出condtion封装的查询条件
  onDataChange: (condition: FormItemCondition) => void;
}
export default ({
  layout,
  form,
  data,
  onDataChange,
  ...props
}: ConditionRequestProps) => {
  const [formData, setFormData] = useState<any>(data);
  const getCondition = useCallback(
    (data: any): FormItemCondition => {
      return { orAnd: "and", where: [], conditions: [] };
    },
    [form]
  );
  useEffect(() => {
    if (onDataChange) onDataChange(getCondition(formData));
  }, [formData]);
  return (
    <>
      {form && (
        <FormPage
          type={`${form.type}`}
          formData
          onDataChange={(d) => {
            setFormData(d);
          }}
        />
      )}
    </>
  );
};
