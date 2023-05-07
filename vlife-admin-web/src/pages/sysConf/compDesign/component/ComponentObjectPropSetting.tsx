/**
 * 对象类型属性设置
 */
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { PropInfo } from "@src/dsl/schema/component";
import React, { useCallback, useMemo } from "react";
import ComponentPropSetting from "./ComponentPropSetting";

interface ObjectPropSettingProps {
  propName: string;
  /** 属性定义信息 */
  propInfo: PropInfo;
  /** 当前对象如果是在数组里，name索引号 */
  listNo?: number;
  /** 对象属性录入信息 */
  pageComponentPropDtos?: PageComponentPropDto[];
  /** 修改对象数据，触发数据回传 */
  onDataChange: (propObj: Partial<PageComponentPropDto>[]) => void;
  /** 所在页面组件key */
  pageKey: string;
  fields?: FormFieldVo[];
}

const ComponentObjectPropSetting = ({
  propName,
  propInfo,
  listNo,
  pageComponentPropDtos,
  pageKey,
  onDataChange,
  fields,
}: ObjectPropSettingProps) => {
  //对象的所有属性数据信息

  // 所有非string类型的组件属性子属性提取
  const propInfos = useMemo((): { [key: string]: PropInfo } => {
    const propInfoObject: { [key: string]: PropInfo } = {};
    if (propInfo.dataSub) {
      Object.keys(propInfo.dataSub).forEach((key) => {
        if (
          propInfo.dataSub &&
          propInfo.dataSub[key] &&
          typeof propInfo.dataSub[key] !== "string"
        ) {
          propInfoObject[key] = propInfo.dataSub[key] as PropInfo;
        }
      });
    }
    return propInfoObject;
  }, [pageComponentPropDtos, propInfo]);

  const replace = useCallback(
    (
      propName: string,
      subName: string,
      propsSetting: Partial<PageComponentPropDto>
    ) => {
      //本次之外的属性值
      if (pageComponentPropDtos && pageComponentPropDtos.length > 0) {
        const existOther: PageComponentPropDto[] = pageComponentPropDtos.filter(
          (p) => p.propName === propName && p.subName !== subName
        );
        const replaceObj: Partial<PageComponentPropDto>[] = [
          ...(existOther ? existOther : []),
          propsSetting,
        ];
        onDataChange(replaceObj);
      } else {
        onDataChange([propsSetting]);
      }
    },
    [pageComponentPropDtos]
  );

  return (
    <>
      {/* {JSON.stringify(pageComponentPropDtos?.map((m) => m.subName))} */}
      {Object.keys(propInfos).map((key) => (
        <ComponentPropSetting
          key={propName + key}
          pageKey={pageKey}
          propName={propName}
          subName={key}
          listNo={listNo}
          propInfo={propInfos[key]}
          propObj={pageComponentPropDtos?.filter((f) => f.subName === key)[0]}
          onDataChange={(d) => {
            //组装最全的
            replace(propName, key, d);
          }}
          fields={fields}
        />
      ))}
    </>
  );
};

export default ComponentObjectPropSetting;
