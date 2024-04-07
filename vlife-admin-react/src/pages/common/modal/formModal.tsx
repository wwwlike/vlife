import React, { useCallback, useEffect, useMemo, useState } from "react";
import NiceModal, { createNiceModal } from "@src/store";
import { Form, IFormFeedback } from "@formily/core";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import FormPage, { FormPageProps } from "../formPage";
import { VFBtn } from "@src/components/button/types";
import { Switch } from "@douyinfe/semi-ui";
import classNames from "classnames";
import {
  findProcessDefinitions,
  FlowNode,
  queryHistoricInfo,
  RecordFlowInfo,
} from "@src/api/Flow";
import BtnToolBar from "@src/components/button/BtnToolBar";
/**
 * 表单弹出层属性
 */
export interface FormModalProps extends FormPageProps<any> {
  width?: number; //modal宽度
  btns: VFBtn[]; //
  saveFun?: <T extends IdBean>(dto: Partial<T>) => Promise<T>; //表单保存触发的方法(已经废弃当前采用BtnToolBar里的保存)
}

/**
 * model信息没有在数据库里初始化则不能采用
 * 传save则用传入的save进行保存，否则就用通用保存方法进行
 * 因为是modal窗口，固数据不需要传输出去
 * initData 数据初始化
 * formData 表单录入后的数据
 * table里触发调用， formPage里获取组件返回给
 */
export const FormModal = createNiceModal(
  "formModal",
  ({
    modelInfo, //模型信息
    formData, //表单数据
    width,
    saveFun,
    onError,
    onDataChange,
    btns,
    ...props
  }: FormModalProps) => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const [_continueCreate, setContinueCreate] = useState<
      boolean | undefined
    >();

    const [formNumber, setFormNumber] = useState<number>(0);
    // const [modifyData, setModifyData] = useState(props.modifyData);
    //按钮上的数据
    const [data, setData] = useState(formData);
    const [recordFlowInfo, setRecordFlowInfo] = useState<RecordFlowInfo>(); //流程基本信息
    const [historys, setHistorys] = useState<FlowNode[]>();
    const [form, setForm] = useState<Form>(); // formliy的form
    const [errors, setErrors] = useState<IFormFeedback[]>([]);
    const [formVo, setFormVo] = useState<FormVo | undefined>(modelInfo);

    //请求该条记录的流程信息和历史审核信息
    const getFlowInfo = useCallback(() => {
      if (formVo && formVo.flowJson && data && data.id) {
        findProcessDefinitions({
          businessKeys: [data.id],
          defineKey: formVo.type,
        }).then((d) => {
          setRecordFlowInfo(d?.data?.[0]);
          //流程开始则查询各个历史节点信息
          if (d?.data?.[0]?.started === true) {
            queryHistoricInfo({
              businessKey: data.id,
              defineKey: formVo.type,
            }).then((d) => {
              setHistorys(d.data);
            });
          }
        });
      }
    }, []);

    useEffect(() => {
      getFlowInfo();
    }, []);

    const title = useMemo(() => {
      const no = data?.no || "";
      if (props.title) return props.title;
      if (formVo === undefined) {
        return `“${props.type}”模型标识不存在`;
      }
      return props.readPretty
        ? formVo?.name + "详情" + no
        : form?.values?.id
        ? formVo?.name + no
        : "新建(" + formVo?.name + ")";
    }, [data, form, formVo]);

    //可用按钮过滤，以及提交检查函数封装
    const formBtns = useMemo((): VFBtn[] => {
      if (btns && form) {
        return btns.map((f) => {
          return {
            ...f,
            btnType: "button",
            position: "formFooter",
            datas: { ...data, flow: recordFlowInfo }, //formPage的数据通过它传
            onSubmitFinish: (_data) => {
              if (
                _continueCreate === true ||
                (_continueCreate === undefined && f.continueCreate === true)
              ) {
                setData(undefined);
                setFormNumber((num) => num + 1);
              } else {
                setData(_data);
              }
              //流程类型按钮触发流程信息提取
              if (f.actionType === "flow") {
                getFlowInfo();
              }
              if (f.onSubmitFinish) {
                f.onSubmitFinish(_data);
              }
            },
            onFormilySubmitCheck: (): Promise<boolean> => {
              return (
                form.submit().then((d) => {
                  return true;
                }) ||
                new Promise((resolve) => {
                  resolve(false);
                })
              );
            },
          };
        });
      }
      return [];
    }, [btns, form, formVo, data, recordFlowInfo]);

    const footer = useMemo(() => {
      if (formBtns && formBtns.length > 0) {
        return (
          <div className="flex w-full justify-end relative  space-x-1">
            {formBtns.map((btn, index) => {
              return (
                <>
                  {btn.actionType === "create" &&
                    (_continueCreate !== undefined ||
                      btn.continueCreate !== false) && (
                      <div
                        key={`continueDIv_${index}`}
                        className=" absolute flex left-2  items-center"
                      >
                        <span
                          className={`text-gray-400 ${classNames({
                            " !text-gray-800":
                              _continueCreate !== undefined
                                ? _continueCreate
                                : btn.continueCreate,
                          })}`}
                        >
                          连续新增
                        </span>
                        <Switch
                          checked={
                            _continueCreate !== undefined
                              ? _continueCreate
                              : btn.continueCreate
                          }
                          onChange={(t) => {
                            setContinueCreate(t);
                          }}
                          checkedText="开"
                          uncheckedText="关"
                        />
                      </div>
                    )}
                </>
              );
            })}
            <BtnToolBar
              datas={[{ ...data, flow: recordFlowInfo }]}
              btns={formBtns}
              formModel={modelInfo?.type}
              position="formFooter"
              btnType="button"
            />
          </div>
        );
      } else {
        return <div>{/* <Button onClick={handleSubmit}>确定</Button> */}</div>;
      }
    }, [formBtns, data, form, _continueCreate, recordFlowInfo]);

    const modalWidth = useMemo(() => {
      const formWidth = width
        ? width
        : formVo?.modelSize === 4
        ? 1200
        : formVo?.modelSize === 3
        ? 1000
        : formVo?.modelSize === 2
        ? 800
        : formVo?.modelSize === 1
        ? 600
        : 900; //默认900
      //启动的流程表单扩展宽度300px
      // if (formData?.flow && formData?.flow?.started) {
      if (historys && historys.length > 0) {
        return formWidth + 300;
      }
      return formWidth;
    }, [width, historys, formVo]);

    return (
      <NiceModal
        id="formModal"
        height={(windowSize.height / 3) * 2}
        footer={footer}
        title={title}
        className="max-h-96"
        width={modalWidth}
        // onOk={handleSubmit}
      >
        {/* 弹出层不传表单给formPage,并且还从回调接收FormVo */}
        <FormPage
          key={`modal${data?.id + formNumber}`}
          onError={setErrors}
          formData={data}
          modelInfo={modelInfo}
          flowHistorys={historys} //流程历史记录
          flowBasic={recordFlowInfo} //流程基本信息
          modifyData={props.modifyData}
          onDataChange={(d, field) => {
            setData((old: any) => {
              return { ...d };
            });
          }}
          onForm={(f) => {
            setForm(f);
          }}
          onVfForm={setFormVo} //vf模型信息
          {...props}
        />
      </NiceModal>
    );
  }
);

export default FormModal;
