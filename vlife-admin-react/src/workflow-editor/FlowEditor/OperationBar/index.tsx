import { Space, Button } from "antd"
import { memo, useCallback } from "react"
import { MiniFloatContainer } from "../ZoomBar"
import { undoIcon, redoIcon } from "../../icons"
import { useRedoList } from "../../hooks/useRedoList"
import { useUndoList } from "../../hooks/useUndoList"
import { useEditorEngine } from "../../hooks"

export const OperationBar = memo((
  props: {
    float?: boolean,
  }
) => {
  const { float } = props
  const redoList = useRedoList();
  const undoList = useUndoList();

  const store = useEditorEngine();

  const handleUndo = useCallback(()=>{
    store?.undo()
  },[store])

  const handleRedo = useCallback(()=>{
    store?.redo()
  },[store])

  return (
    <MiniFloatContainer className={"workflow-operation-bar" + (float ? " float" : "")}>
      <Space>
        <Button
          type={"text"}
          size="small"
          icon={undoIcon}
          disabled={undoList.length === 0}
          onClick={handleUndo}
        />
        <Button
          type={"text"}
          size="small"
          disabled={redoList.length === 0}
          icon={redoIcon}
          onClick = {handleRedo}
        />
      </Space>
    </MiniFloatContainer>
  )
})