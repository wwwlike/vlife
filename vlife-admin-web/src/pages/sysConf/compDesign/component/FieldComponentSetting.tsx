import { Button, Dropdown } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import SelectIcon from "@src/components/SelectIcon";
import { useAuth } from "@src/context/auth-context";
import { ComponentInfos } from "@src/dsl/datas/components";
import { DataType, Mode } from "@src/dsl/schema/base";
import { ComponentInfo, match } from "@src/dsl/schema/component";
import React, { useMemo } from "react";
import ComponentSetting from "./ComponentSetting";

/**
 * 字段组件设置入口
 * 1. 组件选择
 * 2. 组件属性选择
 */
interface FieldComponentSettingProps {
  /**
   * 当前使用场景
   */
  mode: Mode;
  /** 字段名称 */
  fieldName: string;
  /** 已经选择的组件类型 */
  x_component?: string;
  /** 组件设置的属性信息(涵接口参数设置) */
  pageComponentPropDtos?: Partial<PageComponentPropDto>[];
  /** 其他字段信息 (组件入参来源选择field时使用) */
  fields: FormFieldVo[];
  /** 数据回传 */
  onDataChange: (data: {
    x_component: string;
    pageComponentPropDtos?: Partial<PageComponentPropDto>[];
  }) => void;
}

/**
 *
 * 1.组件选择
 * 2.组件属性设置
 */
const FieldComponentSetting = ({
  mode,
  fieldName,
  x_component,
  pageComponentPropDtos,
  fields,
  onDataChange,
}: FieldComponentSettingProps) => {
  /** 当前字段信息 */
  const currField = useMemo((): FormFieldVo => {
    const field = fields.filter((f) => f.fieldName === fieldName)[0];
    return field;
  }, [fieldName, fields]);
  // type list basic
  const { getFormInfo } = useAuth();

  /** 字段类型能够使用的模型信息对象 */
  const usableComponents = useMemo((): ComponentInfo[] => {
    //所有组件名称 keys
    const components: ComponentInfo[] = Object.keys(ComponentInfos).map((k) => {
      const component = ComponentInfos[k];
      return { ...component, key: component.key ? component.key : k };
    });
    const usables: ComponentInfo[] = [];

    Promise.all(
      components.map(async (component) => {
        if (
          //1 满足使用场景
          component.mode === undefined ||
          component.mode === mode ||
          (component.mode as Array<Mode>).includes(mode)
        ) {
          // 2 满足目标对象
          if (
            component.target === undefined ||
            component.target?.filter((d) => {
              return (
                d.type === currField.form_type &&
                (d.fieldName === undefined ||
                  d.fieldName === currField.fieldName)
              );
            }).length > 0
          ) {
            //3 满足数据结构
            /**
             * 为当前字段 currField进行数据结构匹配合适的组件
             * @param component 组件信息
             * @param componentMatch component里的一个匹配规则
             */
            const compMatch = async (
              component: ComponentInfo,
              componentMatch: match
            ) => {
              if (componentMatch.dataType === currField.dataType) {
                if (componentMatch.dataModel === currField.fieldType) {
                  //完全匹配，数据类型和模型类型均一致
                  usables.push({ ...component });
                  //else if继承匹配，查找当前字段的currfield,模型上级对象； 简单对象不用查找
                } else if (
                  componentMatch.dataType !== DataType.basic &&
                  currField.fieldType !== "string" &&
                  currField.fieldType !== "number" &&
                  currField.fieldType !== "date" &&
                  currField.fieldType !== "boolean"
                ) {
                  await getFormInfo({ type: currField.fieldType }).then((d) => {
                    const matchs = d?.parentsName.filter((dd) => {
                      if (componentMatch?.dataModel instanceof Array) {
                        return (
                          componentMatch?.dataModel.filter((mm) => mm === dd)
                            .length > 0
                        );
                      } else {
                        return (
                          dd.toLocaleLowerCase() ===
                          componentMatch?.dataModel?.toLocaleLowerCase()
                        );
                      }
                    });
                    if (matchs && matchs.length > 0) {
                      usables.push({ ...component });
                    }
                  });
                }
              }
            };
            if (component.match instanceof Array) {
              component.match.forEach(async (m) => {
                await compMatch(component, m);
              });
            } else if (component.match) {
              await compMatch(component, component.match);
            }

            // if (component.dataType === currField.dataType) {
            //   if (component.dataModel === currField.fieldType) {
            //     usables.push({ ...component });
            //   } else if (component.dataType !== "basic") {
            //     //继承匹配
            //     await getModelInfo(currField.fieldType).then((d) => {
            //       const matchs = d?.parentsName.filter(
            //         (dd) =>
            //           dd.toLocaleLowerCase() ===
            //           component?.dataModel?.toLocaleLowerCase()
            //       );
            //       if (matchs && matchs.length > 0) {
            //         usables.push({ ...component });
            //       }
            //     });
            //   }
            // }
          }
        }
      })
    );
    // 判断有绑定字段的是否符合
    return usables;
  }, [currField.type, currField.entityType, currField.fieldName, mode]);

  return (
    <>
      {/* {JSON.stringify(pageComponentPropDtos)} */}
      {/* 1. 选择组件 */}
      <div className="flex items-center space-x-4 w-full mt-2">
        <div>
          <SelectIcon
            size="large"
            read
            value={ComponentInfos[currField.x_component]?.icon}
          />
        </div>
        <div>
          <Label>{ComponentInfos[currField.x_component]?.label}</Label>
        </div>
        <div className=" absolute right-0">
          {/* {JSON.stringify(usableComponents[0])} */}
          <Dropdown
            trigger={"click"}
            clickToHide
            render={
              <Dropdown.Menu>
                {usableComponents
                  .filter(
                    (component) => component.key !== currField.x_component
                  )
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
        {/* <div className="semi-form-field-label-text semi-form-field-label">
          <label>组件</label>
        </div>
        <Select
          value={x_component}
          filter
          key={fieldName + "fieldComponent_select"}
          showClear
          style={{ width: "90%" }}
          optionList={usableComponents.map((component) => {
            return {
              label: component.label ? component.label : component.key,
              value: component.key,
            };
          })}
          onChange={(d) => {
            onDataChange({ x_component: d as string });
          }}
        /> */}
      </div>
      {/* 2. 组件属性设置 */}
      {x_component && (
        <ComponentSetting
          componentInfo={ComponentInfos[x_component]}
          pageKey={fieldName}
          pageComponentPropDtos={pageComponentPropDtos}
          onDataChange={(
            editPageComponentPropDtos: Partial<PageComponentPropDto>[]
          ) => {
            onDataChange({
              x_component: x_component,
              pageComponentPropDtos: [...editPageComponentPropDtos],
            });
            //替换指定组件里的指定属性设置值
          }}
          fields={fields}
        />
      )}
      {/* 3. 组件事件设置 ；基础组件目前是否有事件设置的必要 */}
    </>
  );
};

export default FieldComponentSetting;
