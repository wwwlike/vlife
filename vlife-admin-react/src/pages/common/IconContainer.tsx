import React, { useEffect, useState } from "react";
import "@src/common/css/iconfont/iconfont.css";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Notification, Tooltip } from "@douyinfe/semi-ui";
function Icon(props: { iconName: string }) {
  const { iconName } = props;
  return (
    <i
      className={`icon-${iconName}   cursor-pointer transition-all duration-200 transform hover:-translate-y-1`}
    />
  );
}

function IconList() {
  const [iconNames, setIconNames] = useState<string[]>([]);

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
            iconNames.push(iconName);
          }
        }
      }
    }

    setIconNames(iconNames);
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {iconNames.map((iconName, index) => (
        <div key={iconName} className="w-1/12">
          <Tooltip content={iconName}>
            <Icon iconName={iconName} />
            {iconName}
          </Tooltip>
          {/* <CopyToClipboard text={iconName}>
</CopyToClipboard> */}
        </div>
      ))}
    </div>
  );
}

export default IconList;
