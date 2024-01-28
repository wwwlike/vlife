import React, { useEffect, useMemo, useState } from "react";
import VlifeForm, { FormProps } from "@src/components/form";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/api/Form";
import { IdBean } from "@src/api/base";
import { VfAction } from "@src/dsl/VF";
import { useNavigate } from "react-router-dom";
import { IconSetting } from "@douyinfe/semi-icons";
import { Tooltip } from "@douyinfe/semi-ui";
const mode = import.meta.env.VITE_APP_MODE;
/**
 * 入参：formData=> 表单初始化数据
 * 内部逻辑
 * 请求表单模型->提取字典模型
 * formData+表单模型->请求外键信息
 * 1. 表单数据提取
 * 2. 字典数据提取
 * 3. 外键数据提取
 * 4. 数据透传
 */

export interface FormPageProps<T extends IdBean>
  extends Omit<FormProps<T>, "modelInfo"> {
  type: string; //模型标识
  title?: string; //表单名称
  modelInfo?: FormVo; //模型信息可选，设计表单时实时传
  //字段级联配置
  onVfForm?: (formVo: FormVo) => void; //模型信息对外
  // formData
  modifyData?: any; //其他场景修改得更新进来以该数据进行展示
  reaction?: VfAction[];
}
const FormPage = <T extends IdBean>({
  title,
  type,
  modelInfo,
  className,
  design,
  onDataChange,
  onClickFieldComponent,
  onVfForm,
  onForm,
  onSubForm,
  reaction,
  formData,
  modifyData,
  ...props
}: FormPageProps<T>) => {
  const navigate = useNavigate();
  const { getDict, getFormInfo, groups, user } = useAuth();
  //模型信息
  const [model, setModel] = useState<FormVo | undefined>(
    modelInfo ? { ...modelInfo } : undefined
  );
  //表单数据初始化
  const [formPageData, setFormPageData] = useState<any>(formData);

  //模型信息提取，模型信息返回
  useEffect(() => {
    if (model === undefined) {
      getFormInfo({ type }).then((data) => {
        if (data?.id) {
          setModel(data);
          if (onVfForm) {
            onVfForm(data);
          }
        }
      });
    }
  }, [type, design, groups]);

  //模型信息提取，模型信息返回
  useEffect(() => {
    if (modelInfo) {
      setModel({ ...modelInfo });
    }
  }, [JSON.stringify(modelInfo)]);

  //form数据
  const initData = useMemo(() => {
    if (modifyData) {
      //二次传值使用
      return modifyData;
    } else if (formPageData) {
      //初始值使用
      return formPageData;
    } else if (model) {
      //没传值使用默认值
      let defaultData: any = {};
      model.fields.forEach((field) => {
        if (field.initialValues && field.fieldName) {
          defaultData[field.fieldName] = field.initialValues;
        }
      });
      return defaultData;
    } else {
      return {};
    }
  }, [model, modifyData, formPageData]);

  //新增时隐藏修改时只读
  const formPageReaction = useMemo((): VfAction[] => {
    let pageReaction: VfAction[] = [];
    return reaction ? [...reaction, ...pageReaction] : pageReaction;
  }, [reaction, model, design, initData]);

  //级联响应设置信息
  const vfs = useMemo(() => {
    return formPageReaction && formPageReaction.length > 0
      ? [...formPageReaction.map((f) => f.getVF())]
      : [];
  }, [formPageReaction]);

  const vlife_form = useMemo(() => {
    if (model) {
      return (
        <VlifeForm
          {...props}
          fontBold={props.fontBold}
          key={initData?.id + "_" + props.key}
          onClickFieldComponent={onClickFieldComponent}
          className={className}
          modelInfo={model}
          design={design}
          vf={props.vf || vfs}
          formData={initData}
          onDataChange={(data, field) => {
            if (onDataChange) {
              onDataChange(data, field);
            }
          }}
          highlight={props.highlight}
          onForm={onForm}
          onSubForm={onSubForm}
        />
      );
    } else {
      return <>{type}模型无法解析，请检查名称是否准确</>;
    }
  }, [
    model,
    initData,
    reaction,
    props.highlight,
    title,
    vfs,
    getDict,
    props.vf,
  ]);
  //级联操作
  return (
    <>
      {vlife_form}
      {modelInfo === undefined && user?.superUser === true && (
        <div
          onClick={() => {
            navigate(`/sysConf/formDesign/${type}`);
          }}
          className=" absolute top-2 right-2 font-bold text-gray-500 hover:text-blue-500 cursor-pointer"
        >
          <Tooltip content="表单配置">
            <IconSetting />
          </Tooltip>
        </div>
      )}
    </>
  );
};
// };
export default FormPage;
