import { Checkbox, Divider } from "@douyinfe/semi-ui";
import { Section } from "@formily/semi";
import { VfBaseProps } from "@src/dsl/schema/component";
import React from "react";

export interface PageSelectData {
  groupName: string;
  details: { label: string; value: string }[];
}

/**
 * 页面多选组件
 */
interface PageSelectProps extends VfBaseProps<string[], PageSelectData[]> {
  datas: PageSelectData[];
}

const PageSelect = ({
  datas = [],
  value = [],
  onDataChange,
}: PageSelectProps) => {
  return (
    <div>
      {datas
        ?.filter((d) => d.details && d.details.length > 0)
        .map((d) => {
          return (
            <div className=" ">
              <Divider align="left">{d.groupName}</Divider>
              <div>
                <ul role="list" className="grid  p-2 gap-4 grid-cols-6">
                  {d.details?.map((dd) => {
                    return (
                      <li className="flex">
                        {dd.label}
                        {/* {JSON.stringify(value?.includes(dd.value))} */}
                        <Checkbox
                          checked={value?.includes(dd.value)}
                          onChange={(v) => {
                            if (v.target.checked && value === null) {
                              // alert(dd.value);
                              onDataChange([dd.value]);
                            } else if (
                              v.target.checked &&
                              !value?.includes(dd.value)
                            ) {
                              // alert(dd.value);
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
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PageSelect;
