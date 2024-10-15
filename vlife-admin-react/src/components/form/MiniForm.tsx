import React, { useEffect, useState } from "react";
import { ISelect, VfBaseProps } from "@src/dsl/component";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import {
  IconDeleteStroked,
  IconMenu,
  IconCopyAdd,
  IconEdit2Stroked,
} from "@douyinfe/semi-icons";
import { Button, Popover, Select } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { useUpdateEffect } from "ahooks";
import FormPage from "@src/pages/common/formPage";
import { VF } from "@src/dsl/VF";

interface SortableItemProps {
  data: any; //数据
  entityType?: string; //实体模型
  labelFieldName: string;
  onRemove: () => void;
  onDataChange: (d: any) => void;
  read?: boolean;
  vf?: VF[]; //设置
}
//mini表单项
const SortableItem = SortableElement<SortableItemProps>(
  ({
    data,
    labelFieldName,
    onRemove,
    entityType,
    read,
    onDataChange,
    vf,
  }: SortableItemProps) => {
    const DragHandle = SortableHandle(() => (
      <IconMenu className="cursor-move  font-thin items-center" />
    ));
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState();

    useEffect(() => {
      setFormData(data);
    }, [data]);

    const handleVisibleChange = (visible: boolean) => {
      setVisible(visible);
    };

    return (
      <div
        style={{
          zIndex: "2000",
        }}
        className={`w-full font-normal text-sm group  p-2 flex justify-between border rounded border-gray-300  hover:border-blue-500 

  `}
      >
        <div>{data[labelFieldName]}</div>
        <div className=" items-center space-x-1 hidden group-hover:block">
          {/* 编辑 */}
          {read !== true && entityType && (
            <Popover
              // trigger="custom"
              trigger="click"
              visible={visible}
              onVisibleChange={handleVisibleChange}
              content={
                <div className=" p-4 w-56">
                  <FormPage
                    vf={vf}
                    type={entityType}
                    terse={true}
                    formData={formData}
                    onDataChange={setFormData}
                  />
                  <div className=" flex justify-end space-x-1">
                    <Button
                      onClick={() => {
                        setVisible(false);
                        setFormData(data);
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      theme="solid"
                      onClick={() => {
                        setVisible(false);
                        onDataChange(formData);
                      }}
                      type="primary"
                    >
                      确定
                    </Button>
                  </div>
                </div>
              }
              // clickToHide={true}
              position={"bottomLeft"}
            >
              <IconEdit2Stroked
                onClick={() => {
                  setVisible(true);
                }}
                className=" cursor-pointer font-thin "
              />
            </Popover>
          )}
          {/* 移动 */}
          <DragHandle />
          {/* 删除 */}
          <IconDeleteStroked
            onClick={onRemove}
            className=" cursor-pointer font-thin "
          />
        </div>
      </div>
    );
  }
);

interface SortableListProps {
  items: any[]; //已经设置全量数据
  labelFieldName: string; //展示的关键字段
  entityType?: string; //实体模型
  onRemove: (items: any[]) => void;
  onDataChange: (items: any[]) => void;
  vf?: VF[]; //设置
}
//可排序的列表容器
const SortableList = SortableContainer<SortableListProps>(
  ({
    items,
    labelFieldName,
    entityType,
    onRemove,
    onDataChange,
    ...props
  }: SortableListProps) => {
    return (
      <div className=" space-y-1">
        {items?.map((item: any, index: number) => (
          <SortableItem
            onDataChange={(d: any) => {
              onDataChange(
                items.map((item, i) => {
                  return i === index ? d : item;
                })
              );
            }}
            entityType={entityType}
            labelFieldName={labelFieldName}
            onRemove={() => {
              const newItems = [...items];
              newItems.splice(index, 1);
              onRemove(newItems);
              // onRemove({ oldIndex: index, newIndex: newItems.length });
            }}
            key={`item-${index}`}
            index={index}
            data={item}
            {...props}
          />
        ))}
      </div>
    );
  }
);

export interface MiniFormListProps extends VfBaseProps<any[]> {
  labelFieldName: string; //主要view字段
  valueFieldName: string; //主要意义字段
  sortFieldName: string; //排序字段
  max?: number; //指定数量|true或者不限数量(能够添加列表表单的数量)
  options: ISelect[]; //快速选择字段范围的来源
}
/**
 * 只选则一个字段就能完成表单数值快速创建的表单列表组
 * 可实现选项和选项值的内容赋值给当前表单的labelFieldName和valueFieldName字段
 */
export default ({
  value,
  fieldInfo,
  options,
  labelFieldName,
  valueFieldName,
  vf,
  max,
  onDataChange,
}: MiniFormListProps) => {
  //当前操作的数据信息
  const [items, setItems] = useState<any[]>(value || []);
  useEffect(() => {
    setItems((items) => value || []);
  }, [JSON.stringify(value)]);
  //数据回调返回
  useUpdateEffect(() => {
    onDataChange && onDataChange(items);
  }, [items]);
  //数组排序
  const onSortEnd = ({
    oldIndex, //拖拽元素原位置
    newIndex, //拖拽元素新位置
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    setItems((prevItems) => {
      const newItems = [...prevItems]; //当前元素
      const [removed] = newItems.splice(oldIndex, 1); //删除的元素
      newItems.splice(newIndex, 0, removed); //删除的元素放置在新位置
      return newItems;
    });
  };
  //添加按钮
  const triggerRender = ({ value }: any) => {
    return (
      <div
        className={` w-full space-x-1 p-2 flex items-center justify-center  border border-dashed rounded 
        ${classNames({
          "cursor-pointer  border-gray-300  hover:border-gray-400 hover:bg-gray-100":
            items?.length < options?.length ||
            items === undefined ||
            items === null ||
            items.length === 0,

          " cursor-not-allowed border-gray-300 bg-gray-50 text-gray-300":
            items?.length >= options?.length || (max && items?.length >= max),
        })}
         
      `}
      >
        <IconCopyAdd />
        <span> 添加{fieldInfo?.title}</span>
      </div>
    );
  };

  return (
    <div className=" space-y-1">
      {/* 可排序的表单列表 */}
      <SortableList
        vf={vf}
        labelFieldName={labelFieldName}
        items={items}
        onDataChange={(data: any) => {
          setItems(data);
        }}
        onSortEnd={onSortEnd}
        entityType={fieldInfo?.entityType || fieldInfo?.fieldType}
        onRemove={setItems}
        useDragHandle={true}
      />
      <Select
        className=" w-full"
        disabled={
          items?.length >= options?.length ||
          (max && items?.length >= max) ||
          false
        }
        value={items?.map((item) => {
          return item[valueFieldName];
        })}
        triggerRender={triggerRender}
        optionList={
          max === undefined ||
          items === null ||
          items === undefined ||
          items.length < max
            ? options?.filter((o) =>
                items && items.length > 0
                  ? !items.map((d) => d[valueFieldName]).includes(o.value)
                  : true
              )
            : []
        }
        onChange={(value: any) => {
          setItems((items) => {
            return value.map((v: string) => {
              const selected = options.filter((o) => o.value === v)[0];
              const existNum = items
                ?.map((item) => item[valueFieldName])
                .indexOf(v);

              if (existNum === -1 || existNum === undefined) {
                return {
                  [labelFieldName]: selected.label,
                  [valueFieldName]: selected.value,
                };
              } else {
                console.log(items, existNum);
                return items[existNum];
              }
            });
          });
        }}
        multiple
      />
    </div>
  );
};
