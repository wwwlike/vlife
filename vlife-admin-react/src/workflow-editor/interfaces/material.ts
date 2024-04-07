import { FormVo } from '@src/api/Form'
import { IWorkFlowNode, NodeType } from "./workflow"

//国际化翻译函数，外部注入，这里使用的是@rxdrag/locales的实现（通过react hooks转了一下）
export type Translate = (msg: string) => string | undefined

//物料上下文
export interface IContext {
  //翻译
  t: Translate
}

//节点物料
export interface INodeMaterial<Context extends IContext = IContext> {
  //颜色
  color: string
  //标题
  label: string
  //图标
  icon?: React.ReactElement
  //默认配置
  defaultConfig?: { nodeType: NodeType | string }
  //创建一个默认节点，跟defaultCofig只选一个
  createDefault?: (context: Context) => IWorkFlowNode
  //从物料面板隐藏，比如发起人节点、条件分支内的分支节点
  hidden?: boolean
}

//物料UI配置
export interface IMaterialUI<FlowNode extends IWorkFlowNode, Config = any, Context extends IContext = IContext> {
  //节点内容区
  viewContent?: (node: FlowNode, context: Context) => React.ReactNode
  //属性面板设置组件
  settersPanel?: React.FC<{ value: Config, onChange: (value: Config) => void,formVo?:FormVo }>
  //校验失败返回错误消息，成功返回ture
  validate?: (node: FlowNode, context: Context) => string | true | undefined
}

//物料UI的一个map，用于组件间通过props传递物料UI，key是节点类型
export interface IMaterialUIs {
  [nodeType: string]: IMaterialUI<any> | undefined
}