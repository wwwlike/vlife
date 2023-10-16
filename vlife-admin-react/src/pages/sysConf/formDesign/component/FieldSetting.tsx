import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import CompConf from "@src/components/compConf";
import { CompDatas, CompInfo } from "@src/components/compConf/compConf";
import SelectIcon from "@src/components/SelectIcon";
import { useAuth } from "@src/context/auth-context";
import { DataType } from "@src/dsl/schema/base";

/**
 * 1. 组件选择
 * 1. 组件内置属性设置
 * 1. 组件选择
 * 2. 组件属性设置
 */
interface FieldSettingProps {
  /** 当前字段 */
  field: FormFieldVo;
  /** 表单信息 */
  formVo: FormVo;
  /** 采用的组件面板  */
  compDatas: CompDatas;
  /** 数据回传 */
  onDataChange: (data: {
    x_component: string;
    pageComponentPropDtos?: Partial<PageComponentPropDto>[];
  }) => void;
}

/**
 * 1.组件选择
 * 2.组件属性设置
 */
export default ({
  field,
  formVo,
  compDatas,
  onDataChange,
}: FieldSettingProps) => {
  const { getFormInfo } = useAuth();
  //字段可用组件
  const [comps, setComps] = useState<CompInfo[]>([]);
  useEffect(() => {
    const components: CompInfo[] = Object.keys(compDatas).map((k) => {
      const component = compDatas[k];
      return { ...component, key: component.key ? component.key : k };
    });
    Promise.all(
      components.map(async (component) => {
        if (
          //大类相同，或者组件未指定大类
          component.dataType === undefined ||
          component.dataType === null ||
          component.dataType === field.dataType
        ) {
          if (component.dataModel === field.fieldType) {
            //完全匹配
            return component;
          } else if (
            //对象继承匹配判断
            component.dataType !== DataType.basic &&
            field.fieldType !== "string" &&
            field.fieldType !== "number" &&
            field.fieldType !== "date" &&
            field.fieldType !== "boolean"
          ) {
            return await getFormInfo({ type: field.fieldType }).then((d) => {
              const matchs = d?.parentsName.filter((dd) => {
                return (
                  dd.toLocaleLowerCase() ===
                  component?.dataModel?.toLocaleLowerCase()
                );
              });
              if (matchs && matchs.length > 0) {
                return component;
              }
            });
          }
        }
      })
    ).then((d: any) => {
      const components = d.filter((dd: CompInfo) => dd !== undefined);
      setComps(components);
    });
  }, [field.type]);

  return (
    <>
      {/* 1. 选择组件 */}
      <div className="flex items-center space-x-4 w-full mt-2">
        <div>
          <SelectIcon
            size="large"
            read
            value={compDatas[field.x_component]?.icon}
          />
        </div>
        <div>
          <Label>{compDatas[field.x_component]?.label}</Label>
        </div>
        <div className=" absolute right-0">
          <Dropdown
            trigger={"click"}
            clickToHide
            render={
              <Dropdown.Menu>
                {comps
                  .filter((component) => component.key !== field.x_component)
                  .map((component) => {
                    return (
                      <Dropdown.Item
                        key={"selectComp" + component.key}
                        onClick={(d) => {
                          onDataChange({ x_component: component.key || "" });
                        }}
                        icon={
                          <SelectIcon
                            size="large"
                            read
                            value={component.icon}
                          />
                        }
                      >
                        {component.label}
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            }
          >
            <Button
              icon={
                <SelectIcon size="large" read value={"IconLoopTextStroked"} />
              }
            ></Button>
          </Dropdown>
        </div>
      </div>
      {/* 选中的组件如果采用propForm则不使用下面的 */}
      {/* 2. 组件属性设置 */}
      {field &&
        field.x_component &&
        compDatas[field.x_component] &&
        compDatas[field.x_component].props !== undefined && (
          <CompConf
            formVo={formVo}
            field={field}
            value={field.pageComponentPropDtos || []}
            propConf={compDatas[field.x_component].props || {}}
            onDataChange={(
              editPageComponentPropDtos: Partial<PageComponentPropDto>[]
            ) => {
              onDataChange({
                x_component: field.x_component,
                pageComponentPropDtos: [...editPageComponentPropDtos],
              });
            }}
          />
        )}
    </>
  );
};
