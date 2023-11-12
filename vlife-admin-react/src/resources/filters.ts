import { FormVo } from '@src/api/Form';
import { FormField } from '@src/api/FormField';
import { SysDict } from '@src/api/SysDict';
import { SysMenu } from '@src/api/SysMenu';
import { DataType, TsType } from '../dsl/base';

/**
 * api数据过滤函数集合
 * 对于组件入参是数组型的入参属性，可对其进行过滤
 * 目前这块过滤条件是不能传参数的，不能根据组件或者field的相关进行进行过滤逻辑的处理
 */
export interface filter{
  title:string;//过滤器标题
  dataType?:DataType;//出参数据类型。可以省
  dataModel:TsType|string; //数据模型
  remark?:string;//解释说明
  func:(datas:any[])=>any[],
}

export interface filterObj{
  [key:string]:filter
}

export const filterFuns:filterObj={
  sysDict: {
    title:"业务字典",
    dataModel:"SysDict",
    func:(sysDicts:SysDict[])=>{
      return sysDicts.filter((d,index)=>d.sys===false||d.sys===undefined||d.sys===null);
    },
 },
   erpEntity: {
      title:"进销存模型",
      dataModel:"FormVo",
      func:(formVo:FormVo[])=>{
        return formVo.filter((d,index)=>d.itemType==='entity'&&d.module==='erp');
      },
   },
   groupField:{
    title:"可分组字段",
    dataModel:"FormField",
    func:(fields:FormField[])=>{
      return fields.filter((ff: FormField) => {
        if (
          ff.dataType === "basic" &&
          (ff.fieldType === "date" ||
            ff.pathName.endsWith("Id") ||
            ff.dictCode)
        ) {
          return true;
        }
        return false;
      });
    },
   },
   //二级节点可以被选择到
   selectTreeData:{
    title:"一二级菜单树",
    dataModel:"sysMenu",
    func:(menus:SysMenu[])=>{
      const appMenu:string[]=menus.filter(mm=>mm.app).map(d=>d.code);
      return menus.filter(mm=>((appMenu.includes(mm.code)||appMenu.includes(mm.pcode))&&(mm.entityType===undefined ||mm.entityType===null)))
    },
   },
   numberField:{
    title:"数值类型字段",
    dataModel:"FormField",
    func:(fields:FormField[])=>{
      return fields.filter((ff: FormField) =>ff.dataType === "basic" &&(ff.fieldType === "number"||ff.fieldName==="id")
      ).map(f=>{return  f.fieldName!=="id"?f:{
        ...f,name:"数据总量",title:"数据总量"
      }})
    },
   },
   appMenu:{
    title:"应用",
    dataModel:"sysMenu",
    func:(fields:SysMenu[])=>{
      return fields.filter((ff: SysMenu) =>ff.app===true
      );
    },
   },
  //  dictData:{
  //   title:"业务字典",
  //   dataModel:"SysDict",
  //   func:(dicts:SysDict[])=>{
  //     return dicts.filter(mm=>mm.sys===undefined||mm.sys===null||mm.sys===false)
  //   },
  //  }
}
