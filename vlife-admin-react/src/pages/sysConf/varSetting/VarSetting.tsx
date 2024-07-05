//系统设置
import React, { useMemo, useState } from "react";
import { SysVar, saveVals } from "@src/api/SysVar";
import Button from "@src/components/button";
import Form from "@src/components/form";

export default ({
  vars,
  className,
}: {
  vars: SysVar[];
  className?: string;
}) => {
  const fields = useMemo((): any => {
    return vars?.map((a) => {
      return {
        fieldName: a.varKey,
        title: a.name,
        "x-component": a.type,
        sort: a.sort,
      };
    });
  }, [vars]);

  const [formData, setFormData] = useState<any>(
    vars?.reduce((acc: { [key: string]: any }, curr: SysVar) => {
      acc[curr.varKey] = curr.val;
      return acc;
    }, {})
  );

  const saveData = useMemo(() => {
    return vars?.map((a) => {
      return { ...a, val: formData[a.varKey] };
    });
  }, [vars, formData]);
  return (
    <div className={className}>
      <div className="p-2 text-right">
        <Button
          title="保存"
          actionType="api"
          multiple={true}
          saveApi={saveVals}
          onSubmitFinish={() => {
            //页面刷新
            window.location.reload();
          }}
          datas={saveData}
        />
      </div>
      {fields && (
        <Form
          fontBold={true}
          // @ts-ignore
          modelInfo={{ fields: fields }}
          onDataChange={setFormData}
          formData={formData}
        />
      )}
    </div>
  );
};
