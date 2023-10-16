import React, { useEffect, useState } from "react";
import { InputNumber } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/schema/component";
interface VfNumbersInputProps extends VfBaseProps<any[], undefined> {}
export default ({ value, onDataChange }: VfNumbersInputProps) => {
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
      {/* {JSON.stringify(value)} */}
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
