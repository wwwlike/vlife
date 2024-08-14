/**
 * 支持嵌套的查询设计器（未启用）
 */
import React, { ReactNode, useEffect } from "react";
import { Banner } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { VfBaseProps } from "@src/dsl/component";
import { useState } from "react";
import Design from "./component/QueryBuilderDesign";
import { FormItemCondition } from "@src/dsl/base";

// 将string 转换成 formItemCondition
export interface QueryBuilderProps extends Partial<VfBaseProps<string>> {
  isRoot?: boolean;
  mode?: "simple" | "complex";
  datas: string; //模型id
  // 嵌入的删除btn
  children?: ReactNode;
  //实体模型标识
  type?: string;
}

/**
 * 复杂的查询条件
 */
const QueryBuilder = ({
  onDataChange,
  value,
  datas, //模型id
  isRoot = true,
  type,
  formData,
  mode,
  className,
  style,
  children,
}: QueryBuilderProps) => {
  /**
   * 设置的
   */
  const [conditions, setConditions] = useState<Partial<FormItemCondition>>(
    value ? JSON.parse(value) : {}
  );
  const { getFormInfo } = useAuth();
  // 模型信息(待转成formVO)
  const [modelInfo, setModelInfo] = useState<FormVo>();

  useEffect(() => {
    if (datas || type) {
      getFormInfo({ id: datas, type: type }).then((data) => {
        setModelInfo(data);
      });
    }
  }, [datas || type]);

  return (
    <div className={className} style={style}>
      {modelInfo ? (
        <Design
          key={datas}
          root={isRoot}
          mode={mode}
          datas={modelInfo}
          onDataChange={(data) => {
            if (onDataChange) {
              if (data && data !== null) {
                onDataChange(JSON.stringify(data));
              } else {
                onDataChange(undefined);
              }
            }
          }}
          formData={formData}
          remove={children}
          condition={conditions}
        />
      ) : (
        <>
          <Banner type="warning" description="请先选择需要创建视图的数据集" />
        </>
      )}
    </div>
  );
};

export default QueryBuilder;
