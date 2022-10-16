import { CheckboxGroup, Divider } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react'
/**
 实现效果如下
标题1
---------------
[] 标题1的选自内容1
[] 标题1的选自内容2
------------------------
标题2
---------------
[] 标题2的选自内容1
[] 标题2的选自内容2
.......
后端返回的数据，应该是如下结构
[
  {
    <label>:标题1,
    <detail>:[
      <label>:选择的明细
      <id>:hehe
    ]
  }
]
 */
interface PageSelectProps{
  //能否多选
  datas:{name:string,detailList:{label:string,value:string}[]}[],//接收数据格式
  value:string[],//表单的值
  selectType:'typeOne'|'one'|'more' //每个分类选一个|全局选一个|多选
  // onSelect?:(selectedKeys: string, selected: boolean, selectedNode: TreeNodeData)=>void;
  onChange:(value:string[])=>void
}
/**
 * 页面平铺选择组件
 */
export default ({datas,value,onChange,selectType='typeOne',...props}:PageSelectProps)=>{

  /**
   * 一组只能选一个,选了一个就要把之前的给清除掉
   */
 const pageSelect=useCallback((rules:string[],checkeds:string[])=>{

   const modelRules= checkeds.filter(checked=>rules.filter(rule=>rule===checked).length>0);
   if(modelRules.length===2){
    checkeds=checkeds.filter(checked=>checked!==modelRules[0])
   }
   onChange([]);
 },[]);

return <>
{/* {JSON.stringify(value[value.length-1])} */}
  {/* vertical horizontal */}
  {
    datas?
      datas.map(d=>{
        return  d.detailList&&d.detailList.length>0?
       (
      <div  key={'div_'+d.name}>
        <h3  style={{"marginTop":"20px"}}><b>{d.name}</b></h3>
        <Divider margin='8px'/>
      <CheckboxGroup
        value={value} 
        // onChange={(datas)=>pageSelect(d.detailList.map(f=>{
        //     return  f.value
        //   }),datas)}
       onChange={(checkeds)=>{ 
          const rules=d.detailList.map(f=>{
              return  f.value
            })
          const modelRules= checkeds.filter(checked=>rules.filter(rule=>rule===checked).length>0);
          if(modelRules.length===2){
            checkeds=checkeds.filter(checked=>checked!==modelRules[0])
          }
        onChange(checkeds)}}
    
        options={d.detailList} direction='horizontal'/>
      </div>
      ):"";
    }):""
    }
  </>
}


