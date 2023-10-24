import React, { useCallback, useEffect, useState } from "react";
import { Form } from "@formily/core";
import { Result } from "@src/api/base";
import apiClient from "@src/api/base/apiClient";
import { FormVo } from "@src/api/Form";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { VF } from "@src/dsl/VF";
import { useAuth } from "@src/context/auth-context";
import { Modal } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";

interface ConditionSlotProps {
  fieldName: string;
  pathName: string;
  entityType: string;
  className: string;
  form: Form;
  title: string;
  vf: VF[];
  pageComponentPropDtos: PageComponentPropDto[];
  setKey: any;
}
/**
 * select快捷创建外键表slot的入口
 * 1.有权限可以创建
 * 2.配置了save接口的可创建
 */
export default ({
  fieldName,
  pathName,
  title,
  className,
  setKey,
  form,
  vf,
  pageComponentPropDtos,
  entityType,
}: Partial<ConditionSlotProps>) => {
  const { getFormInfo } = useAuth();
  const [visible, setVisible] = useState(false);
  //保存的数据和方法
  const [formData, setFormData] = useState<any>();
  //取得formVo的列宽
  const [formVo, setFormVo] = useState<FormVo>();
  useEffect(() => {
    getFormInfo({ type: entityType }).then((v) => {
      setFormVo(v);
    });
  }, [entityType]);
  const saveData = useCallback((): Promise<Result<any>> => {
    return apiClient.post(
      `${
        pageComponentPropDtos?.filter((f) => f.propName === "saveData")[0]
          .propVal
      }`,
      formData
    );
  }, [formData, pageComponentPropDtos]);

  return pageComponentPropDtos !== null &&
    pageComponentPropDtos?.filter(
      (f) =>
        f.propName === "saveData" &&
        f.propVal !== null &&
        f.propVal !== undefined &&
        f.propVal !== ""
    )?.length !== 0 ? (
    <div
      className={`${className}  w-full p-1 flex justify-center items-center border-t divide-dashed text-center `}
    >
      <Modal
        width={
          formVo?.modelSize === 4
            ? 1200
            : formVo?.modelSize === 3
            ? 1000
            : formVo?.modelSize === 2
            ? 800
            : formVo?.modelSize === 1
            ? 600
            : 900 //默认900
        }
        title={title + "新增"}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          saveData().then((d) => {
            setKey((prevKey: number) => prevKey + 1);
            setVisible(false);
          });
        }}
        closeOnEsc={true}
      >
        <FormPage
          type={entityType || ""}
          vf={vf}
          className="z-2000"
          parentFormData={form?.values}
          onDataChange={(d) => {
            setFormData((formData: any) => {
              return { ...d };
            });
          }}
        />
      </Modal>
      <div
        onClick={() => {
          setVisible(true);
        }}
        className="border border-dashed w-28 p-1 hover:cursor-pointer hover:bg-gray-200"
      >
        创建{title}
      </div>
    </div>
  ) : (
    <></>
  );
};
