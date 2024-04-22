/**
 * 回车触发型查询框支持字符串和数字
 * 1. 默认最小化展示
 * 2. 获得焦点最大化
 * 2. 回车触发onDataChange传出input里的搜索字段
 */
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconSearch } from "@douyinfe/semi-icons";
import { Button, Input, Tooltip } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { InputNumber } from "@formily/semi";
interface VfSearchProps {
  onDataChange: (data: string | number | undefined) => void; //回车的回调事件
  onChange?: (data: string | number | undefined) => void; //数据有改变的回调
  value?: string | number;
  tooltip?: string; //pop提示
  hideBtn?: boolean; //隐藏按钮
  className?: string;
  fieldType?: "string" | "number";
  placeholder?: string; //input内部提示
}
const VfSearch = ({
  onDataChange,
  className,
  tooltip,
  value,
  onChange,
  fieldType = "string",
  hideBtn = false,
  placeholder = "搜索 按Enter确认",
}: VfSearchProps) => {
  const [showInput, setShowInput] = useState(false);
  const [searchValue, setSearchValue] = useState<string | number | undefined>(
    value
  );
  const ref = useRef<HTMLInputElement | null>(null);
  const handleSearchClick = useCallback(() => {
    setShowInput(true);
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 0);
  }, [ref]);
  const handleInputBlur = () => {
    if (searchValue === "") {
      setShowInput(false);
    }
  };
  const handleInputKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onDataChange(searchValue);
    }
  };
  const handleInputChange = useCallback(
    (e: string | number) => {
      setSearchValue(e);
      onChange && onChange(e);
    },
    [searchValue, onChange]
  );
  const SearchInput = useMemo((): ReactNode => {
    const Component = fieldType === "string" ? Input : InputNumber;
    return (
      <Component
        className={classNames({ hidden: showInput })}
        ref={ref}
        prefix={fieldType === "string" ? <IconSearch /> : undefined}
        value={searchValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyPress={handleInputKeyPress}
        placeholder={placeholder}
      />
    );
  }, [
    ref,
    searchValue,
    handleInputChange,
    handleInputBlur,
    onChange,
    handleInputKeyPress,
    classNames,
  ]);
  return (
    <div className={`${className}`} id="tooltip-container">
      {showInput || hideBtn === true ? (
        tooltip ? (
          <Tooltip content={tooltip} visible={showInput}>
            {SearchInput}
          </Tooltip>
        ) : (
          SearchInput
        )
      ) : (
        <Button
          theme="borderless"
          className={classNames({ hidden: !showInput })}
          onClick={handleSearchClick}
          icon={<IconSearch />}
          block
        >
          搜索
        </Button>
      )}
    </div>
  );
};
export default VfSearch;
