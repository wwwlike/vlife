import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag } from "@douyinfe/semi-ui";
import { ColumnProps, RowSelection } from "@douyinfe/semi-ui/lib/es/table";
import { useAuth } from "@src/context/auth-context";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { formatDate, safeStr } from "@src/util/func";
import VfImage from "@src/components/VfImage";
import SelectIcon from "@src/components/SelectIcon";
import { IconStoryStroked } from "@douyinfe/semi-icons";
import ColumnTitle from "./component/ColumnTitle";
import { orderObj } from "@src/pages/common/orderPage";
import BtnToolBar from "./component/BtnToolBar";
import { where } from "@src/dsl/base";
import { VFBtn } from "./types";

const formatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
});
export interface ListProps<T extends IdBean> {
  className?: string;
  columnSearch?: boolean; //列头搜索
  width?: number; //列表宽度（通过外围屏幕宽度减去 搜索宽度）
  model: FormVo; //模型信息
  selected?: T[];
  column?: string[]; // 手工传入要显示的列,配置设置的无效
  fkMap?: any; //外键数据的键值队
  parentMap?: any; //上级单位的键值队
  select_more?: boolean; //能否选择多选 undefined|false|true ->无勾选框|单选|多选
  checkedBottomShow?: boolean; //选中的数据是否在列表下方展示
  ignores?: string[]; //列表需要忽略不展示的字段
  read?: boolean; //当前页面的只读模式
  outSelectedColumn?: string; //外部选中的列
  onSelected?: (selecteds: T[]) => void; //选中后的回调事件
  onLineClick?: (obj: T) => void; //行点击事件触发
  onColumnSort?: (orderObj: orderObj) => void;
  dataSource?: IdBean[];
  btns: VFBtn[];
  height?: number;
  pagination?: any;
  wheres?: Partial<where>[]; //按钮的过滤条件
  onColumnFilter?: (wheres: Partial<where>[]) => void;
}

const TableIndex = <T extends IdBean>({
  onLineClick,
  className,
  width,
  model,
  dataSource,
  fkMap,
  columnSearch = true,
  column,
  parentMap,
  select_more,
  read = false,
  ignores = [],
  onSelected,
  onColumnFilter,
  selected,
  checkedBottomShow,
  onColumnSort,
  outSelectedColumn,
  btns,
  height,
  pagination,
  wheres = [],
  ...props
}: ListProps<T>) => {
  //字典集
  const { dicts } = useAuth();

  const btnWidth = useMemo((): number => {
    const filterBtns = btns.filter(
      (b) => b.actionType !== "create" && b.multiple !== true
    );
    //所有button标题字符串长度
    const titleStrLength = filterBtns
      .map((b) => b.title.length)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return titleStrLength > 0
      ? titleStrLength * 25 + titleStrLength * (12 - titleStrLength)
      : 0;
  }, [btns]);
  // 选中的行记录
  const [selectedRow, setSelectedRow] = useState<T[]>(selected || []);
  useEffect(() => {});
  // 选中的列
  const [selectedColumn, setSelectColumn] = useState<string>();
  useEffect(() => {
    if (outSelectedColumn) {
      setSelectColumn(outSelectedColumn);
    }
  }, [outSelectedColumn]);
  /**
   * 选中记录展示的label
   */
  const select_show_field = useMemo(() => {
    const field: FormFieldVo[] = model.fields;
    if (field.filter((f) => f.fieldName === "name").length > 0) return "name";
    if (field.filter((f) => f.fieldName === "label").length > 0) return "label";
    if (field.filter((f) => f.fieldName === "title").length > 0) return "title";
    return undefined;
  }, [model]);

  useEffect(() => {
    setSelectedRow(selected || []);
  }, [selected]);

  //列信息
  const memoColumns = useMemo((): ColumnProps<any>[] => {
    // step1 过滤要展示的列
    const columnshow: Partial<ColumnProps>[] = [];
    if (model && model.fields) {
      let temp: ColumnProps[] = [];
      //column->手工指定展示的列
      if (column) {
        model.fields
          .filter((f) => column.includes(f.fieldName))
          .forEach((d) => {
            temp.push({ ...d, dataIndex: d.fieldName, align: "center" });
          });
        columnshow.push(
          ...temp.sort(function (a: ColumnProps, b: ColumnProps) {
            if (a.dataIndex && b.dataIndex)
              return column.indexOf(a.dataIndex) - column.indexOf(b.dataIndex);
            else {
              return 0;
            }
          })
        );
      } else {
        const list = model.fields // 根据配置展示需要的列 是editor组件类型的列不展示
          .filter(
            (f) =>
              f.x_hidden !== true && //表单隐藏则列表页隐藏
              f.listShow !== false && //
              !ignores.includes(f.fieldName) &&
              f.x_component !== "VfEditor"
          )
          .sort((a, b) => a.listSort - b.listSort);

        // 已经占用的宽度(设置的宽度和+按钮组宽度)
        const usedWidth =
          list
            .filter((f) => f.listWidth !== undefined)
            .map((d) => d.listWidth)
            .reduce((acc, curr) => acc + curr, 0) + btnWidth;
        // 剩余字段根据字段类型至少需要的宽度
        const fieldDefaultWidthObj = {
          string: 150,
          boolean: 150,
          number: 150,
          date: 150,
        };
        const usableWidth = (width || 1200) - usedWidth - 100; // -100是减去边距和checkbox
        const requiredWidth = list
          .filter((f) => f.listWidth === undefined || f.listWidth === null)
          .map((d) => fieldDefaultWidthObj[d.fieldType])
          .reduce((acc, curr) => acc + curr, 0);
        //剩余每个字段能被分配的宽度
        let avgAddWidth = 0;
        if (requiredWidth < usableWidth) {
          avgAddWidth = (usableWidth - requiredWidth) / list.length;
        }
        //宽度分配逻辑
        //多余宽度计算方式：可用宽度(usableWidth)- 没有分配宽度字段类型所应该占用的宽度
        //多余宽度>0，则把宽度平均分配给每个列表字段
        list.forEach((f) => {
          columnshow.push({
            ...f,
            title: (
              <ColumnTitle
                columnSearch={columnSearch}
                entityName={model.entityType}
                option={f.dictCode ? dicts[f.dictCode].data : undefined}
                field={f}
                where={wheres?.filter((w) => w.fieldId === f.id)}
                onFilter={(where: Partial<where>[] | void) => {
                  if (onColumnFilter) {
                    if (where) {
                      onColumnFilter([
                        ...wheres.filter((t) => t.fieldId !== f.id),
                        ...where,
                      ]);
                    } else {
                      onColumnFilter(wheres.filter((t) => t.fieldId !== f.id));
                    }
                  }
                }}
                onSort={(data: orderObj) => {
                  if (onColumnSort) {
                    onColumnSort(data);
                  }
                }}
              />
            ),
            width: f.listWidth
              ? f.listWidth + avgAddWidth
              : fieldDefaultWidthObj[f.fieldType] + avgAddWidth,
            dataIndex: f.fieldName,
            align: f.listAlign ? f.listAlign : "center",
            className: `${
              selectedColumn === f.fieldName ? "bg-blue-200" : ""
            } `,
          });
        });
      }
      //字典Boolean外键Pcode需要转换处理
      columnshow?.forEach((m: Partial<ColumnProps>, index: number) => {
        // if (columnshow.length > 10) {
        //   if (index < 4) {
        //     m.fixed = true;
        //   }
        // }
        m.ellipsis = true; //单元格缩略
        if (m.dictCode) {
          const dictCode = m.dictCode;
          m["render"] = (text, record, index) => {
            if (text === "" || text === null || text === undefined) {
              return "-";
            }
            return dicts[dictCode || "vlife"] &&
              dicts[dictCode || "vlife"].data ? (
              dicts[dictCode || "vlife"].data?.filter(
                (d) => d.value + "" === text + ""
              ).length > 0 ? (
                dicts[dictCode || "vlife"].data?.filter(
                  (d) => d.value + "" === text + ""
                )[0].color ? (
                  <Tag
                    color={
                      dicts[dictCode || "vlife"].data?.filter(
                        (d) => d.value + "" === text + ""
                      )[0].color
                    }
                  >
                    {
                      dicts[dictCode || "vlife"].data?.filter(
                        (d) => d.value + "" === text + ""
                      )[0].label
                    }
                  </Tag>
                ) : (
                  dicts[dictCode || "vlife"].data?.filter(
                    (d) => d.value + "" === text + ""
                  )[0].label
                )
              ) : (
                "-"
              )
            ) : (
              "-"
            );
          };
        } else if (m.fieldType === "boolean") {
          m["render"] = (text, record, index) => {
            return text === null ? "-" : text ? <IconStoryStroked /> : "";
          };
        } else if (m.entityFieldName === "id" && fkMap) {
          m["render"] = (text, record, index) => {
            return fkMap[text];
          };
        } else if (m.fieldName === "pcode" && parentMap) {
          m["render"] = (text, record, index) => {
            return parentMap[text];
          };
        } else if (m.fieldType === "date") {
          m["render"] = (text, record, index) => {
            return formatDate(text, "yyyy-MM-dd");
          };
        } else if (m.fieldType === "number") {
          //数值型处理
          m["render"] = (text, record, index) => {
            return m.money ? formatter.format(text) : text;
          };
        } else if (m.safeStr) {
          m["render"] = (text, record, index) => {
            return safeStr(text);
          };
        }
      });
      // 图标，图像组件转换
      columnshow?.forEach((m: Partial<ColumnProps>) => {
        if (m.x_component === "VfImage") {
          m["render"] = (text, record, index) => {
            return (
              <VfImage
                size="small"
                value={text}
                read={true}
                onDataChange={() => {}}
                fieldName={""}
              />
            );
          };
        } else if (m.x_component === "SelectIcon") {
          m["render"] = (text, record, index) => {
            return <SelectIcon value={text} read={true} />;
          };
        }
      });
      //行按钮添加
      if (read !== true && btnWidth > 0) {
        columnshow?.push({
          title: "操作",
          align: "center",
          fixed: "right",
          fieldName: "operate",
          width: `${btnWidth}px`,
          render: (text, record, index) => {
            return (
              <BtnToolBar
                key={"lineBtn"}
                onDataChange={() => {}}
                position="tableLine"
                line={index}
                btns={btns}
                datas={[{ ...record, tableSort: index }]}
                {...props}
              />
            );
          },
        });
      }
      return columnshow;
    }
    return [];
  }, [model, column, fkMap, btns, dataSource, read, selectedColumn]);

  const onRow = useMemo(
    () => (record: any, index: any) => {
      // 给偶数行设置斑马纹
      if (index % 2 === 1) {
        return {
          style: {
            // background: "var(--semi-color-fill-0)",
            background: "#f9fafc",
          },
          onClick: (e: any) => {
            if (onLineClick) {
              onLineClick(record);
            }
          },
        };
      } else {
        return {
          onClick: (e: any) => {
            if (onLineClick) {
              onLineClick(record);
            }
          },
        };
      }
    },
    []
  );

  /**
   * 行头选中组件结构
   */
  const rowSelection = useMemo((): RowSelection<any> => {
    return {
      disabled: !select_more, //全局选中按钮
      selectedRowKeys: selectedRow.map((s, index) => s.id),
      onSelect: (record: any, selected: any) => {
        if (select_more == false) {
          if (selected == true) {
            setSelectedRow([record]);
            if (onSelected) {
              onSelected([record]);
            }
          } else {
            setSelectedRow([]);
            if (onSelected) {
              onSelected([]);
            }
          }
        }
      },
      onChange: (
        selectedRowKeys: (string | number)[] | undefined,
        selectedRows: any[] | undefined
      ) => {
        if (select_more) {
          if (selectedRows) {
            setSelectedRow([
              ...selectedRows.map((row) => {
                return row;
              }),
            ]);
            if (onSelected) {
              onSelected([
                ...selectedRows.map((row) => {
                  return row;
                }),
              ]);
            }
          }
        }
      },
    };
  }, [selectedRow]);

  const handleRow = (record: any, index: any) => {
    // 给偶数行设置斑马纹
    if (index % 2 === 0) {
      return {
        style: {
          background: "var(--semi-color-fill-0)",
        },
      };
    } else {
      return {};
    }
  };
  return (
    <>
      <Table
        className={`${className} relative `}
        showHeader={true}
        scroll={{ y: height }}
        // style={{ lineHeight: "24px" }}
        style={{
          width: `${width}px`, //设置宽度方便横向滚动条展示
          display: `block` /* 让表格以块级元素显示，使高度属性生效 */,
          overflow: `auto` /* 添加滚动条，以便在表格内容溢出时可以滚动查看 */,
        }}
        bordered={true}
        rowKey={"id"}
        dataSource={dataSource}
        columns={memoColumns}
        onRow={onRow}
        size="middle"
        rowSelection={
          read === true || select_more === undefined ? undefined : rowSelection
        }
        pagination={pagination ? pagination : false}
        {...props}
      />
      {/* 是否底部展示选中的数据项 */}
      {select_show_field && checkedBottomShow && (
        <div className=" space-x-2">
          {selectedRow.map((one: any) => {
            return (
              <Tag
                key={one.id}
                avatarShape="circle"
                size="large"
                closable={true}
                onClose={() => {
                  setSelectedRow([
                    ...selectedRow.filter((row) => {
                      return row.id !== one.id;
                    }),
                  ]);
                }}
              >
                {one[select_show_field]}
              </Tag>
            );
          })}
        </div>
      )}
    </>
  );
};
export default TableIndex;
