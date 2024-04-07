import { memo, useEffect, useState } from "react";
import QueryBuilder from "@src/components/queryBuilder";
import { FormVo } from "@src/api/Form";
import { ConditionGroup } from "@src/dsl/base";

export const ConditionPanel = memo(
  (props: {
    value?: ConditionGroup[];
    formVo?: FormVo;
    onChange: (value?: ConditionGroup[]) => void;
  }) => {
    const { formVo, value, onChange } = props;
    const [thisValue, setThisValue] = useState<ConditionGroup[] | undefined>(
      value
    );
    useEffect(() => {
      onChange(thisValue);
    }, [thisValue]);
    return (
      <>
        {formVo && (
          <QueryBuilder
            entityModel={formVo}
            value={JSON.stringify(thisValue) || ""}
            onDataChange={(s) => {
              setThisValue(JSON.parse(s));
            }}
          />
        )}
      </>
    );
  }
);
