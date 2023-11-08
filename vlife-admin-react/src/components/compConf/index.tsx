import React, { useCallback, useMemo } from "react";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataType } from "@src/dsl/base";
import { CompProp, CompPropInfo } from "./compConf";
import ArraySetting from "./component/ArraySetting";
import BasicSetting from "./component/BasicSetting";
import ObjectSetting from "./component/ObjectSetting";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";

/**
 * 根据组件属性定义CompData，dsl->components来实现的一套组件属性配置组件
 */
interface CompConfProps {
  formVo?: FormVo;
  field?: FormFieldVo;
  parentName?: string; //有值则当前为嵌套的子集设置
  lineNo?: number;
  //组件数据
  propConf: CompProp; //组件信息
  value: Partial<PageComponentPropDto>[]; //已保存数据库数据
  onDataChange: (datas: Partial<PageComponentPropDto>[]) => void; //已经修订数据返回
}
export default ({
  parentName,
  propConf,
  lineNo,
  formVo,
  field,
  value,
  onDataChange,
}: CompConfProps) => {
  //可用组件名称提取
  const propInfos = useMemo((): { [key: string]: CompPropInfo } => {
    const obj: { [key: string]: CompPropInfo } = {};
    Object.keys(propConf).forEach((k: string) => {
      if (typeof propConf[k] === "object") {
        obj[k] = propConf[k] as CompPropInfo;
      }
    });
    return obj;
  }, [propConf]);

  /**
   * 过滤字段已配置信息
   */
  const filterPropDbSettingInfo = useCallback(
    (propName: string, subName?: string): Partial<PageComponentPropDto>[] => {
      return value
        .filter((f) => f.propName === propName)
        .filter((f) => (subName ? f.subName === subName : true));
    },
    [value]
  );
  return (
    <div className=" w-full">
      {Object.keys(propInfos).map((propName) => {
        const dType = propInfos[propName].dataType; //数据大类
        return (
          <div key={propName} className=" border-b border-dashed">
            {dType === DataType.basic && (
              <>
                <BasicSetting
                  formVo={formVo}
                  field={field}
                  propName={parentName ? parentName : propName}
                  subName={parentName ? propName : undefined}
                  propInfo={propInfos[propName]}
                  listNo={lineNo}
                  value={
                    filterPropDbSettingInfo(
                      parentName ? parentName : propName, // propName
                      parentName ? propName : undefined //subName
                    )[0]
                  }
                  onDataChange={(data: Partial<PageComponentPropDto>) => {
                    if (parentName !== undefined && lineNo !== undefined) {
                      const withOutData = value
                        .filter(
                          (v) =>
                            !(
                              v.propName === parentName &&
                              v.subName === propName &&
                              v.listNo === lineNo
                            )
                        )
                        .filter((v) => v.subName !== undefined);
                      onDataChange([...withOutData, data]);
                    } else if (parentName !== undefined) {
                      onDataChange([
                        ...value.filter(
                          (v) =>
                            !(
                              v.propName === parentName &&
                              v.subName === propName
                            )
                        ),
                        data,
                      ]);
                    } else if (lineNo !== undefined) {
                      onDataChange([
                        ...value.filter(
                          (v) =>
                            !(v.propName === propName && v.listNo === lineNo)
                        ),
                        data,
                      ]);
                    } else {
                      onDataChange([
                        ...value.filter((v) => v.propName !== propName),
                        data,
                      ]);
                    }
                  }}
                />
              </>
            )}
            {dType === DataType.object && (
              <ObjectSetting
                lineNo={lineNo}
                formVo={formVo}
                field={field}
                propName={parentName || propName}
                propInfo={propInfos[propName]}
                value={filterPropDbSettingInfo(propName)}
                onDataChange={(datas: Partial<PageComponentPropDto>[]) => {
                  onDataChange([
                    ...value.filter((v) => v.propName !== propName),
                    ...datas,
                  ]);
                }}
              />
            )}
            {dType === DataType.array && (
              <ArraySetting
                formVo={formVo}
                field={field}
                propName={parentName || propName}
                propInfo={propInfos[propName]}
                value={filterPropDbSettingInfo(propName)}
                onDataChange={(datas: Partial<PageComponentPropDto>[]) => {
                  onDataChange([
                    ...value.filter((v) => v.propName !== propName),
                    ...datas,
                  ]);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
