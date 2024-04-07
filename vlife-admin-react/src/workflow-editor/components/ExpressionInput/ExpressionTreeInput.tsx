import { memo } from "react";
import { IExpressionGroup } from "../../interfaces";
import { ExpressionInputProps } from "./ExpressionInputProps";
import { ExpressionGroup } from "./ExpressionGroup";

export const ExpressionTreeInput = memo((
  props: {
    ExpressInput: React.FC<ExpressionInputProps>,
    value: IExpressionGroup,
    onChange?: (value: IExpressionGroup) => void
  }
) => {
  const { ExpressInput, value, onChange } = props

  return (
    <ExpressionGroup
      ExpressInput={ExpressInput}
      value={value}
      onChange={onChange}
      root
    />
  )
})