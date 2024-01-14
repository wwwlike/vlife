import React, { useEffect, useState } from "react";
import { Select } from "@douyinfe/semi-ui";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { sourceType } from "@src/dsl/base";
import { apiDatas } from "@src/resources/ApiDatas";
import CompLabel from "./CompLabel";

/**
 * 数据过滤配置组件
 */
interface FilterSettingProp {
  data: Partial<PageComponentPropDto>;
  onDataChange: (data: {
    filterFunc: string;
    filterConnectionType: string;
  }) => void;
}

/* 当前接口可配置的过滤器选择 */
export default ({ data, onDataChange }: FilterSettingProp) => {
  const [filterOptions, setFilterOpen] = useState([]);

  useEffect(() => {}, []);

  return (
    <>
      {data.propVal &&
        data.sourceType === sourceType.api &&
        apiDatas[data.propVal]?.filters &&
        (data.relateVal === undefined ||
          apiDatas[data.propVal]?.match?.[data.relateVal].filterKey?.length !==
            0) && ( //！==0表示!==[]类型表示可以使用过滤器
          <>
            <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
              <CompLabel
                blod={false}
                label={"数据筛选"}
                icon={<i className={` icon-filter_list  text-gray-400 `} />}
              />
              <Select
                showClear
                multiple
                placeholder={"对数据做进一步过滤"}
                style={{ width: "90%" }}
                value={
                  data && data.filterFunc && data.filterFunc.length > 0
                    ? data.filterFunc.split(",")
                    : undefined
                }
                optionList={Object.keys(apiDatas[data.propVal]?.filters || {})
                  .filter(
                    (k) =>
                      apiDatas[data.propVal]?.match?.[data?.relateVal || ""]
                        .filterKey === undefined ||
                      apiDatas[data.propVal]?.match?.[
                        data?.relateVal || ""
                      ].filterKey?.includes(k)
                  )
                  .map((d: string) => {
                    return {
                      label: apiDatas[data.propVal]?.filters?.[d].title,
                      value: d,
                    };
                  })}
                onChange={(e) => {
                  onDataChange({
                    filterFunc: e?.toString() || "",
                    filterConnectionType: data.filterConnectionType || "or",
                  });
                }}
              />
            </div>
            {data.filterFunc && data.filterFunc.split(",").length > 1 && (
              <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                <CompLabel
                  blod={false}
                  label={"筛选整合"}
                  remark={"经过2个以上筛选过滤器分别处理后的数据连接整合方式"}
                  icon={<i className=" text-red-400 icon-link_record" />}
                />
                <Select
                  showClear
                  style={{ width: "90%" }}
                  optionList={[
                    { label: "取多次筛选的交集数据", value: "and" },
                    { label: "取多次筛选的并集数据", value: "or" },
                  ]}
                  value={data.filterConnectionType}
                  onChange={(e) => {
                    onDataChange({
                      filterFunc: data.filterFunc || "",
                      filterConnectionType: e?.toString() || "",
                    });
                  }}
                />
              </div>
            )}
          </>
        )}
    </>
  );
};
