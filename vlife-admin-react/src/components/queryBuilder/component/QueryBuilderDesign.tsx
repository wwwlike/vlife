import React, { ReactNode } from "react";
import {
  IconCopyAdd,
  IconDeleteStroked,
  IconPlusStroked,
} from "@douyinfe/semi-icons";
import { Button, Divider, Select, Space } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import classNames from "classnames";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import Scrollbars from "react-custom-scrollbars";

import Compare from "./Compare";
import QueryBuilder from "../indexFull";
import { andOr, FormItemCondition, where } from "@src/dsl/base";

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
  /** 所在表单的整体数据 */
  formData: any;
  /**
   *  展示模式 简单|完成
   */
  mode?: "simple" | "complex";
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
  formData,
  mode = "complex", //simple模式下
}: QueryDesignProps) => {
  const [pageCondition, setPageCondition] = useState<
    Partial<FormItemCondition>
  >(
    condition === null ||
      condition === undefined ||
      JSON.stringify(condition) === "{}"
      ? { orAnd: "and", where: [{}], conditions: [] }
      : condition
  );

  useEffect(() => {
    onDataChange(pageCondition);
  }, [pageCondition]);

  const addWhere = useCallback(
    (isRoot: boolean) => {
      const w: Partial<where> = {};
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
    [JSON.stringify(pageCondition.where)]
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
    <div className="p-1 max-h-96" style={{ width: "100%", padding: "1px" }}>
      <div className="flex ">
        <div key="button" style={{ width: "100%", display: "flex" }}>
          <Space>
            {mode === "complex" && (
              <Select
                placeholder="组合方式"
                style={{ width: "130px" }}
                value={pageCondition.orAnd ? pageCondition.orAnd : "and"}
                onChange={(data) => {
                  setPageCondition({ ...pageCondition, orAnd: data as andOr });
                }}
                optionList={[
                  { label: "或", value: "or" },
                  { label: "且", value: "and" },
                ]}
              ></Select>
            )}

            <Button
              icon={<IconPlusStroked />}
              disabled={!datas}
              onClick={() => addWhere(root)}
            >
              查询条件
            </Button>
            {mode === "complex" && (
              <Button
                icon={<IconCopyAdd />}
                disabled={!datas}
                onClick={addSubCondition}
              >
                分组
              </Button>
            )}

            {/* <Button
              icon={<IconDeleteStroked />}
              disabled={!datas}
              onClick={() => {
                setPageCondition({ orAnd: "and", where: [{}], conditions: [] });
              }}
            >
              清空
            </Button> */}
          </Space>
        </div>
        <div>{remove}</div>
      </div>

      <div
        className={classNames(
          pageCondition &&
            ((pageCondition.where && pageCondition.where.length > 0) ||
              (pageCondition.conditions && pageCondition.conditions.length > 0))
            ? "pb-2 pt-1 px-2 mt-2 border rounded"
            : ""
        )}
      >
        <Scrollbars
          className="w-full"
          style={{
            height:
              (pageCondition.where && pageCondition.where.length > 0) ||
              (pageCondition.conditions && pageCondition.conditions.length > 0)
                ? root
                  ? 400
                  : 250
                : 0,
          }}
        >
          {/* 查询条件 */}
          {datas &&
            pageCondition &&
            pageCondition.where &&
            pageCondition.where.map((w, index) => {
              return (
                <>
                  <Space
                    className="p-1 "
                    key={"where_" + index}
                    style={{ width: "100%", display: "flex", marginTop: "1px" }}
                  >
                    <div className=" text-blue-500 font-bold ">
                      {index + 1 + "."}
                    </div>
                    {/* 抽出成组件compare比对组件*/}
                    <Compare
                      key={w.fieldName || "" + index}
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
                    />
                    {pageCondition.where && (
                      <Button
                        className=" mr-8"
                        icon={<IconDeleteStroked />}
                        type="danger"
                        onClick={() => removeWhere(index)}
                      ></Button>
                    )}
                  </Space>
                  <Divider dashed></Divider>
                </>
              );
            })}
          {/* 递归新增的同级分组条件块 */}
          {mode === "complex" &&
            pageCondition &&
            pageCondition.conditions &&
            pageCondition.conditions.map((w, index) => {
              return (
                <div
                  key={"condition_div_" + index}
                  className="pt-1"
                  style={{ width: "100%" }}
                >
                  <QueryBuilder
                    isRoot={false}
                    value={JSON.stringify(w)}
                    datas={datas.id}
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
                              return thisIndex === index
                                ? JSON.parse(data)
                                : co;
                            }
                          ),
                        });
                      }
                    }}
                  >
                    <Button
                      type="danger"
                      icon={<IconDeleteStroked />}
                      onClick={() => removeCondition(index)}
                    />
                  </QueryBuilder>
                </div>
              );
            })}
        </Scrollbars>
      </div>
    </div>
  );
};
