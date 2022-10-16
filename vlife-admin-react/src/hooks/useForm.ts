/**
 * 表单数据写入，数据校验
 */
import { useCallback, useState } from "react";
export const useForm = <T>(initialValues: T, validators: any) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState({});
  const setFieldValue = useCallback(
    (name: string, value: string) => {
      setValues((values) => ({
        ...values,
        [name]: value,
      }));

      if (validators && validators[name]) {
        const errMsg = validators[name](value);
        setErrors((errors) => ({
          ...errors,
          [name]: errMsg || null,
        }));
      }
    },
    [validators]
  );
  return { values, errors, setFieldValue };
};
