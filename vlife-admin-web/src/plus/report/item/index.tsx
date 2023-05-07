import { Field, Form, GeneralField } from "@formily/core";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { ReportItem } from "@src/api/report/ReportItem";
import { useAuth } from "@src/context/auth-context";
import Content from "@src/pages/template/content";
import React from "react";

export default () => {
  const { getFormInfo } = useAuth();
  return (
    <Content<ReportItem>
      entityType="reportItem"
      filterType="reportItemPageReq"
      //事件2，func===max||min -> fieldType ===number,date
      //事件3， func===sum,avg -> fieldType===number
      formEvents={{
        fieldName: (field: GeneralField, form: Form, formVo: FormVo) => {
          const func = form.getValuesIn("func");
          const formId = form.getValuesIn("formId");
          //事件1，func===count ->fieldName=='id' and fieldName隐藏
          if (func === "count") {
            // field.display = "none";
            form.setValuesIn("fieldName", "id");
          } else {
            form.setValuesIn("fieldName", undefined);
            field.display = "visible";
            if (func && formId) {
              getFormInfo({ id: formId }).then((model: FormVo | undefined) => {
                if (model) {
                  field.setComponentProps({
                    ...field.componentProps,
                    optionList: model.fields
                      .filter((ff: FormFieldVo) => {
                        if (
                          ff.dataType === "basic" &&
                          (ff.fieldType === "number" ||
                            (ff.fieldType === "date" &&
                              (func === "max" || func === "min")))
                        ) {
                          return true;
                        }
                        return false;
                      })
                      .map((f) => {
                        return { label: f.title, value: f.fieldName };
                      }),
                  });
                }
              });
            }
          }
          // field.setState({
          //   value: field.query("formId").value() + field.query("func").value(),
          // });
        },
      }}
      // filterProps={{
      //   fieldName: {
      //     optionList: (a, b, c) => {
      //       alert("11111");
      //       return [a[0]];
      //     },
      //   },
      // }}
    />
  );
};
