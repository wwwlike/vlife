import react, { ReactNode, useMemo } from "react";
import { Tooltip } from "@douyinfe/semi-ui";
import classNames from "classnames";

export default ({
  label,
  icon,
  code,
  remark,
  required,
  blod = true,
}: {
  blod?: boolean;
  code?: string;
  label?: string;
  remark?: string;
  icon?: ReactNode;
  required?: boolean;
}) => {
  const Thislabel = useMemo((): any => {
    return (
      <div className="flex items-center relative  h-full w-full  ">
        <div className="mr-1">{icon}</div>
        <div className=" h-full">
          {code && !label && <div className="text-sm   ">{code}</div>}
          {!code && label && <div className="text-sm  ">{label}</div>}
          {code && label && (
            <div>
              <div className="text-transparent ">{label}</div>
              <div className="absolute -top-2">
                <div className="text-sm">{code}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </div>
          )}
        </div>
        {required && <span className=" font-bold text-red-600 mr-1">*</span>}
      </div>
    );
  }, [label, code, required]);
  return (
    <div
      className={`text-sm ${classNames({
        "font-semibold": blod,
      })} items-center  text-gray-700 mb-1 mt-0 pr-4 inline-block align-middle leading-5 tracking-normal flex-shrink-0`}
    >
      {remark ? (
        <Tooltip position="left" content={remark}>
          <div className="flex text-center ">{Thislabel}</div>
        </Tooltip>
      ) : (
        <>{Thislabel}</>
      )}
    </div>
  );
};
