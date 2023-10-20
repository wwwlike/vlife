 //文档信息
 export interface compPropDoc{
  attr: string; //属性名
  interface: string; //类型
  default?: string; //默认值
  remark: string;//描述
  tooltip?:string;
 }

 export const FormPropDoc:compPropDoc[]=
  [
    {
      attr: "type",
      interface: "string",
      remark: "模型标识",
    },
    {
      attr: "modelInfo",
      interface: "FormVo",
      remark: "模型信息(和type二者传一)",
    },
    {
      attr: "formData",
      interface: "IdBean",
      remark: "表单数据",
    },
    {
      attr: "terse",
      interface: "boolean",
      default: "false",
      remark: "布局紧凑",
    },
    {
      attr: "fontBold",
      interface: "boolean",
      default: "false",
      remark: "标题加粗",
    },
    {
      attr:"ignoredFields",
      interface: "Array<string>",
      default: "[]",
      remark: "表单隐藏的字段",
    }
  ]

  export const TablePropDoc:compPropDoc[]=[]


  export const BtnPropDoc:compPropDoc[]=[
    {
      attr: "title",
      interface: "string",
      remark: "按钮名称",
    },{
      attr: "icon",
      interface: "ReactNode",
      remark: "按钮图标",
    },{
      attr: "actionType",
      interface: "create|edit|api|custom",
      remark: "触发操作类型",
    },{
      attr: "usableMatch",
      interface: "boolean|any|((...datas:any[])=>string|undefined)",
      remark: "按钮可用数据匹配表达式|对象|函数",
    },{
      attr: "permissionCode",
      interface: "string",
      remark: "权限编码",
    },{
      attr: "multiple",
      interface: "boolean",
      default:"false",
      remark: "是否支持操作多条数据",
    },{
      attr: "model",
      interface: "string",
      remark: "操作数据归属模型",
    },{
      attr: "submitConfirm",
      interface: "boolean",
      default:"true",
      remark: "提交前是否确认",
    },{
      attr: "disabledHide",
      interface: "boolean",
      remark: "按钮不可用时是否隐藏",
    },{
      attr: "submitClose",
      interface: "boolean",
      remark: "提交完成后打开的页面是否关闭",
    },{
      attr: "saveApi",
      interface: "(...data:(any&{tableSort:number})[])>=>Promise<Result<any>>",
      remark: "按钮提交数据到后台的接口",
    },{
      attr: "onClick",
      interface: "(...data:(any&{tableSort:number})[])=>void",
      remark: "点击按钮触发的同步方法",
    },{
      attr: "loadApi",
      interface: "(id:string)=>Promise<Result<any>>",
      remark: "查询明细接口",
      tooltip:"修改之前和列表模型不一致需要传"
    },{
      attr: "onSaveBefore",
      interface: "(data:any)=>any",
      remark: "提交之前进行数据处理，返回数据给saveData函数",
    },{
      attr: "onSubmitFinish",
      interface: "(...datas:any[])=>void",
      remark: "提交完成后触发的函数",
    }
  ]