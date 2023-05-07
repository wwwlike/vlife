/**
 * 数组类型属性设置
 */
import { Button, TabPane, Tabs } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { PropInfo } from "@src/dsl/schema/component";
import React, { useCallback, useEffect, useState } from "react";
import ComponentObjectPropSetting from "./ComponentObjectPropSetting";

interface ArrayPropSettingProps {
  /** 属性名称 */
  propName: string;
  /** 属性定义信息 */
  data: PropInfo;
  /** 属性录入信息 */
  value?: PageComponentPropDto[];
  /** 属性值改变 */
  onDataChange: (propObj: Partial<PageComponentPropDto>[]) => void;
  /** 所在页面组件key */
  pageKey: string;
  fields?: FormFieldVo[];
}

const ComponentArrayPropSetting = ({
  propName,
  data,
  value,
  pageKey,
  onDataChange,
  fields,
}: ArrayPropSettingProps) => {
  /**
   * 数据数据
   */
  // const [array, setArray] = useState<Partial<PageComponentProp[]>>(value);
  //存放listNo的序号数组

  const [num, setNum] = useState<number[]>([]);

  const remove = useCallback(() => {
    if (value) {
      const lastNo = num[num.length - 1];
      setNum([...num.slice(0, num.length - 1)]);
      onDataChange(value.filter((a) => a?.listNo !== lastNo));
    }
  }, [value, num]);

  useEffect(() => {
    const s: Set<number> = new Set(value?.map((v) => v.listNo));
    const t: number[] = [...s];
    setNum(t.sort((a, b) => a - b));
  }, [value]);

  const replace = useCallback(
    (listNo: number, propsSetting: Partial<PageComponentPropDto>[]) => {
      // alert(JSON.stringify(propsSetting));
      //本次之外的属性值
      if (value && value.length > 0) {
        const existOther: PageComponentPropDto[] = value?.filter((p) => {
          const flag = p?.listNo !== listNo;
          return flag;
        });
        const rt = [...(existOther ? existOther : []), ...propsSetting];
        onDataChange(rt);
      } else {
        onDataChange(propsSetting);
      }
    },
    [value]
  );

  return (
    <Tabs
      defaultActiveKey="1"
      tabBarExtraContent={
        <>
          <Button
            onClick={() =>
              num.length > 0 ? setNum([...num, num.length + 1]) : setNum([1])
            }
          >
            +
          </Button>
          {num.length > 0 ? <Button onClick={remove}>-</Button> : ""}
        </>
      }
    >
      {num.map((n, index) => {
        return (
          <TabPane
            key={propName + "tab" + n}
            tab={"第" + (index + 1) + "组"}
            itemKey={"1" + n}
          >
            <ComponentObjectPropSetting
              key={propName + "ComponentObjectPropSetting" + n}
              propName={propName}
              propInfo={data}
              listNo={n}
              pageKey={pageKey}
              pageComponentPropDtos={value?.filter((a) => a?.listNo === n)}
              onDataChange={(d) => {
                replace(n, d);
              }}
              fields={fields}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default ComponentArrayPropSetting;
