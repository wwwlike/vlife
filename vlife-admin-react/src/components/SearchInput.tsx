import React, { useState } from "react";
import { IconSearch } from "@douyinfe/semi-icons";
import { Input } from "@douyinfe/semi-ui";
import { InputProps } from "@douyinfe/semi-ui/lib/es/input";
import { VfBaseProps } from "@src/dsl/component";
import { useUrlQueryParam } from "@src/hooks/useForm";
import { useDebounceEffect } from "ahooks";

interface SearchProps extends Partial<VfBaseProps<string, null>> {
  seconds?: number; //延迟毫秒数
}
/**
 * 可从url里去<fieldName>作为初始值
 * 搜索延迟，传参出去，并改变url
 * 该url最终要一直道form里去，req的form则能改
 */
const SearchInput = ({
  seconds = 400,
  onDataChange,
  value,
  fieldInfo,
  design,
  ...props
}: SearchProps & InputProps) => {
  const [urlParam, setUrlParam] = useUrlQueryParam([
    fieldInfo?.fieldName || "",
  ]);
  const [searchValue, setSearchValue] = useState(
    urlParam[fieldInfo?.fieldName || ""]
      ? urlParam[fieldInfo?.fieldName || ""]
      : value
  );
  useDebounceEffect(
    () => {
      if ((searchValue || searchValue === "") && design !== true) {
        //注释掉，在url里出影响modal弹出
        // setUrlParam({ [fieldInfo?.fieldName || ""]: searchValue });
      }
      if (onDataChange && searchValue !== undefined) {
        onDataChange(searchValue);
      }
    },
    [searchValue],
    {
      wait: seconds,
    }
  );
  return (
    <Input
      placeholder={
        props.placeholder
          ? props.placeholder
          : "按照" + fieldInfo?.title + "搜索"
      }
      prefix={<IconSearch />}
      value={searchValue}
      onChange={(v) => {
        setSearchValue(v);
      }}
      showClear
    />
  );
};
export default SearchInput;
