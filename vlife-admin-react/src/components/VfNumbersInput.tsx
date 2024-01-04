import React, { useEffect, useState } from "react";
import { InputNumber } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/component";
export default ({ value, onDataChange }: VfBaseProps<any[]>) => {
  const [begin, setBegin] = useState<number | undefined>(
    value && value.length > 0 ? value[0] : undefined
  );
  const [end, setEnd] = useState<number | undefined>(
    value && value.length > 1 ? value[1] : undefined
  );

  useEffect(() => {
    onDataChange([begin, end]);
  }, [begin, end]);

  return (
    <div className="flex">
      <InputNumber
        showClear={true}
        onClear={() => {
          setBegin(undefined);
        }}
        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\￥\s?|(,*)/g, "")}
        value={begin}
        onNumberChange={(v) => {
          setBegin(v);
        }}
      />
      -
      <InputNumber
        showClear={true}
        onClear={() => {
          setEnd(undefined);
        }}
        value={end}
        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\￥\s?|(,*)/g, "")}
        onNumberChange={(v) => {
          setEnd(v);
        }}
      />
    </div>
  );
};
