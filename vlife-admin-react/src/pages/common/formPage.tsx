import React, { useEffect, useMemo, useRef, useState } from "react";
import VlifeForm, { FormProps } from "@src/components/form";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/api/Form";
import { IdBean } from "@src/api/base";
import { VfAction } from "@src/dsl/VF";
import { useNavigate } from "react-router-dom";
import { IconSetting } from "@douyinfe/semi-icons";
import { Tooltip } from "@douyinfe/semi-ui";
import FormFlowContainer from "@src/workflow/FormFlowContainer";
import { FlowNode, RecordFlowInfo } from "@src/api/Flow";

export interface FormPageProps<T extends IdBean>
  extends Omit<FormProps<T>, "modelInfo"> {
  type: string; //模型标识
  title?: string; //表单名称
  modelInfo?: FormVo; //模型信息可选，设计表单时实时传
  onVfForm?: (formVo: FormVo) => void; //模型信息对外
  modifyData?: any; //其他场景修改得更新进来以该数据进行展示
  reaction?: VfAction[]; //字段级联配置
  flowHistorys?: FlowNode[]; //审批历史信息
  flowBasic?: RecordFlowInfo; //流程基本信息
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
  flowHistorys,
  flowBasic,
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
    modelInfo && { ...modelInfo }
  );
  //表单数据初始化(仅第一次有效)
  const [formPageData, setFormPageData] = useState<any>(formData);
  const formDataRef = useRef(formData);

  //模型信息提取，模型信息返回
  useEffect(() => {
    if (model === undefined) {
      getFormInfo({ type }).then((data) => {
        setModel(data);
        onVfForm && data && onVfForm(data);
      });
    }
  }, [type, design, groups]);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  useEffect(() => {
    setFormPageData(formDataRef.current);
  }, [flowBasic]);
  //实时模型信息
  useEffect(() => {
    if (modelInfo) {
      setModel({ ...modelInfo });
    }
  }, [JSON.stringify(modelInfo)]);

  //默认值初始化数据
  const initData = useMemo(() => {
    let defaultData: any = {};
    model?.fields.forEach((field) => {
      if (field.initialValues && field.fieldName) {
        defaultData[field.fieldName] = field.initialValues;
      }
    });
    return defaultData;
  }, [model]);

  const initData1 = useMemo(() => {
    if (modifyData) {
      //二次传值使用
      return modifyData;
    } else if (formPageData) {
      //初始值使用
      return formPageData;
    } else if (model) {
      //使用配置的默认值
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
    return [
      ...(props.vf ? props.vf : []),
      ...(formPageReaction && formPageReaction.length > 0
        ? formPageReaction.map((f) => f.getVF())
        : []),
    ];
  }, [props.vf, formPageReaction]);

  //整合了流程的模型
  const _model = useMemo((): FormVo | undefined => {
    if (model && flowBasic?.auditInfo?.fields) {
      return {
        ...model,
        fields: model.fields.map((f) => {
          const access = flowBasic.auditInfo.fields.filter(
            (ff) => f.fieldName === ff.fieldName
          )?.[0]?.access;
          if (access === undefined || access === null || access == "Readable") {
            return { ...f, x_read_pretty: true };
          } else if (access === "hide") {
            return { ...f, x_hidden: true };
          } else {
            return f;
          }
        }),
      };
    }
    return model;
  }, [flowBasic, model]);

  return (
    <FormFlowContainer className={className} historys={flowHistorys}>
      {/* {JSON.stringify(flow?.auditInfo?.fields.length)} */}
      {_model ? (
        <>
          {/* {JSON.stringify(modifyData || formPageData || initData)} */}
          <VlifeForm
            {...props}
            fontBold={props.fontBold}
            key={initData?.id + "_" + props.key}
            onClickFieldComponent={onClickFieldComponent}
            modelInfo={_model}
            //流程结束只读状态
            readPretty={flowBasic?.nodeId === "end"}
            design={design}
            vf={vfs}
            formData={modifyData || formPageData || initData}
            onDataChange={(d, f) => {
              onDataChange?.(d, f);
            }}
            highlight={props.highlight}
            onForm={onForm}
            onSubForm={onSubForm}
          />
          {user?.superUser === true && (
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
      ) : (
        <>{type}模型无法解析，请检查名称是否准确</>
      )}
    </FormFlowContainer>
  );
};
// };
export default FormPage;
