/**
 * 多对多选择组件
 */
import React, { useEffect, useState } from "react";
import { findName } from "@src/api/base/baseService";
import { DataType } from "@src/dsl/schema/base";
import { VfBaseProps } from "@src/dsl/schema/component";
import RelationTagInput from "./RelationTagInput";

interface ManySelectProps extends VfBaseProps<any[], null> {
  fkTypeName: string; //外键模型名称
}

const ManySelect = ({
  read,
  value,
  fkTypeName,
  onDataChange,
}: ManySelectProps) => {
  const [many, setMany] = useState<any[]>();

  useEffect(() => {
    if (value && value.length > 0 && fkTypeName) {
      findName({
        ids: value.map((v) => v[fkTypeName + "Id"]),
        entityType: fkTypeName,
      }).then((d) => {
        setMany(d.data || []);
      });
    } else {
      setMany([]);
    }
  }, [value, fkTypeName]);

  return (
    many && (
      <RelationTagInput
        value={many.map((m) => m.id)}
        datas={many}
        req={{}}
        fieldInfo={{
          entityType: fkTypeName,
          dataType: DataType.array,
        }}
        read={read}
        onDataChange={(ids: any) => {
          if (ids.length === 0) {
            onDataChange([]);
          } else {
            const entityFieldName = fkTypeName + "Id";
            const datas = ids.map((id: string, index: number) => {
              return { [entityFieldName]: id, sort: index + 1 };
            });
            if (value === null || value === undefined || value.length === 0) {
              onDataChange(datas);
            } else {
              onDataChange(
                datas.map((d: any) => {
                  const existObj = value.filter(
                    (v) => v[entityFieldName] === d[entityFieldName]
                  );
                  if (existObj && existObj.length > 0) {
                    return existObj[0];
                  } else {
                    return d;
                  }
                })
              );
            }
          }
        }}
      />
    )
  );
};
export default ManySelect;
