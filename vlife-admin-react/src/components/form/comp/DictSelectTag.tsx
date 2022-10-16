import { connect, mapProps } from "@formily/react";
import DictSelectTag from "@src/components/select/DictSelectTag";

export default connect(
  DictSelectTag,
  mapProps(
    {
      required: true,
      validateStatus: true,
    },
    (props, field: any) => {
      return {
        ...props,
        selectMore: !(
          //单选
          (
            (field.componentProps["field"]["type"] === "string" ||
              field.componentProps["field"]["type"] === "boolean") &&
            field.componentProps["field"]["fieldType"] === "basic"
          )
        ),
        datas: field.dataSource,
        onSelected: (ids: (string | number | undefined)[]) => {
          field.value = ids && ids.length === 0 ? undefined : ids;
        },
      };
    }
  )
);
