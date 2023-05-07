/**
 * 简单数据结构数组类设置 Array<String|number|boolean>
 */
import { Button } from "@douyinfe/semi-ui";
import { IconDelete, IconPlus } from "@douyinfe/semi-icons";
import React, { useCallback, useEffect, useState } from "react";
import ComponentPropSetting from "./ComponentPropSetting";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { PropInfo } from "@src/dsl/schema/component";
import { FormFieldVo } from "@src/api/FormField";

interface ArraySignlePropSettingProps {
  /** 属性名称 */
  propName: string;
  /** 属性定义信息 */
  data: PropInfo;
  /** 属性录入信息 */
  pageComponentPropDtos?: PageComponentPropDto[];
  /** 属性值改变 */
  onDataChange: (propObj: Partial<PageComponentPropDto>[]) => void;
  /** 所在页面组件key */
  pageKey: string;
  /** 其他字段信息 */
  fields?: FormFieldVo[];
}

const ComponentArraySignlePropSetting = ({
  propName,
  data,
  pageComponentPropDtos,
  onDataChange,
  pageKey,
  fields,
}: ArraySignlePropSettingProps) => {
  //存放listNo的序号数组
  const [num, setNum] = useState<number[]>([]);
  const remove = useCallback(() => {
    const lastNo = num[num.length - 1];
    setNum([...num.slice(0, num.length - 1)]);
    if (pageComponentPropDtos) {
      onDataChange(pageComponentPropDtos.filter((a) => a?.listNo !== lastNo));
    }
  }, [pageComponentPropDtos, num]);

  /**
   * 索引初始化
   */
  useEffect(() => {
    const s: Set<number> = new Set(pageComponentPropDtos?.map((v) => v.listNo));
    const t: number[] = [...s];
    setNum(t.sort((a, b) => a - b));
  }, [pageComponentPropDtos]);

  const replace = useCallback(
    (listNo: number, propsSetting: Partial<PageComponentPropDto>) => {
      //本次之外的属性值
      const existOther: Partial<PageComponentPropDto>[] | undefined =
        pageComponentPropDtos
          ? pageComponentPropDtos.filter((p) => {
              const flag = p?.listNo !== listNo;
              return flag;
            })
          : undefined;

      const replaceObj: Partial<PageComponentPropDto>[] | undefined = [
        ...(existOther ? existOther : []),
        propsSetting,
      ];

      onDataChange(replaceObj);
    },
    [pageComponentPropDtos]
  );

  return (
    <div>
      <div className="flex justify-end space-x-2">
        <Button
          icon={<IconPlus />}
          onClick={() =>
            num.length > 0 ? setNum([...num, num.length + 1]) : setNum([1])
          }
        />
        <Button icon={<IconDelete />} onClick={remove} />
      </div>
      {num.map((n, index) => {
        return (
          <div className=" flex space-x-2 items-center" key={propName + n}>
            <div className="block">{index + 1}.</div>
            <ComponentPropSetting
              propName={propName}
              propInfo={data}
              pageKey={pageKey}
              listNo={n}
              propObj={pageComponentPropDtos?.filter((a) => a?.listNo === n)[0]}
              onDataChange={(d: Partial<PageComponentPropDto>) => {
                replace(n, d);
              }}
              fields={fields}
            />
            {/* <span className="block"></span> */}
          </div>
        );
      })}
    </div>
  );
};

export default ComponentArraySignlePropSetting;
