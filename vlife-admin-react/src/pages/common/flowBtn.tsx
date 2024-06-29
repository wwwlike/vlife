import {
  backProcess,
  cancelProcess,
  completeTask,
  recall,
  startFlow,
} from "@src/api/workflow/Flow";
import { VFBtn } from "@src/components/button/types";

//工作流按钮
export const flowBtns = (
  {
    defineKey,
    data,
    onSubmitFinish,
  }: {
    defineKey: string;
    data: any;
    onSubmitFinish: () => void;
  } //点击后的回调函数
): VFBtn[] => {
  return [
    {
      actionType: "flow",
      title: "通过",
      icon: <i className=" text-base icon-ok" />,
      multiple: false,
      disabledHide: true,
      usableMatch: (d: any) => {
        return d?.flow?.currTask && d.flow.nodeType === "approver";
      },
      datas: data,
      comment: true,
      saveApi: (data: any) => {
        completeTask({
          comment: data.comment,
          businessKey: data.id,
          defineKey: defineKey,
          formData: data,
        });
        return data;
      },
      onSubmitFinish: onSubmitFinish,
    },
    {
      actionType: "flow",
      disabledHide: true,
      title: "提交", //保存数据并且当流程流转到下一个节点
      icon: <i className="  icon-upload1" />,
      usableMatch: (d: any) => {
        return (
          d?.flow?.started === false || //任务没开始可以提交
          (d?.flow?.currTask &&
            d?.flow?.ended === false && //是你的任务并且任务没有结束
            (d.flow?.nodeType === "audit" || d.flow.nodeId === "start")) //办理节点
        );
      },
      onSubmitFinish: onSubmitFinish,
      datas: data,
      saveApi: (data: any) => {
        if (data?.flow === undefined || data.flow?.started !== true) {
          return startFlow({
            businessKey: data.id,
            defineKey: defineKey,
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
            defineKey: defineKey,
            formData: data,
            description: "提交处理",
          }).then((res) => {
            if (res.data === false) {
              alert("不能操作当前流程");
            }
            return data;
          });
        }
      },
    },
    {
      actionType: "flow",
      title: "回退",
      disabledHide: true,
      icon: <i className=" text-base icon-reply" />,
      usableMatch: (d: any) => {
        return (
          d?.flow?.auditInfo?.rollback === true &&
          d?.flow?.started === true &&
          d?.flow?.ended === false &&
          d.flow.currTask
        );
      },
      datas: data,
      comment: true,
      saveApi: (data: any) => {
        backProcess({
          comment: data.comment,
          businessKey: data.id,
          defineKey: defineKey,
        }).then((res) => {
          if (res.data === false) {
            alert("不能操作当前流程");
          }
        });
        return data;
      },
      onSubmitFinish: onSubmitFinish,
    },
    {
      actionType: "flow",
      title: "转交",
      datas: data,
      disabledHide: true,
      icon: <i className=" text-base icon-reply" />,
      usableMatch: (d: any) => {
        return (
          d?.flow?.auditInfo?.transfer === true &&
          d?.flow?.started === true &&
          d?.flow?.ended === false &&
          d.flow.currTask
        );
      },
      comment: true,
      saveApi: (data: any) => {
        return data;
      },
      onSubmitFinish: onSubmitFinish,
    },
    //当前视图是已办，且后端返回可以测回则显示
    {
      actionType: "flow",
      title: "撤回",
      disabledHide: true,
      datas: data,
      icon: <i className=" text-base icon-reply" />,
      usableMatch: (d: any) => {
        return d.flow?.recallable === true;
      },
      comment: true,
      saveApi: (data: any) => {
        recall({
          comment: data.comment,
          businessKey: data.id,
          defineKey: defineKey,
        }).then((res) => {
          if (res.data) {
            alert(res.data);
          }
        });
        return data;
      },
      onSubmitFinish: onSubmitFinish,
    },
    {
      actionType: "flow",
      title: "拒绝",
      disabledHide: true,
      datas: data,
      icon: <i className=" text-base icon-cancel" />,
      comment: true,
      usableMatch: (d: any) => {
        return (
          d?.flow?.auditInfo?.rejected === true &&
          d?.flow?.started === true &&
          d?.flow?.ended === false &&
          d.flow.currTask
        );
      },
      saveApi: (data: any) => {
        cancelProcess({
          comment: data.comment,
          businessKey: data.id,
          defineKey: defineKey,
        }).then((res) => {
          if (res.data === false) {
            alert("不能操作当前流程");
          }
        });
        return data;
      },
      onSubmitFinish: onSubmitFinish,
    },
  ];
};
