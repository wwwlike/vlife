import { useCallback, useEffect, useState } from "react"
import { IWorkFlowNode } from "../interfaces"
import { useEditorEngine } from "./useEditorEngine"

//获取起始节点
export function useStartNode() {
  const [startNode, setStartNode] = useState<IWorkFlowNode>()
  //dlc取得上下文对象engine 类型为：
  const engine = useEditorEngine()

  //引擎起始节点变化事件处理函数
  const handleStartNodeChange = useCallback((startNode: IWorkFlowNode) => {
    setStartNode(startNode)
  }, [])

  useEffect(() => {
    //订阅起始节点变化事件
    const unsub = engine?.subscribeStartNodeChange(handleStartNodeChange)
    return unsub
  }, [handleStartNodeChange, engine])

  //初始化时，先拿到最新数据
  useEffect(() => {
    setStartNode(engine?.store.getState().startNode)
  }, [engine?.store])

  return startNode
}