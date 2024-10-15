import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag } from "@douyinfe/semi-ui";
import { ColumnProps, RowSelection } from "@douyinfe/semi-ui/lib/es/table";
import { useAuth } from "@src/context/auth-context";
import { DbEntity } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { formatDate, safeStr } from "@src/util/func";
import VfImage from "@src/components/VfImage";
import SelectIcon from "@src/components/SelectIcon";
import ColumnTitle from "./component/ColumnTitle";
import { orderObj } from "@src/pages/common/orderPage";
import { numberFiledType, where } from "@src/dsl/base";
import classNames from "classnames";
import { RecordFlowInfo } from "@src/api/workflow/Flow";
import { useUpdateEffect } from "ahooks";
import BtnResourcesToolBar from "../button/component/BtnResourcesToolBar";
import { VFBtn } from "../button/types";

const formatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
});
export interface ListProps<T extends TableBean> {
  className?: string;
  columnTitle?: "search" | "sort" | true | false; //列头展示形式
  width?: number; //列表宽度（通过外围屏幕宽度减去 搜索宽度）
  model: FormVo; //列表list的模型信息
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
  onFieldClick?: { [fieldName: string]: (data: any) => void }; //列表指定key字段点击后触发的事件
  onColumnSort?: (orderObj: orderObj) => void;
  dataSource?: T[];
  queryFunc?: () => void; //列表数据查询
  btns: VFBtn[];
  activeKey?: string; //场景key
  height?: number;
  pagination?: any;
  wheres?: Partial<where>[]; //按钮的过滤条件
  flowFormType?: string; //是工作流table(和按钮相关)
  onColumnFilter?: (wheres: Partial<where>[]) => void;
}
export interface TableBean extends DbEntity {
  activeKey?: string; //场景key
  flow?: RecordFlowInfo; //流程信息
}

const TableIndex = <T extends TableBean>({
  onLineClick,
  className,
  width,
  model,
  dataSource,
  fkMap,
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
  onFieldClick,
  outSelectedColumn,
  btns,
  height,
  queryFunc,
  activeKey,
  pagination,
  flowFormType,
  wheres = [],
  ...props
}: ListProps<T>) => {
  const [_dataSource, setDataSource] = useState<T[]>();
  const { user } = useAuth();

  useEffect(() => {
    setDataSource(dataSource);
  }, [dataSource]);

  //字典集
  const { dicts } = useAuth();
  // const [lineBtnMax, setListBtnMax] = useState<number>(0);

  const btnWidth = useMemo((): number => {
    const titleTotalLength = btns
      .map((b) => b.title?.length || 2)
      .reduce((acc, curr) => acc + curr, 0);

    return (
      titleTotalLength * 18 + 40 + (user?.superUser ? btns.length * 20 : 0)
    );
  }, [btns]);
  // 选中的行记录
  const [selectedRow, setSelectedRow] = useState<T[]>([]);
  useEffect(() => {});
  // 选中的列
  const [selectedColumn, setSelectColumn] = useState<string>();

  useEffect(() => {
    if (outSelectedColumn) {
      setSelectColumn(outSelectedColumn);
    }
  }, [outSelectedColumn]);

  useEffect(() => {
    setSelectedRow(selected || []);
  }, [selected]);
  /**
   * 
  /**
   * 选中记录展示的label
   */
  const select_show_field = useMemo(() => {
    const field: FormFieldVo[] = model.fields;
    if (field?.filter((f) => f.fieldName === "name").length > 0) return "name";
    if (field?.filter((f) => f.fieldName === "label").length > 0)
      return "label";
    if (field?.filter((f) => f.fieldName === "title").length > 0)
      return "title";
    return undefined;
  }, [model]);

  useUpdateEffect(() => {
    onSelected?.(selectedRow);
  }, [selectedRow]);

  // useUpdateEffect

  //列信息
  const memoColumns = useMemo((): ColumnProps<any>[] => {
    // step1 过滤要展示的列
    const columnshow: Partial<ColumnProps>[] = [];
    if (model && model.fields) {
      let temp: ColumnProps[] = [];
      if (column) {
        //指定列展示
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
        //根据配置展示
        const list = model.fields
          .filter(
            (f) =>
              f.listHide !== true &&
              !ignores.includes(f.fieldName) &&
              f.fieldName !== "id" &&
              f.x_component !== "VfEditor" &&
              f.dataType !== "array"
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
                entityName={model.entityType}
                option={
                  f.dictCode
                    ? dicts[f.dictCode]?.data
                    : f.fieldType === "boolean"
                    ? [
                        { label: "是", value: true },
                        { label: "否", value: false },
                      ]
                    : []
                }
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
        if (onFieldClick && m.dataIndex && onFieldClick[m?.dataIndex]) {
          m["render"] = (text, record, index) => {
            return (
              <a
                className="hover:underline text-blue-600 cursor-pointer"
                onClick={() =>
                  m.entityFieldName === "id" && fkMap
                    ? onFieldClick[m.dataIndex || ""](fkMap[text])
                    : onFieldClick[m.dataIndex || ""](record)
                }
              >
                {m.entityFieldName === "id" && fkMap
                  ? fkMap[text]?.name || fkMap[text]?.title || fkMap[text]?.no
                  : text}
              </a>
            );
          };
        } else if (m.dictCode) {
          const dictCode = m.dictCode;
          m["render"] = (text, record, index) => {
            if (text === "" || text === null || text === undefined) {
              return "-";
            } else {
              const dict: {
                value: string | undefined;
                label: string;
                sys?: boolean;
                color: string;
              } = dicts[dictCode || "vlife"]?.data?.filter(
                (d) => d.value + "" === text + ""
              )?.[0];
              if (dict && dict.color) {
                return (
                  <span
                    className={`text-white  text-xs ${classNames({
                      [`bg-${dict.color}-500`]: dict.color !== undefined,
                    })} px-3 py-1 font-bold  rounded-lg`}
                  >
                    {dict.label}
                  </span>
                );
              } else if (dict) {
                return dict.label;
              } else {
                return text;
              }
            }
          };
        } else if (m.fieldType === "boolean") {
          m["render"] = (text, record, index) => {
            return text === null ? "-" : text ? `是` : "否";
          };
        } else if (m.entityFieldName === "id" && fkMap) {
          m["render"] = (text, record, index) => {
            return fkMap[text]?.name || fkMap[text]?.title || fkMap[text]?.no;
          };
        } else if (m.fieldName === "pcode" && parentMap) {
          m["render"] = (text, record, index) => {
            return parentMap[text];
          };
        } else if (m.fieldType === "date") {
          m["render"] = (text, record, index) => {
            if (typeof text === "number") {
              return formatDate(text, "yyyy/MM/dd");
            } else if (text) {
              var date = new Date(text);
              const dateStr = formatDate(date, "yyyy/MM/dd");
              return dateStr;
            }
          };
        } else if (numberFiledType.includes(m.fieldType)) {
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
              />
            );
          };
        } else if (m.x_component === "SelectIcon") {
          m["render"] = (text, record, index) => {
            return <SelectIcon value={text} read={true} />;
          };
        }
      });
      //行按钮添加,工作流不需要行级按钮
      if (flowFormType) {
        columnshow?.unshift({
          title: "审核阶段",
          // fixed: "left",
          width: 150,
          align: "center",
          // fixed: "right",
          fieldName: "operate",
          render: (text, record, index) => {
            return (
              <span
                className={` text-white  text-xs ${classNames({
                  "bg-green-500": record?.flow?.nodeType === "endEvent",
                  "bg-blue-500": record?.flow?.nodeType === "audit",
                  "bg-red-500": record?.flow?.nodeType === "approver",
                  "bg-yellow-500": record?.flow?.nodeType === "notifier",
                  "bg-gray-500": record?.flow?.nodeType === "start",
                  " bg-violet-500": record?.flow?.nodeType === null,
                })} px-3 py-1 font-bold  rounded-lg`}
              >
                {record?.flow?.processStage}
              </span>
            );
          },
        });
      } else if (
        read !== true &&
        model.flowJson === null &&
        btns.filter(
          (b) =>
            b.multiple !== true &&
            (b.actionType !== "create" || b.position === "tableLine") //如果是新增则必须是行按钮
        ).length !== 0
      ) {
        columnshow?.push({
          title: "操作",
          align: "center",
          fixed: "right",
          fieldName: "operate",
          width: btnWidth,
          render: (text, record, index) => {
            return (
              <BtnResourcesToolBar
                className=" flex items-center justify-center"
                btnConf={index === 0 && user?.superUser ? true : false} //第一行的按钮可配置
                entity={model.entityType}
                dataType={model.type}
                key={`lineBtn_${index}`}
                position="tableLine"
                line={index}
                btnType="link"
                activeKey={activeKey}
                btns={btns}
                datas={[{ ...record, tableSort: index }]}
                {...props}
                onDataChange={(r: any) => {
                  if (r) {
                    if (typeof r === "number" || typeof r === "boolean") {
                      if (queryFunc) queryFunc();
                    } else {
                      //数据替换(必须是同一个type模型)
                      setDataSource((d: any) =>
                        d.map((dd: any) => (dd.id === r.id ? r : dd))
                      );
                    }
                  } else {
                  }
                  //无数据返回则刷新页面
                }}
              />
            );
          },
        });
      }
      return columnshow;
    }
    return [];
  }, [model, column, fkMap, btns, _dataSource, read, selectedColumn, btnWidth]);

  const onRow = useMemo(
    () => (record: any, index: any) => {
      return {
        style: index % 2 === 1 ? { background: "#f9fafc" } : {}, // 给偶数行设置斑马纹
        onClick: (e: any) => {
          onLineClick && onLineClick(record);
        },
      };
    },
    [model]
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
            // setSelectedRow([]);
            // if (onSelected) {
            //   onSelected([]);
            // }
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
            // if (onSelected) {
            //   onSelected([
            //     ...selectedRows.map((row) => {
            //       return row;
            //     }),
            //   ]);
            // }
          }
        }
      },
    };
  }, [selectedRow]);

  return (
    <>
      <Table
        className={`${className}  `}
        showHeader={true}
        scroll={{ y: height }}
        resizable={true}
        // style={{ lineHeight: "24px" }}
        style={{
          width: `${width}px`, //设置宽度方便横向滚动条展示
          display: `block` /* 让表格以块级元素显示，使高度属性生效 */,
          overflow: `auto` /* 添加滚动条，以便在表格内容溢出时可以滚动查看 */,
        }}
        bordered={true}
        rowKey={"id"}
        dataSource={_dataSource}
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
