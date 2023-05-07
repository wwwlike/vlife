import { Button, Card, Select, Space } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import React, { ReactNode } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import QueryBuilder, { andOr, FormItemCondition, where } from "..";
import Compare from "./Compare";

export interface QueryDesignProps {
  /** 嵌套脚本对象 */
  condition: Partial<FormItemCondition>;
  /** 模型信息 */
  datas: FormVo;
  /** 当前是否根元素 */
  root: boolean;
  /** 当前组件信息 */
  onDataChange: (comp: Partial<FormItemCondition>) => void;
  /** 子组件，删除按钮 */
  remove: ReactNode;
}

/**
 * 递归的sql设计器
 */
export default ({
  condition,
  root,
  datas,
  onDataChange,
  remove,
}: QueryDesignProps) => {
  const [pageCondition, setPageCondition] = useState<
    Partial<FormItemCondition>
  >(
    condition === null || condition === undefined
      ? { where: [], conditions: [] }
      : condition
  );

  useEffect(() => {
    onDataChange(pageCondition);
  }, [pageCondition]);

  const addWhere = useCallback(
    (isRoot: boolean) => {
      const w: Partial<where<any>> = {};
      if (pageCondition.where)
        setPageCondition({
          ...pageCondition,
          where: [...pageCondition.where, {}],
        });
      else {
        setPageCondition({
          ...pageCondition,
          where: [{}],
        });
      }
    },
    [pageCondition]
  );

  const removeWhere = useCallback(
    (index: number) => {
      const exist: any[] | undefined = pageCondition?.where?.filter(
        (d, number) => {
          return number !== index;
        }
      );

      setPageCondition({
        ...pageCondition,
        where: exist ? [...exist] : [],
      });
    },
    [pageCondition]
  );

  const removeCondition = useCallback(
    (index: number) => {
      const exist = pageCondition?.conditions?.filter(
        (d, number) => number != index
      );
      setPageCondition({
        ...pageCondition,
        conditions: exist ? [...exist] : [],
      });
    },
    [pageCondition]
  );

  const addSubCondition = useCallback(() => {
    const w: Partial<FormItemCondition> = {};
    if (pageCondition.conditions) {
      setPageCondition({
        ...pageCondition,
        conditions: [...pageCondition.conditions, {}],
      });
    } else {
      setPageCondition({
        ...pageCondition,
        conditions: [{}],
      });
    }
  }, [pageCondition]);

  /**
   * 更新查询条件里指定索引记录的单个属性值
   */
  const updateWhere = useCallback(
    (attr: "value" | "opt" | "fieldName", index: number, newVal: any) => {
      setPageCondition({
        ...pageCondition,
        where: pageCondition?.where?.map((d, whereIndex) => {
          return whereIndex === index ? { ...d, [attr]: newVal } : d;
        }),
      });
    },
    [pageCondition]
  );

  return (
    <Card
      style={{ width: "100%" }}
      headerExtraContent={remove}
      title={
        <div key="button" style={{ width: "100%", display: "flex" }}>
          <Space>
            <Select
              placeholder="组合方式"
              style={{ width: "130px" }}
              value={pageCondition.orAnd}
              onChange={(data) => {
                setPageCondition({ ...pageCondition, orAnd: data as andOr });
              }}
              optionList={[
                { label: "或", value: "or" },
                { label: "且", value: "and" },
              ]}
            ></Select>
            <Button disabled={!datas} onClick={() => addWhere(root)}>
              添加规则
            </Button>
            <Button disabled={!datas} onClick={addSubCondition}>
              添加组
            </Button>
          </Space>
        </div>
      }
    >
      {/* 查询条件 */}
      {datas && pageCondition && pageCondition.where
        ? pageCondition.where.map((w, index) => {
            return (
              <Space
                key={"where_" + index}
                style={{ width: "100%", display: "flex", marginTop: "1px" }}
              >
                {/* 抽出成组件compare比对组件*/}
                <Compare
                  data={w}
                  form={datas}
                  onDataChange={(data) => {
                    setPageCondition({
                      ...pageCondition,
                      where: pageCondition?.where?.map((d, whereIndex) => {
                        return whereIndex === index ? data : d;
                      }),
                    });
                  }}
                ></Compare>
                <Button type="danger" onClick={() => removeWhere(index)}>
                  删除规则
                </Button>
              </Space>
            );
          })
        : ""}
      {/* 递归新增的同级分组条件块 */}
      {pageCondition && pageCondition.conditions
        ? pageCondition.conditions.map((w, index) => {
            return (
              <div key={"condition_div_" + index} style={{ width: "100%" }}>
                <QueryBuilder
                  isRoot={false}
                  pageCondition={w}
                  datas={datas.entityType}
                  onDataChange={(data) => {
                    if (data === null || data === undefined) {
                      setPageCondition({
                        ...pageCondition,
                        conditions: pageCondition?.conditions?.filter(
                          (co, thisIndex) => {
                            return thisIndex !== index;
                          }
                        ),
                      });
                    } else {
                      setPageCondition({
                        ...pageCondition,
                        conditions: pageCondition?.conditions?.map(
                          (co, thisIndex) => {
                            return thisIndex === index ? JSON.parse(data) : co;
                          }
                        ),
                      });
                    }
                  }}
                >
                  <Button type="danger" onClick={() => removeCondition(index)}>
                    删除组
                  </Button>
                </QueryBuilder>
              </div>
            );
          })
        : ""}
    </Card>
  );
};
