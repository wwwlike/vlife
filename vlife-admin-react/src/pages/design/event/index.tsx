/**
 * evnet事件响应列表index页面
 */

import { Modal } from "@douyinfe/semi-ui";
import { Result } from "@src/mvc/base";
import { FormVo } from "@src/mvc/model/Form";
import {
  FormEventDto,
  saveFormEventDto,
  listFormEventVo,
  FormEventVo,
} from "@src/mvc/model/FormEvent";
import TablePage from "@src/pages/common/tablePage";
import { useDetail } from "@src/provider/baseProvider";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Event from "./event";
interface eventPageProp {
  currModel: FormVo;
  onChange: (vo: FormVo) => void;
}
export default ({ currModel, onChange }: eventPageProp) => {
  const { runAsync: getDetail } = useDetail({ entityName: "formEvent" });
  const [modalState, setModelState] = useState<boolean>(false);
  const [reload, setReLoad] = useState<boolean>(true);
  // 当前待保存的1条event数据
  const [data, setData] = useState<Partial<FormEventDto>>();
  function cancel() {
    setModelState(false);
  }
  const req = useMemo(() => {
    return { formId: currModel.id };
  }, [currModel.id]);

  const getEventgiveOut = useCallback(() => {
    listFormEventVo(currModel.id).then((data: Result<FormEventVo[]>) => {
      //先把field的evnet都清除掉，
      currModel.fields.forEach((f) => {
        f.events = [];
      });
      data.data?.forEach((d: FormEventVo) => {
        currModel.fields.forEach((f) => {
          if (f.id === d.formFieldId) {
            f.events.push(d);
          }
        });
      });
      onChange(currModel);
    });
  }, [currModel]);
  return (
    <div>
      {/* 弹出表单 */}
      <Modal
        title="事件响应"
        visible={modalState}
        onOk={() => {
          saveFormEventDto(data as FormEventDto).then((data) => {
            cancel();
            // getEventgiveOut(); //保存时fieldVO-event处理
            setReLoad(!reload); //刷新列表
          });
        }}
        onCancel={cancel}
        centered
        width={1000}
        bodyStyle={{ overflow: "auto" }}
      >
        <Event
          dto={data}
          model={currModel}
          onValueChange={(changeData) => {
            setData({ ...changeData }); //拿到需要保存的数据
          }}
        />
      </Modal>

      {/* 列表 */}
      <TablePage
        req={req} //查询条件
        entityName="formEvent"
        listModel="formEvent"
        reload={reload}
        onGetData={(data) => {
          //data是列表数据
          getEventgiveOut(); //删除时刷新
        }}
        btnEnable={{
          edit: false,
          add: false,
          rm: true,
          batchRm: true,
          view: false,
        }} //table的按钮都不要
        showColumns={["name"]} //只显示的字段,
        editModel="formEventDto" //编辑的视图
        select_more={true}
        customBtns={[
          //这里是自定义eventdto的视图，替换默认的视图
          {
            click: (btn, datas) => {
              setData(undefined);
              setModelState(true);
            },
            title: "新增",
            tableBtn: true,
            key: "formEvent:save:formEventDto",
          },
          {
            click: (btn, datas) => {
              getDetail(datas.id, "formEventDto").then((data) => {
                setData(data.data);
                setModelState(true);
              });
            },
            title: "编辑",
            tableBtn: false,
            key: "formEvent:save:formEventDto",
          },
        ]}
      />
    </div>
  );
};
