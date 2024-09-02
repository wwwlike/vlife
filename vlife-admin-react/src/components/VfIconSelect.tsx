import React, { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Dropdown, Input } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { VfBaseProps } from "@src/dsl/component";

export interface VfIconSelectProps extends VfBaseProps<string> {}
//按钮选择组件
//大小,颜色
export default (props: VfIconSelectProps) => {
  const sizeArray = ["sm", "base", "lg", "xl", "2xl"];
  const [size, setSize] = useState<string>();
  const [icon, setIcon] = useState<string>();
  const [iconNames, setIconNames] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();

  useEffect(() => {
    const styleSheets = document.styleSheets;
    const iconNames: string[] = [];
    for (let i = 0; i < styleSheets.length; i++) {
      const rules = (styleSheets[i] as CSSStyleSheet).cssRules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j] as CSSStyleRule;
          if (rule.selectorText && rule.selectorText.startsWith(".icon-")) {
            const iconName = rule.selectorText
              .replace(".icon-", "")
              .replace("::before", ""); // 去掉"::before"后缀
            if (
              (search &&
                search.length > 0 &&
                search
                  .split(" ")
                  .filter((s) => s.length > 0 && iconName.includes(s)).length >
                  0) ||
              search === undefined ||
              search.length === 0
            ) {
              iconNames.push(iconName);
            }
          }
        }
      }
    }
    setIconNames(iconNames);
  }, [search]);
  const menuRef = useRef(null);
  return (
    <Dropdown
      ref={menuRef}
      trigger={"click"} //点击触发
      // clickToHide={true}
      stopPropagation={true}
      className={`${props.className} border-2  items-center justify-center`}
      render={
        <div className="  border-red-700 relative  p-1  w-96">
          <div className="flex items-center mb-2">
            <div className="w-20  font-bold">关键词：</div>
            <div>
              <Input
                // clearIcon
                showClear={true}
                size="small"
                onChange={(v) => {
                  setSearch(v);
                }}
                value={search}
              />
            </div>
          </div>

          <div className="flex overflow-y-auto inset-0 flex-wrap gap-2 h-96">
            {iconNames.map((iconName, index) => (
              <i
                key={`${iconName + index}`}
                onMouseDown={() => setIcon(iconName)}
                className={`  
        hover:text-blue-500  
        ${classNames({ ["text-" + size]: size !== undefined })}  
        icon-${iconName} cursor-pointer transition-all duration-200 transform mb-1`} // 加入 mb-1 以调整垂直边距
              />
            ))}
          </div>
          <div className="flex items-center mt-2">
            <div className=" w-20 text-center">尺寸：</div>
            <div className="flex space-x-2 so">
              {sizeArray.map((s) => (
                <div
                  key={s}
                  onDoubleClick={() => {
                    if (s === size) {
                      setSize(undefined);
                    } else {
                      setSize(s);
                    }
                  }}
                  onClick={() => {
                    if (s === size) {
                      setSize(undefined);
                    } else {
                      setSize(s);
                    }
                  }}
                  className={`
              ${classNames({
                " bg-blue-500 text-red-300 border-white": s === size,
                " bg-blue-100 hover:bg-blue-400 text-black border-blue-400":
                  s !== size,
              })}
              py-1 px-3  cursor-pointer  border rounded border-dashed`}
                >
                  {s}
                </div>
              ))}
              <div></div>
            </div>
          </div>
        </div>
      }
    >
      <i className={icon || "icon-add_circle_outline"} />
    </Dropdown>
  );
};
