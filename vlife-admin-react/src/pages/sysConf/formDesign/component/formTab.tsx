/**
 * 表单配置
 * 包含保单列数和分组容器的定义
 */
import { Button, Dropdown, SplitButtonGroup } from "@douyinfe/semi-ui";
import {
  IconTabsStroked,
  IconTreeTriangleDown,
  IconDeleteStroked,
  IconPlus,
} from "@douyinfe/semi-icons";
import { SplitButtonGroupProps } from "@douyinfe/semi-ui/lib/es/button";
import { FormVo } from "@src/api/Form";
import { DropDownMenuItem } from "@douyinfe/semi-ui/lib/es/dropdown";
import { useMemo } from "react";
import { useNiceModal } from "@src/store";
import { FormFieldVo } from "@src/api/FormField";
import { FormTabDto } from "@src/api/FormTab";

interface formSettingProp extends SplitButtonGroupProps {
  formVo: FormVo;
  onDataChange: (formVo: FormVo) => void;
}

export default ({ formVo, onDataChange, ...props }: formSettingProp) => {
  //加载弹出表单modal
  const formModal = useNiceModal("formModal");

  const menu = useMemo((): DropDownMenuItem[] => {
    let arrays: DropDownMenuItem[] = [
      {
        node: "item",
        name: "添加页签",
        icon: <IconPlus />,
        onClick: () => {
          formModal.show({
            type: "formTab",
            // title: "增加页签",
            saveFun: (data: FormTabDto) => {
              const tab: FormTabDto = {
                ...data,
                sort:
                  formVo && formVo.formTabDtos
                    ? formVo.formTabDtos.length + 1
                    : 1,
                code:
                  formVo.type +
                  "tab" +
                  (formVo && formVo.formTabDtos
                    ? formVo.formTabDtos.length + 1
                    : 1),
              };
              onDataChange({
                ...formVo,
                fields: formVo.fields.map((f: FormFieldVo) => {
                  return {
                    ...f,
                    formTabCode: f.formTabCode ? f.formTabCode : tab.code,
                  };
                }),
                formTabDtos:
                  formVo.formTabDtos !== undefined &&
                  formVo.formTabDtos !== null
                    ? [...formVo.formTabDtos, tab]
                    : [tab],
              });
              formModal.hide();
            },
          });
        },
      },
      { node: "divider" },
    ];

    formVo?.formTabDtos?.forEach((g) => {
      arrays.push({
        node: "item",
        name: g.name,
        onClick: () => {
          formModal.show({
            type: "FormTab",
            title: "页签修改",
            formData: g,
            saveFun: (data: FormTabDto) => {
              onDataChange({
                ...formVo,
                formTabDtos: formVo.formTabDtos
                  ? [
                      ...formVo.formTabDtos.map((g) =>
                        g.code === data.code ? data : g
                      ),
                    ]
                  : [],
              });
              formModal.hide();
            },
          });
        },
      });
    });

    if (formVo && formVo.formTabDtos && formVo.formTabDtos.length > 0) {
      const delIndex = formVo.formTabDtos.length - 1;
      const delObj = formVo.formTabDtos[delIndex];
      const code = formVo.formTabDtos[0].code;
      arrays.push(
        { node: "divider" },
        {
          icon: <IconDeleteStroked />,
          node: "item",
          name: "删除页签",
          onClick: () => {
            onDataChange({
              ...formVo,
              fields: formVo.fields.map((f) => {
                return {
                  ...f,
                  formTabCode:
                    delIndex === 0
                      ? undefined
                      : f.formTabCode === delObj.code
                      ? code
                      : f.formTabCode,
                };
              }),
              formTabDtos:
                delIndex === 0
                  ? undefined
                  : formVo.formTabDtos?.slice(0, formVo.formTabDtos.length - 1),
            });
          },
        }
      );
    }
    return arrays;
  }, [formVo, formModal]);

  return (
    <SplitButtonGroup {...props} className="" style={{ margin: 10 }}>
      {/* theme="light" */}
      <Button type="tertiary" icon={<IconTabsStroked />}>
        页签
      </Button>
      <Dropdown
        // onVisibleChange={(v) => handleVisibleChange(2, v)}
        menu={menu}
        trigger="click"
        position="bottomRight"
      >
        <Button
          type="tertiary"
          style={{
            padding: "8px 4px",
          }}
          className=" hover:bg-slate-400"
          icon={<IconTreeTriangleDown />}
        ></Button>
      </Dropdown>
    </SplitButtonGroup>
  );
};
