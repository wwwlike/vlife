import { connect, mapProps, mapReadPretty } from "@formily/react";
import { getTreeData } from "./utils";
import { Cascader, TreeSelect } from "@formily/semi";

/**
 * 数据转换，做了中转
 */
export default connect(
  TreeSelect,
  mapProps((props, field: any) => {
    console.log("datas", field["componentProps"]);
    const datas = field["componentProps"][field.props.name]?.datas;
    const fieldName: string = field.props.name;
    const key = fieldName.endsWith("code") ? "code" : "id";
    return {
      autoAdjustOverflow: true,
      ...props, //组件上的属性
      style: { width: "100%" },
      changeOnSelect: true,
      ...field["componentProps"][fieldName],
      treeData: datas && datas.length > 0 ? getTreeData(datas, null, key) : [], //该字段上上fieldCover解构开
    };
  }),
  mapReadPretty((model: any) => (
    <>
      {model.props.datas.filter(
        (dd: any) =>
          dd[model.field.fieldName.endsWith("code") ? "code" : "id"] ===
          model.value
      ).length === 1
        ? model.props.datas.filter(
            (dd: any) =>
              dd[model.field.fieldName.endsWith("code") ? "code" : "id"] ===
              model.value
          )[0].name
        : "无"}
    </>
  ))
);
