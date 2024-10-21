import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { useAuth } from "@src/context/auth-context";
import { useEffect } from "react";
import { useState } from "react";

export interface FieldLabelProps {
  fieldName: string; //字段名称
  formId?: string; //模型id
  type?: string; //模型type
  value?: any; //字段值
}
// 字段label显示组件
export default ({ value, formId, type, fieldName }: FieldLabelProps) => {
  const { dicts, getFormInfo } = useAuth();
  const [formFieldVo, setFormFieldVo] = useState<FormFieldVo>();
  useEffect(() => {
    getFormInfo({ type }).then((d: any) => {
      setFormFieldVo(d);
      setFormFieldVo(
        d.fields?.find((f: FormFieldVo) => f.fieldName === fieldName)
      );
    });
  }, [type]);

  return formFieldVo && formFieldVo.dictCode ? (
    <>
      {dicts[formFieldVo.dictCode]?.data.find((f) => f.value === value)?.label}
    </>
  ) : formFieldVo?.pathName === "id" ? (
    <>{1}</>
  ) : (
    <>{value}</>
  );
};
