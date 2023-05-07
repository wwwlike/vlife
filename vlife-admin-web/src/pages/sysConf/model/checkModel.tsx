import { Banner } from "@douyinfe/semi-ui";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import { BannerProps } from "@douyinfe/semi-ui/lib/es/banner";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@src/context/auth-context";
import { useLocation } from "react-router-dom";
import { VfButton } from "@src/dsl/schema/button";
import { IdBean } from "@src/api/base";
/**
 * dev时进行检查
 * 1. 检查所有模型是否存在，
 */
export interface CheckModelProps extends BannerProps {
  modelName?: string[]; //根据模型名称检查
  buttons?: VfButton<any>[]; //根据按钮属性检查
}

export default ({
  modelName = [],
  buttons,
  children,
  ...props
}: CheckModelProps) => {
  const local = useLocation();
  useEffect(() => {
    // window.localStorage.setItem("currRouter", local.pathname);
  }, []);
  // 模型name是否写正确校验结果
  const [modelNameError, setModelNameError] = useState<string[]>([]);
  // api配置错误校验结果
  const [apiErrorMsg, setAPiErrorMsg] = useState<string[]>([]);
  const allModel = useMemo((): string[] => {
    let names = [...modelName];
    if (buttons) {
      buttons.forEach((b: VfButton<IdBean>) => {
        if (b.model && !names.includes(b.model.type)) {
          names.push(b.model.type);
        }
        if (b.model && !names.includes(b.model.entityType)) {
          names.push(b.model.entityType);
        }
      });
    }
    return [...new Set(names)];
  }, [modelName, buttons]);
  const { getFormInfo } = useAuth();
  //根据传入模型信息查找模型信息是否存在
  useEffect(() => {
    if (allModel.length > 0) {
      const err: string[] = [];
      allModel.forEach(async (element) => {
        await getFormInfo({ type: element }).then((d) => {
          // alert(JSON.stringify(d));
          if (d === undefined || d === null || d.type === undefined) {
            err.push(element);
          } else if (d.type !== element) {
            //找的到，说明大小写没有根据驼峰法命名
            err.push(element);
          }
        });
        setModelNameError(err);
      });
    }
  }, [allModel]);

  // 查找模型

  return (
    <>
      {/* {JSON.stringify(buttons)} */}
      {modelNameError && modelNameError.length > 0 ? (
        <div className=" items-center space-y-4">
          {modelNameError.map((e) => {
            return (
              <Banner
                key={"error" + e}
                fullMode={false}
                type="danger"
                bordered
                icon={<IconAlertTriangle />}
                closeIcon={null}
                title={
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    <span className="">
                      {e ? `名称为"${e}”的模型不存在` : "当前没有传模型名称"}
                    </span>
                  </div>
                }
                description={
                  <ul>
                    <li>1. 检查模型拼写是否正确，</li>
                    <li>
                      2. 模型命名需要按照驼峰法命名，如SysUser请传入 sysUser，
                    </li>
                    <li>
                      3.
                      联系后台同学了解模型是否发布(`模型变更需要在idea，运行maven-install命令`)
                    </li>
                  </ul>
                }
                {...props}
              />
            );
          })}
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
