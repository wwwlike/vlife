import React from "react";
import { Banner, Checkbox } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/schema/component";

export interface PageSelectData {
  groupName: string;
  details: { label: string; value: string }[];
}

/**
 * 页面多选组件
 */
interface PageSelectProps extends VfBaseProps<string[], PageSelectData[]> {
  datas: PageSelectData[];
  dataEmpty: string; //空数据文案
}

const PageSelect = ({
  datas = [],
  dataEmpty,
  value = [],
  onDataChange,
}: PageSelectProps) => {
  return (
    <div>
      {datas &&
      datas?.filter((d) => d.details && d.details.length > 0).length > 0 ? (
        datas
          // ?.filter((d) => d.details && d.details.length > 0)
          .map((d) => {
            return (
              <div className=" ">
                <div className="flex items-center border-b border-gray-200">
                  <div className=" text-fontBold text-blue-500">
                    {d.groupName}
                  </div>
                  <Checkbox
                    defaultChecked
                    className=" m-2"
                    aria-label={d.groupName}
                  ></Checkbox>
                </div>
                <div>
                  <ul role="list" className="grid p-2 gap-4 grid-cols-6">
                    {d.details?.map((dd) => {
                      return (
                        <li className="flex">
                          <Checkbox
                            checked={value?.includes(dd.value)}
                            onChange={(v) => {
                              if (v.target.checked && value === null) {
                                onDataChange([dd.value]);
                              } else if (
                                v.target.checked &&
                                !value?.includes(dd.value)
                              ) {
                                onDataChange([...value, dd.value]);
                              }
                              if (
                                v.target.checked === false &&
                                value?.includes(dd.value)
                              ) {
                                onDataChange(
                                  value?.filter((v) => v !== dd.value)
                                );
                              }
                            }}
                          >
                            {dd.label}
                          </Checkbox>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })
      ) : (
        <Banner type="warning" description={dataEmpty} />
      )}
    </div>
  );
};
export default PageSelect;
