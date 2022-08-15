import { Button, Popover, Table, Tag, TagInput, Tooltip } from '@douyinfe/semi-ui';
import { ColumnProps, RowSelection, TableProps } from '@douyinfe/semi-ui/lib/es/table';
import { useAuth } from '@src/context/auth-context';
import { TranDict } from '@src/types/vlife';

import React, { useEffect, useMemo, useState } from 'react';
import { brotliCompress } from 'zlib';

/**
 * > 目前使用semi的组件进行vlife的table的二次封装、
 * - 在table的强大功能之上，封装我们需要的最常见功能给到调用方，达到易用的目的。
 * 1. 列头显隐藏支持()
 * 2. 列数据转换(字典/boolean)
 * 3. 表及列按钮渲染（显隐/可用状态/不可用提示）
 * 4. 单选/多选展示，与特定按钮状态进行绑定
 */

/**
 * 按钮计算属性
 */
export type BtnMemoProp={
  title?:string,//如存在则覆盖父级title
  disable?:boolean,//禁用状态
  prompt?:string,//提示语言
}
/**
 * 按钮状态
 */
 export interface VfButton {
  entityName?:string;//按钮所属模块
  title: string;//按钮名称
  icon?:string; //按钮图标
  loading?:boolean,
  attr?:(...objs:any)=>BtnMemoProp, //按钮动态属性
  key?: string; //按钮Key
  index?: number; //排序索引
  tableBtn?:boolean;//是否是表的btn
  funDataType?:'obj'|'objs'|'id'|'ids'|'none'//回调方法传参类型，应该与fun保持一致，这里方便取数据
  fun?: (...record: any) => void
}

 export interface ListProps extends TableProps {
    lineClick?:(obj:any)=>void;
    hideColumns?:string[],
    tableBtn?:VfButton[], //列表业务按钮补充
    sysDict?:TranDict[], //列转换的
    fkMap?:any,//外键数据的键值对
    select_more?:boolean;// undefined|false|true ->无勾选框|单选|多选
    select_show_field?:string;//选中时进行展示的字段，不传则不展示
    doubleClick?:(obj:any)=>void; //双击的事件
    onSelected?:(selecteds:selectType[])=>void;
    selected?:any[]; //进入之前选中的数据信息
 }
type selectType={id:string|number,name?:string};
export default ({
  lineClick,
  tableBtn,hideColumns,
  sysDict,dataSource,columns,fkMap,
  select_more,select_show_field,onSelected,selected,doubleClick,...props }: ListProps)=>{
  //state赋值不支持ifelse,所以写成函数式
  const [selectedRow,setSelectedRow]=useState<selectType[]>(
    selected?[...selected]:[]
  );
  const selectIds=useMemo<(string|number)[]>(()=>{return selectedRow.map(row=>{
   return row.id;
  })},[selectedRow])

  useEffect(()=>{
    if(onSelected){
      onSelected(selectedRow);
    }
  },[selectedRow])

  //行按钮
  const lineMemoBtns=useMemo<VfButton[]>(()=>{
    return tableBtn?.filter(btn=>{
      return !btn.tableBtn;
    })||[];
  },[tableBtn])

  /**
   * 表按钮
   */
  const tableMemoBtns=useMemo(()=>{
    return tableBtn?.filter(btn=>{
      return btn.tableBtn;
    })||[];
  },[tableBtn])

  //列信息
  const memoColumns=useMemo(():ColumnProps<any>[]=>{ 
    if(columns){
      let columnshow=[...columns];//拷贝一份传来的数据
      //过滤不显示的字段
      columnshow=columnshow?.filter((currentValue,index,arr)=>{
      // step1 不需要的就隐藏掉
      // hideColumns?.push('id');//id必须不展示
        const size:number=hideColumns?.find(name=>{
            return name===currentValue.dataIndex
        })?.length||0;
        if(size>0){
          return false;
        }
        if(currentValue.dataIndex==='id'){
          return false;
        }
        return true;
      })
       // step2 字典转换
       columnshow?.forEach(m=>{
        sysDict?.forEach(d=>{
          if(m.dictCode?.toLowerCase()===d.column.toLowerCase()){
            m['render']=(text,record,index)=>{
              return d.sysDict.find(dd=>{
                  return dd.val===text
              })?.title||'-'
            }
          } 
        })
      })

      //Boolean类型数据处理
      columnshow?.forEach(m=>{
          if(m.type==='boolean'){
            m['render']=(text,record,index)=>{
              return (text===null?'-':(text?'是':'否'))
            }
          } 
          else if(m.entityFieldName==='id'){
            m['render']=(text,record,index)=>{
              return fkMap[text];
            }
          } 
      })


      //行按钮添加
      if(lineMemoBtns.length>0){
        columnshow?.push(
          {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, index) => {
              return <>
                  {
                    lineMemoBtns.map((item)=>{
                        let prop:BtnMemoProp={}
                        if(item?.attr){
                          prop =item?.attr(record)
                        }
                        const button =<Button key={"_"+item.key+"_"+record.id} disabled={prop.disable}
                        theme='borderless' type='primary' onClick={()=>{
                        item.fun&&item.fun(record)}}>
                              {item.title}
                          </Button>
                        if(prop.prompt){
                          return (
                            <Tooltip  key={"prop_"+item.key+"_"+record.id}  content={prop.prompt}>
                              {/* {JSON.stringify(record)} */}
                                {button}
                            </Tooltip>)
                        }else{
                          return  button
                        }
                    })
                  }
                </>
            }
        })
      }
      return columnshow;
    }
    return [];
  },[columns,lineMemoBtns,hideColumns,sysDict])

  const onRow = useMemo(
    () => (record:any, index:any) => {
        return {
          onClick: (e:any) => {
            if(lineClick){
              lineClick(record);
            }
      }};}, []);
  const rowSelection = useMemo(()=>{
    return {
    disabled: !select_more, //全局选中按钮
    selectedRowKeys:selectIds,
    onSelect: (record:any, selected:any) => {
      if(select_more==false){
        if(selected==true){
        if(select_show_field){
          setSelectedRow([{id:record.id,name:record[select_show_field]}])
        }else{
          setSelectedRow([record])
        }}else{
          setSelectedRow([])
        }
      }
       console.log(`select row: ${selected}`, record);
    },
    onSelectAll: (selected:any, selectedRows:any[]) => {
        console.log(`select all rows: ${selected}`, selectedRows);
    },
    onChange: (selectedRowKeys:string[], selectedRows:any[]) => {
      if(select_more){
        setSelectedRow([...selectedRows.map(row=>{
          if(select_show_field){
            return {id:row.id,name:row[select_show_field]}
          }else{
            return row
          }
        })])
      }
    }
  }
},[selectedRow]);

  return (
    <> 
     {/* {JSON.stringify(selectedRow)} */}
      {
          tableMemoBtns.map(item=>{
            let prop:BtnMemoProp={}
            if(item?.attr){
              prop =item?.attr(...selectedRow)
            }
            const button=<Button loading={item.loading} key={item.entityName+'_'+item.key} onClick={()=>{if(item.fun){item.fun(...selectedRow)};setSelectedRow([])}} 
            disabled={prop?.disable}
          >{(!prop.disable&&prop.title)?prop.title:item.title}</Button>

          if(prop.prompt){
            return <Popover  visible={prop.prompt?false:true} key={'prop'+item.entityName+'_'+item.key} showArrow content={prop.prompt}>{button}</Popover>
           }else{
            return button
           }
          })
      }
      <Table rowKey={"id"} dataSource={dataSource} columns={memoColumns} 
      onRow={onRow}
        rowSelection={select_more!=undefined?rowSelection:undefined} 
      {...props} />

    {select_show_field&&selectedRow.map(one=>{

        return <Tag key={one.id} avatarShape='circle' size='large' closable={true} onClose={()=>{
          setSelectedRow([...selectedRow.filter(row=>{
            return row.id!==one.id
          })])
        }}>{one.name}</Tag>
      })
      }
    </>
  )
}