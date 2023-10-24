import { DataModel, DataType } from "@src/dsl/schema/base";
import VfCheckbox from "../components/VfCheckbox";
import VfNumbersInput from "../components/VfNumbersInput";
import { CompDatas, selectObj } from "../components/compConf/compConf";
import RelationTagInput from "@src/components/RelationTagInput";
import VfEditor from "@src/components/VfEditor";
import SelectIcon from "@src/components/SelectIcon";
import VfImage from "@src/components/VfImage";
import SearchInput from "@src/components/SearchInput";
import SelectTag from "@src/components/SelectTag";
import VfTreeSelect from "@src/components/VfTreeSelect";
import PageSelect from "@src/components/PageSelect";
import MenuResourcesSelect from "@src/pages/sysManage/role/component/MenuResourcesSelect";
import VfFormTable from "@src/components/form/component/FormTable";
import VfListForm from "@src/components/form/component/VfListForm";
import { FormVo, model } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { connect, mapReadPretty } from "@formily/react";
import { PreviewText, InputNumber } from "@formily/semi";
import {
  DatePicker as SemiDatePicker,
  Input as SemiInput,
  TextArea as SemiTextArea,
  Select as SemiSelect,
  // TreeSelect as SemiTreeSelect,
} from "@douyinfe/semi-ui";
import { VfText } from "@src/components/VfText";
import DictInput from "@src/pages/sysConf/dict/component/DictInput";
import QuickCreate from "@src/components/form/component/QuickCreate";
import VfTreeInput from "@src/components/VfTreeInput";

//解决预览不正确问题
const Input = connect(SemiInput, mapReadPretty(PreviewText.Input));
const Select = connect(SemiSelect, mapReadPretty(VfText));
const TextArea = connect(SemiTextArea, mapReadPretty(PreviewText.Input));
const DatePicker = connect(SemiDatePicker, mapReadPretty(VfText));

const FormTable = connect(
  VfFormTable,
  mapReadPretty(({ ...props }) => <VfFormTable {...props} read={true} />)
);
// const TreeSelect = connect(SemiTreeSelect, mapReadPretty(VfText));
/**
 * 表单组件资产配置定义
 */
export const FormComponents: CompDatas = {
  Input: {
    component: Input,
    icon: "IconFont",
    label: "单行文字",
    dataType: DataType.basic,
    dataModel: DataModel.string,
    props: {
      // className: "  !bg-white focus:!border-red-400",
    },
  },
  VfCheckbox: {
    component: VfCheckbox,
    icon: "IconFont",
    label: "复选框",
    dataType: DataType.basic,
    dataModel: DataModel.boolean,
  },
  TextArea: {
    icon: "IconWholeWord",
    component: TextArea,
    label: "多行文字",
    dataType: DataType.basic,
    dataModel: DataModel.string,
  },
  VfNumbersInput: {
    icon: "IconWholeWord",
    component: VfNumbersInput,
    label: "数字范围",
    dataType: DataType.array,
    dataModel: DataModel.number,
  },
  InputNumber: {
    label: "数字",
    icon: "IconIdentity",
    component: InputNumber,
    dataType: DataType.basic,
    dataModel: DataModel.number,
  },
  DatePicker: {
    component: DatePicker,
    icon: "IconClock",
    label: "日期",
    dataModel: DataModel.date,
  },
  VfSelect_DICT: {
    component: Select,
    icon: "IconDescend2",
    label: "下拉选择(字典)",
    dataType: DataType.basic,
    dataModel: DataModel.string,
    props: {
      optionList: {
        label: "字典数据",
        apiName: "dictDatas",
        dataType: DataType.array,
        dataModel: "ISelect",
      },
      showClear: true,
      filter: true, //也支持已传入函数
      //  (sugInput: string, option: any) => {
      //   let label = option.label.toUpperCase();
      //   let sug = sugInput.toUpperCase();
      //   return label.includes(sug);
      // },
      outerBottomSlot: <DictInput />,
    },
  },
  VfSelect: {
    component: Select,
    icon: "IconDescend2",
    label: "下拉选择(接口)",
    dataType: DataType.basic,
    dataModel: DataModel.string,
    props: {
      showClear: true,
      emptyContent: "请选择",
      zIndex: 1000,
      optionList: {
        label: "数据来源",
        dataType: DataType.array,
        dataModel: "ISelect",
      },
      saveData: {
        label: "快捷创建",
        dataType: DataType.basic,
        dataModel: DataModel.string,
        options: [
          { label: "视图创建", value: "/reportCondition/save" },
          { label: "dem0客户创建", value: "/demoCustomer/save" },
        ],
      },
      outerBottomSlot: <QuickCreate />,
    },
  },
  RelationTagInput: {
    component: RelationTagInput,
    icon: "IconDescend2",
    label: "列表弹框",
    dataModel: DataModel.string,
  },
  // VfTreeInput: {
  //   component: VfTreeInput,
  //   icon: "IconTreeTriangleDown",
  //   label: "树型下拉",
  //   dataType: DataType.basic,
  //   dataModel: DataModel.string,
  //   props: {
  //     datas: {
  //       label: "可选数据类型",
  //       dataType: DataType.array,
  //       dataModel: "ITree",
  //       must: true,
  //     },
  //   },
  // },

  TreeSelect: {
    component: VfTreeInput,
    icon: "IconTreeTriangleDown",
    label: "树型下拉",
    dataType: DataType.basic,
    dataModel: DataModel.string,
    props: {
      className: "w-full",
      treeData: {
        label: "树形结构数据",
        dataType: DataType.array,
        dataModel: "ITreeData",
        must: true,
      },
      outerBottomSlot: <QuickCreate />,
      saveData: {
        label: "快捷创建",
        dataType: DataType.basic,
        dataModel: DataModel.string,
        options: [
          { label: "创建菜单", value: "/sysMenu/save" },
          { label: "创建部门", value: "/sysDept/save" },
        ],
      },
    },
  },

  VfEditor: {
    component: VfEditor,
    icon: "IconTextRectangle",
    label: "富文本",
    dataType: DataType.basic,
    dataModel: DataModel.string,
  },
  SelectIcon: {
    component: SelectIcon,
    icon: "IconComponent",
    label: "图标选择",
    dataType: DataType.basic,
    dataModel: DataModel.string,
  },
  VfImage: {
    component: VfImage,
    icon: "IconImage",
    label: "图片上传",
    dataModel: DataModel.string,
  },
  SearchInput: {
    component: SearchInput,
    icon: "IconSearch",
    dataModel: DataModel.string,
    dataType: DataType.basic,
    label: "搜索组件",
  },
  SelectTag: {
    label: "Tag标签(字典)",
    component: SelectTag,
    icon: "IconSearch",
    dataModel: DataModel.string,
    props: {
      datas: {
        label: "字典数据",
        dataModel: "ISelect",
        dataType: DataType.array,
        must: true,
      },
    },
  },
  VfTreeSelect: {
    component: VfTreeSelect,
    label: "树型选择",
    dataType: DataType.basic,
    icon: "IconSearch",
    dataModel: DataModel.string,
    props: {
      datas: {
        label: "数据来源",
        dataType: DataType.array,
        dataModel: "ITree",
        must: true,
      },
      expandAll: false,
      valField: "code",
    },
  },
  PageSelect: {
    component: PageSelect,
    label: "分组选择组件",
    dataType: DataType.array,
    icon: "IconSearch",
    dataModel: DataModel.string,
    props: {
      datas: {
        label: "分组数据",
        dataType: DataType.array,
        dataModel: "PageSelectData",
        must: true,
      },
      dataEmpty: {
        label: "空数据时文案",
        dataType: DataType.basic,
        dataModel: DataModel.string,
      },
    },
  },
  MenuResourcesSelect: {
    component: MenuResourcesSelect,
    label: "角色资源绑定组件",
    dataType: DataType.array,
    dataModel: DataModel.string,
    icon: "IconComponent",
    props: {
      appId: {
        label: "应用ID",
        dataType: DataType.basic,
        dataModel: DataModel.string,
        fromField: { entity: "sysMenu", field: "id" },
        must: true,
        // options: (formVo: FormVo) => {
        //   return formVo.fields
        //     .filter(
        //       (f) =>
        //         f.fieldType === "string" &&
        //         f.dataType === "basic" &&
        //         f.entityType === "sysMenu"
        //     )
        //     .map((f) => {
        //       return { label: f.title, value: f.fieldName };
        //     });
        // },
      },
      roleId: {
        label: "角色ID",
        must: true,
        dataType: DataType.basic,
        dataModel: DataModel.string,
        fromField: { entity: "sysRole", field: "id" },
        // options:(formVo:FormVo)=>{
        //   return formVo.fields.filter(f=>f.fieldType==='string'&&f.dataType==='basic'&&f.entityType==="sysRole").map((f)=>{return {label:f.title,value:f.fieldName}})
        // },
      },
    },
  },
  // formPage:{
  //   component: FormPage,
  //   label:"表单",
  //   dataType: DataType.object,
  //   dataModel: "IModel",
  // },
  table: {
    component: FormTable,
    label: "1对多列表录入",
    icon: "IconOrderedList",
    dataType: DataType.array,
    dataModel: "IdBean", //仅支持实体模型(不支持IModel,Imodel不适合列表)
    props: {
      ignores: {
        label: "列表忽略字段",
        dataType: DataType.array,
        dataModel: DataModel.string, //((form?:FormVo)=>Promise<Partial<selectObj>[]>)/
        options: (
          form?: FormVo,
          field?: FormFieldVo
        ): Promise<Partial<selectObj>[]> => {
          return model({ type: field?.fieldType }).then((d) => {
            if (d.data) {
              return d.data.fields
                .filter(
                  (f) =>
                    f.listShow === null ||
                    f.listShow === undefined ||
                    f.listShow === true
                )
                .map((f) => {
                  return { value: f.fieldName, label: f.title };
                });
            } else {
              return [];
            }
          });
        },
      },
    },
  },
  VfListForm: {
    component: VfListForm,
    label: "1对多表单录入",
    icon: "IconOrderedList",
    dataType: DataType.array,
    dataModel: "IModel",
    props: {
      showInput: false,
    },
  },
};

/**
 * 视图类组件
 */
export const ViewComponents: CompDatas = {};
