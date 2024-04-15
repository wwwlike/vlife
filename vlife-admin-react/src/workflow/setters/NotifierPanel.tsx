import React, { memo } from "react";
import { VF } from "@src/dsl/VF";
import FormPage from "@src/pages/common/formPage";
import { IApproverSettings } from "@src/workflow-editor/classes/vlife";
import { FormVo } from "@src/api/Form";

export const NotifierPanel = memo(
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
          VF.then(
            "joinType",
            "emptyPass",
            "handleType",
            "addSign",
            "rollback",
            "emptyUserId",
            "rejected",
            "auditLevel",
            "recall",
            "transfer",
            "nodeType"
          ).hide(),
          VF.then("nodeType").value("notifier"),
          VF.field("handleType").default("general"),
          VF.then("auditList").title("抄送至"),
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
          //     disableVals: ["Writeable"],
          //   };
          // }),
        ]}
      />
    );
  }
);
