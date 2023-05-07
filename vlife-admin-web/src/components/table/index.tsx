import { Space, Table, Tag } from "@douyinfe/semi-ui";
import {
  ColumnProps,
  RowSelection,
  TableProps,
} from "@douyinfe/semi-ui/lib/es/table";
import { useAuth } from "@src/context/auth-context";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { sourceType } from "@src/dsl/schema/base";
import { formatDate } from "@src/util/func";
import VfImage from "@src/components/VfImage";
import SelectIcon from "@src/components/SelectIcon";
import VlifeButton, { VFButtonPorps } from "@src/components/vlifeButton";
import { checkLineNumber, VfButton } from "@src/dsl/schema/button";

export interface ListProps<T extends IdBean> extends TableProps {
  className?: string;
  model: FormVo; //模型信息
  lineBtn?: VfButton<T>[]; //行按钮
  column?: string[]; // 手工传入要显示的列,配置设置的无效
  fkMap?: any; //外键数据的键值队
  parentMap?: any; //上级单位的键值队
  select_more?: boolean; //能否选择多选 undefined|false|true ->无勾选框|单选|多选
  checkedBottomShow?: boolean; //选中的数据是否在列表下方展示
  ignores?: string[]; //列表需要忽略不展示的字段
  read?: boolean; //当前页面的只读模式
  onSelected?: (selecteds: T[]) => void; //选中后的回调事件
  onLineClick?: (obj: T) => void; //行点击事件触发
}

const TableIndex = <T extends IdBean>({
  onLineClick,
  className,
  model,
  lineBtn,
  dataSource,
  fkMap,
  column,
  parentMap,
  select_more = true,
  read = false,
  ignores = [],
  onSelected,
  // selected,
  checkedBottomShow,
  children,
  ...props
}: ListProps<T>) => {
  //字典集
  const { dicts } = useAuth();
  // 选中的行记录
  const [selectedRow, setSelectedRow] = useState<T[]>([]);
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
    if (onSelected) {
      onSelected(selectedRow);
    }
  }, [selectedRow]);

  /**
   * 按钮状态检查
   */
  const btnCheck = useCallback(
    (item: VfButton<T>, ...record: T[]): Partial<VFButtonPorps> => {
      let checkResult: Partial<VFButtonPorps> = {};
      let msg: string | void = undefined;
      //1.长度校验
      if (item.enable_recordNum) {
        msg = checkLineNumber(item.enable_recordNum, ...record);
      }
      //2.对象match=>eq匹配校验,
      const matchObj: any = item.enable_match;
      if (matchObj) {
        Object.keys(matchObj).forEach((key: string) => {
          if (
            key in matchObj &&
            key in record[0] &&
            record.filter((r: any) => r[key] === matchObj[key]).length !==
              record.length
          ) {
            msg = `${
              model.fields.filter((f) => f.fieldName === key)[0].title
            }不满足`;
          }
        });
      }
      //check函数校验( 最灵活)
      if (msg === undefined && item.statusCheckFunc) {
        msg = item.statusCheckFunc(...record);
      }
      if (msg) {
        if (item.disable_hidden === true) {
          checkResult.hidden = true;
        } else {
          checkResult.disabled = true;
          checkResult.tooltip = msg;
        }
      }
      return checkResult;
    },
    []
  );

  //列信息
  const memoColumns = useMemo((): ColumnProps<any>[] => {
    // step1 过滤要展示的列
    const columnshow: Partial<ColumnProps & FormFieldVo>[] = [];
    if (model && model.fields) {
      let temp: ColumnProps & FormFieldVo[] = [];
      //column->手工指定展示的列
      if (column) {
        model.fields
          .filter((f) => column.includes(f.fieldName))
          .forEach((d) => {
            temp.push({ ...d, dataIndex: d.fieldName });
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
        model.fields // 根据配置展示需要的列 是editor组件类型的列不展示
          .filter(
            (f) =>
              f.x_hidden !== true &&
              f.listShow !== false &&
              !ignores.includes(f.fieldName) &&
              f.x_component !== "VfEditor"
          )
          .forEach((f) => {
            columnshow.push({
              ...f,
              // title: (
              //   <div className="flex items-end">
              //     <div>
              //       <SelectIcon
              //         read={true}
              //         size="small"
              //         value={ComponentInfos[f.x_component].icon}
              //       />
              //     </div>
              //     <div className=" pl-2"> {f.title}</div>
              //   </div>
              // ),
              dataIndex: f.fieldName,
            });
          });
      }

      //字典 ，Boolean,外键，Pcode翻译处理
      columnshow?.forEach((m: Partial<ColumnProps & FormFieldVo>) => {
        if (
          m.pageComponentPropDtos &&
          m.pageComponentPropDtos.filter(
            (f) => f.sourceType === sourceType.dict
          ).length > 0 &&
          dicts
        ) {
          const dictCode = m.pageComponentPropDtos.filter(
            (f) => f.sourceType === sourceType.dict
          )[0].propVal;

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
        } else if (m.type === "boolean") {
          m["render"] = (text, record, index) => {
            return text === null ? "-" : text ? "是" : "否";
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
        }
      });
      // 图标，图像组件转换
      columnshow?.forEach((m: Partial<ColumnProps & FormFieldVo>) => {
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
      if (read !== true && lineBtn && lineBtn.length > 0) {
        columnshow?.push({
          title: "操作",
          fieldName: "operate",
          render: (text, record, index) => {
            return (
              <Space>
                {lineBtn.map((item: VfButton<T>, btnIndex: number) => {
                  let checkResult: Partial<VFButtonPorps> = btnCheck(
                    item,
                    record
                  );
                  const button = (
                    <VlifeButton
                      btnType="text"
                      key={
                        btnIndex +
                        "_" +
                        item.model?.entityType +
                        item.model?.type +
                        item.code +
                        "_" +
                        record.id
                      }
                      code={item.code}
                      theme="borderless"
                      type="primary"
                      tooltip={item.tooltip}
                      // hidden={true}
                      onClick={() => {
                        if (item.click) item.click(item, index, record);
                      }}
                      {...checkResult}
                    >
                      {item.title}
                    </VlifeButton>
                  );
                  return button;
                })}
              </Space>
            );
          },
        });
      }
      return columnshow;
    }
    return [];
  }, [model, lineBtn, column, fkMap, lineBtn, dataSource, read]);

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
      selectedRowKeys: selectedRow.map((s) => s.id),
      onSelect: (record: any, selected: any) => {
        if (select_more == false) {
          if (selected == true) {
            setSelectedRow([record]);
          } else {
            setSelectedRow([]);
          }
        }
      },
      // onSelectAll: (selected:any, selectedRows:any[]) => {
      //     console.log(`select all rows: ${selected}`, selectedRows);
      // },
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
    <div className={className}>
      <Table
        showHeader={true}
        // style={{ lineHeight: "24px" }}
        bordered={true}
        rowKey={"id"}
        dataSource={dataSource}
        columns={memoColumns}
        onRow={onRow}
        // title={<div className=" absolute top-0">{children}</div>}
        size="middle"
        rowSelection={
          read ? undefined : select_more != undefined ? rowSelection : undefined
        }
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
    </div>
  );
};

export default TableIndex;
