import React, { useCallback, useMemo } from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { checkSubData } from '@src/utils/utils';

interface treeProps{
  treeCode?:string, //上下级关系的字段
  valField?:string, //提交给后台的字段
  labelField?:string, //树型显示的字段
  rootCode?:string, //节点
  rootName?:string,//虚拟节点名称
  datas:any[], //所有树的数据
  onSelect?:(selectedKeys: string, selected: boolean, selectedNode: TreeNodeData)=>void;
}

interface treeElementProps{
  label: string,
  value: string,
  key: string,
  children?:treeElementProps[],
}


export default (
  {
  treeCode='code',// 42_
  labelField='name',
  valField='id',//传给后端的值的字段
  rootCode,
  datas,
  onSelect,
...props}:treeProps
)=>{
    const findRoot=useMemo(():string[]=>{
      if(rootCode)
        return [rootCode]
      else if(datas&&datas.length>0&&datas.filter(d=>d.pcode===undefined||d.pcode===null).length>0){//pcode为空的是根节点
        return datas.filter(d=>d.pcode===undefined||d.pcode===null).map(d=>d.code);
      } else { //父节点不存在与code的
       
      } 
      return [];
    },[datas])
    /**
     * 使用递归调用的方式组装数据
     * @sub 是否是查children,那么就不是eq,是startWith
     * @code 查询的编码
     */
    const treeData=useCallback((code:string|undefined,sub:boolean):treeElementProps[]=>{
        console.log("点击跟着继续变化,不对")
      if(datas===null||datas===undefined||datas.length===0){
        return [];
      }
      //遍历全部，效率值得商榷找到开发头的
      return  datas.filter(d=>sub&&code?
        checkSubData(code,d[treeCode]) //找子级
        :(code?d[treeCode]===code:
          findRoot.filter(dd=>dd===d[treeCode]).length>0)//父级
      ).map(dd=>{
        return {
        'value':dd[valField],
        'label':dd[labelField],
        'key':dd[valField],
        'children':treeData(dd[treeCode],true)
        }
      })
    },[datas])

    const style = {
        width: 260,
        // height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
      <div>
        <Tree
            treeData={treeData(rootCode,false)}
            defaultExpandAll
            onSelect={onSelect}
            style={style}
        />
        </div>
    );

}
