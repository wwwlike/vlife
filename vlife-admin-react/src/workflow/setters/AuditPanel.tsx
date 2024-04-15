import React, { memo } from "react";
import { VF } from "@src/dsl/VF";
import FormPage from "@src/pages/common/formPage";
import { IApproverSettings } from "@src/workflow-editor/classes/vlife";
import { FormVo } from "@src/api/Form";

export const AuditPanel = memo(
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
          VF.then("nodeType").value("audit"),
          VF.then(
            "joinType",
            "emptyPass",
            "handleType",
            "nodeType",
            "addSign",
            "rollback",
            "rejected",
            "auditLevel"
          ).hide(),
          VF.field("handleType").default("general"),
          VF.field("handleType")
            .eq("general")
            .then("auditList")
            .show()
            .title("负责人"),
          VF.field("fields").default(
            props?.formVo?.fields
              .filter((f) => f.x_hidden !== true)
              .map((f) => {
                return {
                  title: f.title,
                  fieldName: f.fieldName,
                  access: "Writeable",
                };
              })
          ),
        ]}
      />
    );
  }
);
