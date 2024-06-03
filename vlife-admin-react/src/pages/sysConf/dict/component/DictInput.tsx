import { Input } from "@douyinfe/semi-ui";
import { save } from "@src/api/SysDict";
import { useAuth } from "@src/context/auth-context";
import classNames from "classnames";
import { useEffect, useState } from "react";
/**
 * 快速增加字典
 */
interface QuickDictProps {
  dictCode?: string; //字典编码
}
export default ({ dictCode, ...props }: QuickDictProps) => {
  const { datasInit, dicts } = useAuth();
  const { user } = useAuth();
  const [label, setLabel] = useState<string | undefined>();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const filterDict = dicts["vlife"].data.filter((f) => f.value === dictCode);
    if (filterDict?.[0]?.type !== "field" || dictCode === "vlife") {
      setVisible(false);
    }
  }, [dictCode]);
  return visible && user?.superUser ? (
    <div className=" w-full p-2 flex justify-between items-center border-t divide-dashed">
      <div className="">
        <Input
          value={label}
          onChange={(d) => {
            setLabel(d === "" ? undefined : d);
          }}
          placeholder={"快速添加字典信息"}
        />
      </div>
      <i
        style={{ fontSize: "18px" }}
        className={`icon-custom_add_circle   ${classNames({
          "text-gray-300  ":
            label === undefined ||
            label === "" ||
            label === null ||
            dicts[dictCode || ""].data.filter((d) => d.label === label).length >
              0,
          "text-gray-500": label !== undefined,
          " hover:text-gray-900": label !== undefined,
        })}  `}
        onClick={() => {
          if (
            label !== undefined &&
            dicts[dictCode || ""].data.filter((d) => d.label === label)
              .length === 0
          ) {
            save({
              code: dictCode,
              title: label,
              sys: false,
              level: 2,
            }).then((d) => {
              datasInit();
              setLabel(undefined);
            });
          }
        }}
      ></i>
    </div>
  ) : (
    <></>
  );
};
