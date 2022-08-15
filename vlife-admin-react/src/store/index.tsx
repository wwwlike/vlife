import { Modal, SideSheet } from '@douyinfe/semi-ui';
import { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import { SideSheetReactProps } from '@douyinfe/semi-ui/lib/es/sideSheet';
import { Button } from 'antd';
import React,{ReactNode, useRef, useState} from 'react';
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// 使用一个 object 缓存 promise 的 resolve 回调函数
const modalCallbacks: any = {};
//modalReducer则是一个函数，接收 Action 和 State 并作为参数，通过计算得到新的 Store。
export const modalReducer = (state = { hiding: {} ,activeModalNum:undefined}, action: any) => {
  switch (action.type) {
    case "nice-modal/show":
      return {
        ...state,
        [action.payload.modalId]: action.payload.args || true,//参数缓存起来
        activeModalId:action.payload.modalId,//最新打开的modalid
        hiding: {   // 定义一个 hiding 状态用于处理对话框关闭动画
          ...state.hiding,
          [action.payload.modalId]: false,
        },
      };
    case "nice-modal/hide":
      return action.payload.force      // 只有 force 时才真正移除对话框
        ? {
            ...state,
             activeModalId:undefined,
            [action.payload.modalId]: false,
            hiding: { [action.payload.modalId]: false },
          }
        : { ...state, activeModalId:undefined, hiding: { [action.payload.modalId]: true } };
    default:
      return state;
  }
};

// action creators
function showModal(modalId: string, args:any) {
  return {
    type: "nice-modal/show",
    payload: {
      'modalId':modalId,
      args,
    },
  };
}

function hideModal(modalId: string, force: any) {
  return {
    type: "nice-modal/hide",
    payload: {
      modalId,
      force,
    },
  };
}

export const useNiceModal = (modalId: string) => {
  const dispatch = useDispatch();
    //从store里读取活动的modal层ID
  const activeModalId=useSelector((state: any) => state.activeModalId);
    //上一层modal的信息
  // const [pModal,setPmodal]=useState<{id:string,callback?:()=>void}>();

  let pModal:{id:string,args:any,callback?:()=>void};
  // const o= useNiceModal(activeModalId);
  // const cloadPrv=useCallback(()=>{//在当前页面之上在弹出一个modal
  //     o.hide();
  //     // return o
  // },[activeModalId]);
  const show = useCallback(
    (args?:any) => { //args 传入的表单初始化数据
      return new Promise((resolve) => {
        // 显示对话框时，返回 promise 并且将resolve方法临时存起来
        modalCallbacks[modalId] = resolve;// show()方法then调用时候传入的函数
        dispatch(showModal(modalId, {...args}));
      });
    },
    [dispatch, modalId]
  );
  /**
   * 作为子模态窗口显示，
   * 关闭之前的，并记录，子模关闭的时候再次调出父模态窗口
   */
  const showAsSub= useCallback(
    (force?:any) => {
      if(activeModalId){
        dispatch(hideModal(activeModalId, force));     //关闭父窗口
        //父窗口数据信息保存
        pModal={id:activeModalId,args:null,callback:modalCallbacks[activeModalId]}
        delete modalCallbacks[activeModalId];
      }
      return show(force);//调用show方法
    },
    [dispatch, activeModalId]
  );

  //点ok执行的方法
  const resolve = useCallback(
    (args:any) => {
      if (modalCallbacks[modalId]) { //存在则执行
        modalCallbacks[modalId](args); // 回调执行show传入时候的函数
        delete modalCallbacks[modalId];
      }
    },
    [modalId]
  );

  /**
   * 新创建一个modal时候，关闭当前活动的modal
   */
  const hideActive = useCallback(
    (force?:any) => {
      dispatch(hideModal(activeModalId, force));
      delete modalCallbacks[activeModalId];
    },
    [dispatch, activeModalId]
  );

  
  /**
   * 关闭当前的，打开父类的
   */
  const hideAndOpenParent= useCallback(
    (force?:any) => {
      hide()
      setTimeout(()=>{
        return new Promise((resolve) => {
          modalCallbacks[pModal?.id] =pModal.callback;//找回当时show()方法then调用时候传入的函数
          dispatch(showModal(pModal.id, {...force})); 
        });
      },500)
        //  hide();
        // 显示对话框时，返回 promise 并且将resolve方法临时存起来
        // if(pModal&& pModal.id){
       
        // }
        
    },
    [dispatch, modalId]
  );


  const hide = useCallback(
    (force?:any) => {
      dispatch(hideModal(modalId, force));
      delete modalCallbacks[modalId];
    },
    [dispatch, modalId]
  );

  //只取当前这个组件需要的参数
  const args = useSelector((state: any) => state[modalId]);

  const hiding = useSelector((state: any) => state.hiding[modalId]);

  return useMemo(
    () => ({ args, hiding, visible: !!args, show, hide, resolve,activeModalId,showAsSub,hideAndOpenParent}),
    [args, hide, show, resolve, hiding,activeModalId,showAsSub,hideAndOpenParent]
  );
};

interface NiceModelProps extends ModalReactProps {
  id:string,
  children:ReactNode;
}

/**
 * 弹出层组件（其中的一种方案）
 * @param param0 
 * @returns 
 */
function NiceModal({ id, children,width, ...rest }:NiceModelProps) {
  //操作modalhooks上的状态，来改变Modal的属性；
  const modal = useNiceModal(id);
  return (
    <Modal width={width}
      onCancel={() => modal.hide()} // 默认点击 cancel 时关闭对话框
      onOk={() => modal.hide()} // 默认点击确定关闭对话框
      afterClose={() => modal.hide(true)} // 动画完成后真正关闭
      visible={!modal.hiding}
      {...rest} // 允许在使用 NiceModal 时透传参数给实际的 Modal
    >
      {children}
    </Modal>
  );
}


interface NiceDrowerProps extends SideSheetReactProps {
  id:string,
  children:ReactNode;
}
/**
 * 划出层组件
 */
export function DrawerModel({ id, children, ...rest }:NiceDrowerProps){
  const modal = useNiceModal(id);
  return (
    <SideSheet
      onCancel={() => modal.hide()}
    // 默认点击 cancel 时关闭对话框
      visible={!modal.hiding}
      {...rest} // 允许在使用 NiceModal 时透传参数给实际的 Modal
    >
      {children}
    </SideSheet>
  );
 }

 /**
  * 可看作创建组件的方法，tableModel.tsx使用它创建后，在layout里进行引用
  * 方法里面return 一个组件函数，说明该方法是用来创建组件的。
  * @param modalId 弹出层名称
  * @param Comp 使用渲染的组件，child里使用
  * @returns 
  */
export const createNiceModal = (modalId:string, Comp:any) => {
  return (props:any) => { // props 是初始参数 layout里使用
    const { visible, args } = useNiceModal(modalId); //纳入到store管理
    if (!visible){  //它会在对话框不可见时直接返回 null，从而不渲染任何内容；并且确保即使页面上定义了 100 个对话框，也不会影响性能：
      return null
    };
    return <Comp {...args} {...props} />;
  };
};



export const createCustomModal = (modalId:string, Comp:any) => {
  return (props:any) => {
    const { visible, args } = useNiceModal(modalId);
    if (!visible) return null;
    return <Comp {...args} {...props} />;
  };
};


// NiceModal.create = createNiceModal;
// NiceModal.useModal = useNiceModal;

export default NiceModal;



