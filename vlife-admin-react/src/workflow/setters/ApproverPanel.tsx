import { memo, useMemo, useState } from "react";
import { useTranslate } from "../../workflow-editor/react-locales";
import { VF } from "@src/dsl/VF";
import FormPage from "@src/pages/common/formPage";
import { IApproverSettings } from "@src/workflow-editor/classes/vlife";
import { FormVo } from "@src/api/Form";
//materialUis 物料信息配置
export const ApproverPanel = memo(
  (props: {
    value?: IApproverSettings;
    formVo?: FormVo;
    onChange?: (value?: IApproverSettings) => void;
  }) => {
    return (
      <FormPage
        terse
        fontBold
        type="iApproverSettings"
        formData={props.value}
        onDataChange={props.onChange}
        reaction={[
          VF.then("nodeType").value("approver").hide(),
          VF.field("handleType").default("general"),
          VF.field("joinType").default("one_audit"),
          VF.field("handleType").eq("general").then("auditList").show(),
          VF.field("handleType").eq("level").then("auditLevel").show(),
          VF.field("fields").default(
            props?.formVo?.fields
              .filter((f) => f.x_hidden !== true)
              .map((f) => {
                return {
                  title: f.title,
                  fieldName: f.fieldName,
                  access: "Readable",
                };
              })
          ),
          // .componentProps((d, props) => {
          //   return {
          //     ...props,
          //     defaultVal: "Readable",
          //   };
          // }),
        ]}
      />
    );
  }
);
