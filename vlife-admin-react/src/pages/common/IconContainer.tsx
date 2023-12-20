import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Input, Notification, Tooltip } from "@douyinfe/semi-ui";
import classNames from "classnames";

function IconList() {
  const sizeArray = ["sm", "base", "lg", "xl", "2xl"];
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState<string>();
  // const [color, setColor] = useState();

  const handleCopy = () => {
    setCopied(true);
    // setTimeout(() => {
    //   setCopied(false);
    // }, 5000);
  };
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

  return (
    <div className=" w-full flex  border-red-700 relative ">
      <div>
        <div className="flex items-center">
          <div className=" w-20 text-center">关键词：</div>
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
        <div className="flex items-center mt-2">
          <div className=" w-20 text-center">尺寸：</div>
          <div className="flex space-x-2 so">
            {sizeArray.map((s) => (
              <div
                key={s}
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
        <div className=" h-20">
          {copied ? (
            <>
              <div>
                <span style={{ color: "green" }}>
                  已复制!{" "}
                  {`<i className="  ${classNames({
                    ["text-" + size]: size !== undefined,
                  })} icon-${icon}" />`}
                </span>
              </div>
              <div className=" flex space-x-4 items-center mt-2 justify-center">
                <i className={`icon-${icon}`} />
                {!search && icon && (
                  <Button
                    size="small"
                    onClick={() => {
                      // setSearch(icon.split("_")[0].split("-")[0]);
                      setSearch(icon.replaceAll("_", " "));
                    }}
                  >
                    过滤同类图标
                  </Button>
                )}
                {search && icon && (
                  <Button
                    size="small"
                    onClick={() => {
                      setSearch(undefined);
                      setIcon(undefined);
                      setCopied(false);
                    }}
                  >
                    取消
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex overflow-y-auto left-1/3 absolute top-4 bottom-4 inset-0 flex-wrap gap-4 gap-y-3  w-1/2 ">
        {iconNames.map((iconName, index) => (
          <CopyToClipboard
            key={`${iconName + index}`}
            onCopy={handleCopy}
            text={`<i className=" ${classNames({
              ["text-" + size]: size !== undefined,
            })} icon-${iconName}" />`}
          >
            <i
              onMouseDown={() => setIcon(iconName)}
              className={`
        hover:text-blue-500
        ${classNames({ ["text-" + size]: size !== undefined })}
        icon-${iconName} cursor-pointer   transition-all duration-200 transform `}
            />
          </CopyToClipboard>
        ))}
      </div>
    </div>
  );
}

export default IconList;
