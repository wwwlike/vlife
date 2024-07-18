// 表格表单里需要工作流的相关数据

import { IdBean, Result } from "@src/api/base";
import {
  backProcess,
  cancelProcess,
  completeTask,
  recall,
  RecordFlowInfo,
  startFlow,
} from "@src/api/workflow/Flow";
import { VFBtn } from "@src/components/button/types";
import { TableBean } from "@src/components/table";
import { VfAction } from "@src/dsl/VF";
import { VfTableTab } from "./TableHeader";

//1. 页签
//工作流页签
export const tableFowTabs: VfTableTab[] = [
  {
    itemKey: "flow_todo",
    icon: <i className="icon-checkbox_01" />,
    tab: "待办视图",
    req: { flowTab: "todo" },
  },
  {
    itemKey: "flow_byMe",
    icon: <i className="  icon-workflow_new" />,
    tab: `我发起的`,
    // req: { flowTab: "byMe" },
  },
  {
    itemKey: "flow_byMe_todo",
    tab: "流程中",
    req: { flowTab: "byMe_todo" },
    pKey: "flow_byMe",
  },
  {
    //待办
    itemKey: "flow_byMe_edit",
    tab: "待完善",
    req: { flowTab: "byMe_edit" },
    pKey: "flow_byMe",
  },
  {
    //
    itemKey: "flow_byMe_finish",
    tab: "已通过",
    pKey: "flow_byMe",
    req: { flowTab: "byMe_finish" },
  },
  {
    itemKey: "flow_byMe_refuse",
    tab: "已拒绝",
    pKey: "flow_byMe",
    req: { flowTab: "byMe_refuse" },
  },
  {
    itemKey: "flow_byMe_draft",
    tab: "草稿",
    req: { flowTab: "byMe_draft" },
    pKey: "flow_byMe",
  },
  {
    itemKey: "flow_done",
    tab: "已办视图",
    icon: <i className=" icon-workflow_ok" />,
    req: { flowTab: "done" },
  },
  {
    itemKey: "flow_notifier",
    icon: <i className="  icon-resend" />,
    tab: "抄送视图",
    req: { flowTab: "notifier" },
  },
];

//2. 按钮

//工作流按钮
export const tableFlowBtns = ({
  formType,
  entity,
  formReaction,
  activeKey,
  datas,
  onSubmitFinish,
  save,
  saveModalOpen,
  flowModalOpen,
  rm,
}: {
  formType: string;
  entity: string;
  formReaction?: VfAction[];
  activeKey: string;
  datas?: { [key: string]: any; flow?: RecordFlowInfo };
  saveModalOpen?: boolean; //流程表单页面是否打开
  flowModalOpen?: boolean; //工作流明细modal页面是否打开
  onSubmitFinish?: () => void;
  save?: (data: any) => Promise<Result<any>>; //通用保存方法
  rm?: (ids: string[]) => Promise<Result<any>>;
}) => {
  // const saveApia: (data: IdBean) => Promise<Result<any>> =
  //   typeof save === "function" ? save("", "") : save;

  // if (typeof save === "function") {
  //   const saveApia1: (data: IdBean) => Promise<Result<any>> = save("", "");
  // } else {
  //   // save 不是函数类型，则直接赋值给 saveApia
  //   const saveApia2: (data: IdBean) => Promise<Result<any>> = save;
  // }

  let _flowBtns: VFBtn[] = [
    {
      actionType: "flow",
      title: "通过",
      datas,
      icon: <i className=" text-base icon-ok" />,
      multiple: false,
      model: formType,
      modalOpen: flowModalOpen,
      activeTabKey: ["flow_todo"],
      usableMatch: ({ flow }: TableBean) => {
        return flow?.currTask && flow?.nodeType === "approver";
      },
      comment: true,
      disabledHide: true,
      saveApi: (data: any) => {
        completeTask({
          comment: data.comment,
          businessKey: data.id,
          defineKey: formType,
          formData: data,
        });
        return data;
      },
      onSubmitFinish,
    },
    {
      actionType: "flow",
      onSubmitFinish,
      submitConfirm: true,
      allowEmpty: true,
      title: "提交", //保存数据并且当流程流转到下一个节点
      datas,
      modalOpen: flowModalOpen,
      icon: <i className="  icon-upload1" />,
      multiple: false,
      model: formType,
      activeTabKey: ["flow_todo", "flow_byMe_edit", "flow_byMe_draft"], //办理节点
      usableMatch: ({ flow }: TableBean) => {
        return (
          flow?.started === false || //任务没开始可以提交
          (flow?.currTask &&
            flow?.ended === false && //是你的任务并且任务没有结束
            (flow?.nodeType === "audit" || flow.nodeId === "start"))
        );
      },
      toActiveTabKey: "flow_byMe_todo",
      // disabledHide: true,
      saveApi: (data: any) => {
        if (save) {
          return save(data).then((_data: Result<any>) => {
            if (data?.flow === undefined || data.flow?.started !== true) {
              //是data 非`_data`来字方法入参
              return startFlow({
                businessKey: _data.data.id,
                defineKey: formType,
                formData: data,
                description: "发起流程",
              }).then((res) => {
                if (res.data === false) {
                  alert("不能操作当前流程");
                }
                return _data;
              });
            } else {
              return completeTask({
                comment: _data.data.comment,
                businessKey: _data.data.id,
                defineKey: formType,
                formData: _data.data,
                description: "提交处理",
              }).then((res) => {
                if (res.data === false) {
                  alert("不能操作当前流程");
                }
                return _data;
              });
            }
          });
        } else {
          if (data?.flow === undefined || data.flow?.started !== true) {
            //是data 非`_data`来字方法入参
            return startFlow({
              businessKey: data.id,
              defineKey: formType,
              formData: data,
              description: "发起流程",
            }).then((res) => {
              if (res.data === false) {
                alert("不能操作当前流程");
              }
              return data;
            });
          } else {
            return completeTask({
              comment: data.comment,
              businessKey: data.id,
              defineKey: formType,
              formData: data,
              description: "提交处理",
            }).then((res) => {
              if (res.data === false) {
                alert("不能操作当前流程");
              }
              return data;
            });
          }
        }
      },
    },
    {
      actionType: "flow",
      onSubmitFinish,
      title: "回退",
      modalOpen: flowModalOpen,
      datas,
      activeTabKey: ["flow_todo"],
      icon: <i className=" text-base icon-reply" />,
      model: formType,
      usableMatch: ({ flow }: TableBean) => {
        return (
          flow?.auditInfo?.rollback === true &&
          flow?.started === true &&
          flow?.ended === false &&
          flow.currTask
        );
      },
      comment: true,
      saveApi: (data: any) => {
        backProcess({
          comment: data.comment,
          businessKey: data.id,
          defineKey: formType,
        }).then((res) => {
          if (res.data === false) {
            alert("不能操作当前流程");
          }
        });
        return data;
      },
    },
    {
      actionType: "flow",
      onSubmitFinish,
      title: "转交",
      modalOpen: flowModalOpen,
      datas,
      disabledHide: true,
      activeTabKey: ["flow_todo"],
      icon: <i className=" text-base icon-reply" />,
      model: formType,
      usableMatch: ({ flow }: TableBean) => {
        return (
          flow?.auditInfo?.transfer === true &&
          flow?.started === true &&
          flow?.ended === false &&
          flow?.currTask
        );
      },
      comment: true,
      saveApi: (data: any) => {
        return data;
      },
    },
    //当前视图是已办，且后端返回可以测回则显示
    {
      actionType: "flow",
      title: "撤回",
      onSubmitFinish,
      modalOpen: flowModalOpen,
      datas,
      disabledHide: true,
      activeTabKey: ["flow_done"],
      icon: <i className=" text-base icon-reply" />,
      model: formType,
      usableMatch: ({ flow }: TableBean) => {
        return flow?.recallable === true;
      },
      comment: true,
      saveApi: (data: any) => {
        recall({
          comment: data.comment,
          businessKey: data.id,
          defineKey: formType,
        }).then((res) => {
          if (res.data) {
            alert(res.data);
          }
        });
        return data;
      },
    },
    {
      actionType: "flow",
      title: "拒绝",
      onSubmitFinish,
      modalOpen: flowModalOpen,
      datas,
      disabledHide: true,
      icon: <i className=" text-base icon-cancel" />,
      model: formType,
      comment: true,
      activeTabKey: ["flow_todo"],
      usableMatch: ({ flow }: TableBean) => {
        return (
          flow?.auditInfo?.rejected === true &&
          flow?.started === true &&
          flow?.ended === false &&
          flow.currTask
        );
      },
      saveApi: (data: any) => {
        cancelProcess({
          comment: data.comment,
          businessKey: data.id,
          defineKey: formType,
        }).then((res) => {
          if (res.data === false) {
            alert("不能操作当前流程");
          }
        });
        return data;
      },
    },
  ];

  if (save) {
    _flowBtns.unshift({
      actionType: "create",
      onSubmitFinish,
      datas,
      icon: <i className=" icon-add_circle_outline" />,
      multiple: false,
      allowEmpty: true,
      model: formType,
      reaction: formReaction,
      toActiveTabKey: "flow_byMe_draft",
      saveApi: save, // save方法需要返回和model一致的数据
    });

    _flowBtns.unshift({
      actionType: "edit",
      modalOpen: saveModalOpen,
      onSubmitFinish,
      datas,
      icon: <i className=" icon-add_circle_outline" />,
      multiple: false,
      model: formType,
      usableMatch: ({ flow, id }: TableBean) => {
        //几种可能保存按钮可用的情况
        return (
          id === undefined ||
          flow == undefined ||
          (flow?.ended !== true && // 2. 流程没结束&办理人节点&页签是待办&
            flow?.currTask &&
            flow?.nodeType === "audit" &&
            activeKey === "flow_todo") ||
          activeKey === "flow_byMe_edit" || // 待完善
          activeKey === "flow_byMe_draft" //草稿
        );
      },
      reaction: formReaction,
      saveApi: save, // save方法需要返回和model一致的数据
    });
  }
  if (rm) {
    _flowBtns.push({
      title: "删除",
      onSubmitFinish,
      // datas: [datas],
      actionType: "api",
      // disabled: activeKey !== "flow_byMe_draft",
      activeTabKey: ["flow_byMe_draft"],
      usableMatch: (datas: TableBean[]) => {
        return datas.every((data) => {
          return (
            data.status === "1" &&
            data?.flow?.started === false &&
            data?.flow?.ended === false
          );
        });
      },
      icon: <i className="  icon-remove_circle_outline1" />,
      multiple: true,
      permissionCode: entity + ":remove",
      saveApi: (datas: IdBean[]): Promise<Result<any>> => {
        return rm(datas.map((d) => d.id));
      },
    });
  }

  return _flowBtns;
};
