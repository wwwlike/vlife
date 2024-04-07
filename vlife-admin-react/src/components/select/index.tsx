//vlife单一选择器

import { Checkbox, Tag } from "@douyinfe/semi-ui";
import { IsEmptyObj } from "@reduxjs/toolkit/dist/tsHelpers";
import { ISelect, ITreeData, VfBaseProps } from "@src/dsl/component";
import classNames from "classnames";
import { on } from "process";
import { useCallback, useState } from "react";
import SearchInput from "../SearchInput";

export interface SelectProps extends VfBaseProps<ISelect[]> {
  onGroupClick?: (value: string | undefined) => void; //分组过滤数据
  onSearch?: (value: string | undefined) => void; //input框过滤数据
  label: string; //标签
  groupLabel: String; //分组标签
  groupData?: ISelect[]; //分组数据
  selectData: ISelect[]; //可选择数据
  showSelected?: boolean; //是否显示选中项
  multiple?: boolean; //是否多选
}

/**
 * 1. 分组过滤
 * 2. input框过滤
 */
export default ({
  onSearch,
  onGroupClick,
  label,
  groupData,
  selectData,
  value,
  className,
  multiple = true,
  showSelected = true,
  onDataChange,
}: SelectProps) => {
  const [groupSelected, setGroupSelected] = useState<ISelect>(); //选中的分组过滤
  const [search, setSearch] = useState<string>(); //查询内容
  const groupDiv = useCallback(
    (data: ISelect[], $nbmp: number) => {
      const spaces = Array.from({ length: $nbmp * 2 }, () => "\u00A0").join("");

      return data.map((d: any, index: number) => (
        <div className="cursor-pointer" key={`group_${index}`}>
          <div
            className={`flex py-1 my-1 rounded-md item-center   ${classNames({
              " !bg-orange-100 text-orange-400":
                groupSelected?.value === d.value,

              " hover:bg-gray-100": groupSelected?.value !== d.value,
            })} `}
            onClick={() => {
              setGroupSelected(d);
              onGroupClick?.(d.value);
            }}
          >
            {spaces}
            {$nbmp === 1 && <i className=" text-lg icon-department" />}
            {$nbmp === 2 && <i className=" text-lg icon-multi_level" />}
            {$nbmp !== 2 && $nbmp !== 1 && (
              <i className=" text-lg icon-subprocess" />
            )}
            <div className=" ml-2"> {d.label}</div>
          </div>
          {d.children && groupDiv(d.children, $nbmp + 1)}
        </div>
      ));
    },
    [groupSelected]
  );

  return (
    <div className={`${className} flex h-full  w-full `}>
      <div className=" w-2/3  h-full flex  flex-col ">
        {/* 1. 搜索框 */}
        {onSearch && (
          <SearchInput
            placeholder="指定用户查询"
            className="w-full"
            onDataChange={(d) => {
              if (d) {
                setSearch(d);
                onSearch(d);
              } else {
                setSearch(undefined);
              }
            }}
          />
        )}
        <div className="flex flex-1 p-2">
          {/* 2. 分组条件过滤 */}
          {groupData && onGroupClick && search === undefined && (
            <div className=" w-1/2">
              <div
                onClick={() => {
                  setGroupSelected(undefined), onGroupClick?.(undefined);
                }}
                className={`flex p-2  cursor-pointer rounded-md item-center   ${classNames(
                  {
                    " !bg-orange-100 text-orange-400":
                      groupSelected === undefined,
                    " hover:bg-gray-100": groupSelected !== undefined,
                  }
                )} `}
              >
                全部{label}
              </div>
              {groupDiv(groupData, 1)}
            </div>
          )}
          <div className=" flex m-2  bg-gray-300 border-l border-gray-300 " />
          {/* 3. 可选择数据展示 */}
          <div className=" w-1/2">
            {
              <div className=" flex justify-between">
                <div className="font-bold items-start">
                  {groupSelected?.label || `全部${label}`}
                </div>
                <div className="items-end">
                  {/* <Checkbox onChange={() => {}} /> */}
                </div>
              </div>
            }
            {selectData &&
              selectData.length > 0 &&
              selectData.map((d: ISelect) => (
                <div
                  key={`select_${d.value}`}
                  className={`flex justify-between p-1 transition-all duration-200 transform`}
                >
                  <div className=" items-start">{d.label}</div>
                  <div className=" items-end">
                    <Checkbox
                      value={d.value}
                      checked={value?.map((v) => v.value).includes(d.value)}
                      onChange={() => {
                        if (multiple) {
                          if (value?.map((v) => v.value).includes(d.value)) {
                            onDataChange?.(
                              value?.filter((v) => v.value !== d.value)
                            );
                          } else if (value) {
                            onDataChange?.([...value, d]);
                          } else {
                            onDataChange?.([d]);
                          }
                        } else {
                          if (value?.map((v) => v.value).includes(d.value)) {
                            onDataChange?.([]);
                          } else {
                            onDataChange?.([d]);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ))}

            {(selectData === undefined || selectData.length === 0) && (
              <div className="w-full h-full flex justify-center items-center">
                <i className=" text-2xl icon-widget_examine_empty" /> 暂无
                {label}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 4. 已选择数据查看 */}
      {showSelected && (
        <>
          <div className=" flex m-2  bg-gray-300 border-l border-gray-300 " />
          <div className=" w-1/3">
            <div className="  font-bold"> 已选择({value?.length || 0})</div>
            <div className="  space-x-2 flex flex-wrap">
              {value?.map((v) => {
                return (
                  <Tag
                    onClose={() => {
                      onDataChange?.(
                        value?.filter((rm) => v.value !== rm.value)
                      );
                    }}
                    closable={true}
                  >
                    {v.label}
                  </Tag>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
