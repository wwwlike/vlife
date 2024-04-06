import React, { useCallback, useState } from "react";
import {
  IconChevronRightStroked,
  IconCrossStroked,
} from "@douyinfe/semi-icons";
import { FormVo } from "@src/api/Form";
import { VfBaseProps } from "@src/dsl/component";
import FormPage from "@src/pages/common/formPage";

interface VfListFormProps extends VfBaseProps<any[]> {
  modelName: string; //模型名称
  showInput: boolean; //是否至少显示一组表单
}

const VfListForm = ({
  value,
  modelName,
  onDataChange,
  formData,
  fieldInfo,
  showInput = true,
  ...props
}: VfListFormProps) => {
  const [data, setData] = useState<any[]>(
    value ? value : showInput ? [{}] : []
  );
  const [listFormModel, setListFormModel] = useState<FormVo>();
  const create = useCallback(() => {
    if (data) {
      setData([...data, {}]);
    } else {
      setData([{}]);
    }
  }, [data]);

  const remove = useCallback(
    (index: number) => {
      const datas = data.filter((d, i) => {
        return i !== index;
      });
      setData([...datas]);
      onDataChange([...datas]);
    },
    [JSON.stringify(data)]
  );

  const edit = useCallback(
    (index: number, line: any) => {
      setData((prevData) => {
        // 使用前一个状态来更新数据
        const newData = prevData.map((d, i) => {
          return i !== index ? d : line;
        });
        onDataChange(newData);
        return newData;
      });
    },
    [JSON.stringify(data)]
  );

  return (
    <div className="relative" key={formData?.formId}>
      {data
        .sort((a, b) => {
          if (a.createDate < b.createDate) return 1;
          if (a.createDate > b.createDate) return -1;
          return 0;
        })
        ?.map((m, index) => (
          <div key={(fieldInfo?.fieldType || "") + index}>
            <div className="flex mb-1 justify-between">
              <div className=" text-left text-sm font-bold text-gray-500 hover:text-black  flex items-center  cursor-pointer">
                <IconChevronRightStroked size="small" />
                <p>
                  {listFormModel &&
                    listFormModel.title + (data.length > 1 ? index + 1 : "")}
                </p>
              </div>
              <div className=" text-right">
                {((showInput && index > 0) || showInput === false) && (
                  <IconCrossStroked
                    size="small"
                    onClick={() => remove(index)}
                    className="text-gray-800 hover:text-black   cursor-pointer"
                  />
                )}
              </div>
            </div>
            <FormPage
              className="pl-2"
              formData={m}
              onVfForm={(formVo: FormVo) => {
                if (listFormModel === undefined) setListFormModel(formVo);
              }}
              parentFormData={formData} //父组件form数据
              type={modelName || fieldInfo?.fieldType || ""}
              fontBold={props.fontBold} //加粗
              vf={props.vf}
              terse={true} //紧凑
              onDataChange={(dd) => {
                edit(index, dd);
              }}
              readPretty={props.read}
            />
          </div>
        ))}
      {props.read !== true && (
        <p
          onClick={create}
          className="text-gray-500 hover:text-black cursor-pointer"
        >
          +添加新的{listFormModel && listFormModel.title}
        </p>
      )}
    </div>
  );
};
export default VfListForm;
