import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import VlifeButton, { VFButtonPorps } from "@src/components/vlifeButton";
import { checkLineNumber, VfButton } from "@src/dsl/schema/button";
import React, { useCallback, useMemo } from "react";
import cx from "classnames";
/**
 * T 行记录类型
 */
interface TableToolbarProps<T extends IdBean> {
  tableModel: FormVo; //传则进行过滤
  tableBtn: VfButton<T>[]; //列表按钮
  selectedRow: T[]; //选中的记录
  children?: any;
  //按钮信息
}
/**
 * 菜单栏目
 * 主要负责布局
 * 1. 查询
 * 2. 排序
 * 3. 字段筛选
 * 4. 按钮布局
 */
export default <T extends IdBean>({
  tableBtn,
  selectedRow,
  tableModel,
  children,
  ...props
}: TableToolbarProps<T>) => {
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
              tableModel.fields.filter((f) => f.fieldName === key)[0].title
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
    [tableModel]
  );

  const tableButtonMemo = useMemo(() => {
    const tableBtns = tableBtn?.map((item, index) => {
      let checkResult: Partial<VFButtonPorps> = btnCheck(item, ...selectedRow);
      const button = (
        <VlifeButton
          className={cx(item.className, " bg-red-400")}
          icon={item.icon}
          // loading={item.loading}
          code={item.code}
          key={"tableButton_" + index}
          tooltip={item.tooltip}
          onClick={() => {
            if (item.click) {
              //-1 表示全局表的按钮
              item.click(item, -1, ...selectedRow);
            }
            // setSelectedRow([]);
          }}
          {...checkResult}
        >
          {item.title}
        </VlifeButton>
      );
      return button;
    });
    return tableBtns;
  }, [tableBtn, JSON.stringify(selectedRow)]);
  return (
    <div className="flex  mb-1">
      {children && <div className="flex-1">{children}</div>}
      <div className=" space-x-0.5">{tableButtonMemo}</div>
    </div>
  );
};
