/**
 * 选择组件,用于搜索查询页面模块使用，
 * 将搜索条件以信息块形式展示出来
 */
import { Space, Tag } from '@douyinfe/semi-ui';
import React from 'react';
type VSelectProps={
  datas:({label:string,value:number|string}[])|string, //字典模式
  selectMore?:boolean,
  onSelected:(ids:(string|number)[])=>void//事件
  showMax:number;//最多显示数量
}
/**
 * 1. 支持2种自定义选择模式
 * - 字典模式:
 * - 多字段模式 boolean类型的字段，选中则为true
 * 1. 组件排列
 * 2. 组件选中，及取消
 * 3. 当前选中数据传输出去
 * 4. 全部则表示(不选择)
 */
const VSelect =({datas,selectMore=false,showMax=20,...props}:VSelectProps)=>{
  return (
    <Space>
      <Tag color='blue' type='light'> light tag </Tag>
      <Tag color='blue' type='ghost'> ghost tag </Tag>
      <Tag color='blue' type='solid'> solid tag </Tag>
    </Space>
  )
}
export default VSelect;
