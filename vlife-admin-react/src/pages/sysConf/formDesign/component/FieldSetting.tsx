import React, { useEffect, useState } from "react";
import { Dropdown } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import {
  CompDatas,
  CompInfo,
  CompPropInfo,
} from "@src/components/compConf/compConf";
import SelectIcon from "@src/components/SelectIcon";
import { useAuth } from "@src/context/auth-context";
import { DataType, numberFiledType } from "@src/dsl/base";
import CompConf from "@src/components/compConf";

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

//查找传入组件配置(compData)信息里需要关联指定字段信息的对象集合
export function extractFromFields(
  compInfo: CompInfo
): { entity: string; field: string }[] {
  const compPropKeys: string[] = Object.keys(compInfo.props || {});
  return compPropKeys
    ?.filter(
      (k) =>
        compInfo.props &&
        compInfo.props[k] &&
        typeof compInfo.props[k] === "object" &&
        (compInfo.props[k] as CompPropInfo).fromField &&
        (compInfo.props[k] as CompPropInfo).fromField !== true &&
        (compInfo.props[k] as CompPropInfo).required == true
    )
    .map(
      (key) =>
        (compInfo?.props?.[key] as CompPropInfo).fromField as {
          entity: string;
          field: string;
        }
    );
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
            numberFiledType.includes(field.fieldType) &&
            field.fieldType !== "date" &&
            field.fieldType !== "boolean"
          ) {
            return await getFormInfo({ type: field.fieldType }).then((d) => {
              const matchs = d?.typeParentsStr?.split(",").filter((dd) => {
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
      //1. 找出表单字段类型一致组件回调数据类型
      const components: CompInfo[] = d.filter(
        (dd: CompInfo) => dd !== undefined
      );

      //2. 找到该组件属性里必填的且是来自指定字段数据对象的集合
      const selectAbleComp = components.filter((compInfo) => {
        const fromFields: { field: string; entity: string }[] =
          extractFromFields(compInfo);

        return (
          fromFields === undefined ||
          fromFields === null ||
          fromFields.length === 0 ||
          fromFields.filter(
            (fromField) =>
              formVo.fields.filter(
                (f) =>
                  f.entityType === fromField.entity &&
                  f.entityFieldName === fromField.field &&
                  f.dataType !== "array"
              ).length === 1
          ).length === fromFields.length
        );
      });
      setComps(selectAbleComp);
    });
  }, [field.type]);

  return (
    <>
      {/* 1. 选择组件 */}
      <div className="flex items-center space-x-4 w-full mt-2">
        <div>
          {compDatas[field.x_component]?.icon &&
            (typeof compDatas[field.x_component].icon === "string" ? (
              <SelectIcon
                size="large"
                read
                value={compDatas[field.x_component]?.icon as string}
              />
            ) : (
              <>{compDatas[field.x_component]?.icon}</>
            ))}
        </div>
        <div>
          <Label>
            {compDatas[field.x_component]?.label}
            <span className=" text-sm text-gray-500">
              ({field.x_component})
            </span>
          </Label>
        </div>
        <div className=" absolute right-0">
          <Dropdown
            trigger={"hover"}
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
                          typeof component.icon === "string" ? (
                            <SelectIcon
                              size="large"
                              read
                              value={component.icon}
                            />
                          ) : (
                            <>{component.icon}</>
                          )
                        }
                      >
                        {component.label}
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            }
          >
            <i className="cursor-pointer font-thin  icon-change-member text-2xl hover:text-blue-500 hover:bg-slate-50" />
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
