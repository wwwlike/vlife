import { Button, Select, Tag } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { FormFieldVo } from "@src/api/FormField";
import { useEffect, useMemo, useState } from "react";
import { IconPlus } from "@douyinfe/semi-icons";
import { useUpdateEffect } from "ahooks";
/**
 * 个人搜索条件设置
 * 1. 挑选3条
 */
export interface OrderPageProps {
  fields: FormFieldVo[]; //实体
  filterType: string; //搜索的条件
  onDataChange: (orders: string) => void;
}
type orderObj = { fieldName: string; sort: string | undefined };

const OrderPage = ({ fields, filterType, onDataChange }: OrderPageProps) => {
  const [orderList, setOrderList] = useState<orderObj[]>();
  useUpdateEffect(() => {
    if (orderList) {
      let localStr = "";
      orderList
        .filter((o) => o.sort !== undefined)
        .forEach((o) => {
          localStr = localStr === "" ? localStr : localStr + ",";
          localStr = localStr + o.fieldName;
          if (o.sort) {
            localStr = localStr + "_" + o.sort;
          }
        });
      localStorage.setItem("order_" + filterType, localStr);

      onDataChange(localStr);
    }
  }, [JSON.stringify(orderList)]);

  useEffect(() => {
    const localOrders = localStorage.getItem("order_" + filterType);
    if (localOrders) onDataChange(localOrders);
    if (localOrders) {
      // setOrders(localOrders);
      const localOrderList: orderObj[] = [];
      localOrders.split(",").forEach((str) => {
        const order = str.split("_");
        if (
          order.length >= 1 &&
          fields.map((f) => f.fieldName).includes(order[0])
        ) {
          localOrderList.push({
            fieldName: order[0],
            sort: order.length === 2 ? order[1] : undefined,
          });
        }
      });
      setOrderList(localOrderList);
    }
  }, []);

  const selectField = useMemo(() => {
    return fields.filter(
      (f) =>
        ((orderList &&
          orderList.length > 0 &&
          orderList.map((o) => o.fieldName).includes(f.fieldName) === false) ||
          orderList === undefined ||
          orderList === null ||
          orderList.length === 0) &&
        f.dataType === "basic" &&
        f.x_hidden !== true
    );
  }, [fields, orderList]);
  const [status, setStatus] = useState<boolean>(false);
  return (
    <div className=" relative  ">
      <div className="flex mb-4">
        <div className=" ">
          <Label>排序</Label>
          {orderList && orderList?.length >= 3 && <>(支持最多三项排序规则)</>}
        </div>

        {status === true &&
          ((orderList && orderList?.length < 3) || orderList === undefined) &&
          selectField.length > 0 && (
            <Select
              className=""
              placeholder="选字段并设排序方式"
              style={{ width: "70%" }}
              value=""
              onChange={(e) => {
                setOrderList(
                  orderList
                    ? [
                        ...orderList,
                        { fieldName: e as string, sort: undefined },
                      ]
                    : [{ fieldName: e as string, sort: undefined }]
                );
              }}
              optionList={selectField.map((f) => {
                return { label: f.title, value: f.fieldName };
              })}
            />
          )}

        {status === false &&
          ((orderList && orderList?.length < 3) || orderList === undefined) &&
          selectField.length > 0 && (
            <div className=" absolute right-4">
              <Button
                size="small"
                onClick={() => {
                  setStatus(true);
                }}
                icon={<IconPlus />}
              />
            </div>
          )}
      </div>

      {/* {status === false &&
        ((orderList && orderList?.length < 3) || orderList === undefined) && (
          <div className=" flex justify-end mb-4">
            <Label>排序</Label>
            <Button
              onClick={() => {
                setStatus(true);
              }}
              icon={<IconPlus />}
            />
          </div>
        )} */}
      {orderList?.map((o, index) => (
        <div className={"flex  "} key={`order${index}`}>
          <div>
            <Tag type="ghost" size="large">
              {fields.filter((f) => f.fieldName === o.fieldName)[0].title}
            </Tag>
          </div>
          <div className="flex w-full space-x-2 justify-end mb-2">
            <Tag
              size="large"
              type={o.sort === "asc" ? "solid" : "ghost"}
              onClick={() => {
                setOrderList(
                  orderList.map((order) =>
                    order.fieldName === o.fieldName
                      ? {
                          ...order,
                          sort:
                            o.sort === "desc" || o.sort === undefined
                              ? "asc"
                              : undefined,
                        }
                      : order
                  )
                );
              }}
            >
              ↑
            </Tag>
            <Tag
              size="large"
              type={o.sort === "desc" ? "solid" : "ghost"}
              onClick={() => {
                setOrderList(
                  orderList.map((order) =>
                    order.fieldName === o.fieldName
                      ? {
                          ...order,
                          sort:
                            o.sort === "asc" || o.sort === undefined
                              ? "desc"
                              : undefined,
                        }
                      : order
                  )
                );
              }}
            >
              ↓
            </Tag>
            <Tag
              size="large"
              type={"light"}
              onClick={() => {
                const list = orderList.filter(
                  (f) => f.fieldName !== o.fieldName
                );
                setOrderList(list);
                if (list.length === 0) {
                  setStatus(false);
                }
              }}
            >
              -
            </Tag>
            {/* {JSON.stringify(localStorage.getItem("order_" + filterType))} */}
          </div>
        </div>
      ))}
    </div>
  );
};
export default OrderPage;
