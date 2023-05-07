import { FormField, listAll as formFieldListAll } from "@src/api/FormField";
import { roleAllResources } from "@src/api/SysResources";
import { listAll as orgList } from "@src/api/SysOrg";
import { allRouter, listAll as menuList, MenuVo, roleResources } from "@src/api/SysMenu";
import { listAll as deptList } from "@src/api/SysDept";
import { listAll as areaList } from "@src/api/SysArea";
import {listAll as groupList} from  "@src/api/SysGroup";
import {
  entityModels,
  detailFormVo,
  formReportItemAll,
  formReportKpiAll,
} from "@src/api/Form";
import { listByCode, listType, SysDict } from "@src/api/SysDict";
import { findName } from "@src/api/base/baseService";
import {  SysGroup } from "@src/api/SysGroup";
// import { PageSelectData } from '@src/life-ui/components/PageSelect';
import { ApiDef } from '@src/dsl/schema/api';
import { DataType, sourceType, TsType } from '@src/dsl/schema/base';
import { ISelect } from '../schema/component';
import { PageSelectData } from '@src/components/PageSelect';
import { filterType } from '@src/api/SysUser';
import { listAll, ReportItem } from '@src/api/report/ReportItem';
import { FormCondition,listAll as formConditionListAll } from '@src/api/FormCondition';

/**
 * 组件使用API的配置信息
 * 期待后面能自动生成读取，不用人工定义这个过程
 */
export const ApiInfo: ApiDef = {
  formListALl: {
    label: "实体模型",
    dataType:DataType.array,
    dataModel:"FormVo",
    //  dataType.id_name_list,
    api: entityModels,
    match:[
      {
      dataType:DataType.array,
      dataModel:"ISelect",
      func:[{
        key:"id",
        label:"根据实体ID选择",
        func:(datas:{id:string,title:string}[]):ISelect[]=>{
          return datas.map((data:{id:string,title:string})=>{return {value:data.id,label:data.title}});
       }},{
        key:"type",
        label:"根据实体类型选择",
        func:(datas:{type:string,title:string}[]):ISelect[]=>{
          return datas.map((data:{type:string,title:string})=>{return {value:data.type,label:data.title}});
       }}
      ]
    }
    ]
  },//formListAll_entityType 与 formListALl 可以进行合并，dataType返回数组
  // formListAll_entityType: {
  //   label: "模型列表(entityType)",
  //   dataType: dataType.entityType_name_list,
  //   api: entityModels,
  // },
  // formFieldListAll: {
  //   label: "字段列表(id)",
  //   dataType: dataType.id_name_list,
  //   api: formFieldListAll,
  //   params: {
  //     formId: { 
  //       must: true, 
  //       label: "模型id", 
  //       sourceType:"field" 
  //     },
  //   },
  // },

  formFieldListAll_fieldName: {
    label: "字段列表(fieldName)",
    dataType:DataType.array,// dataType.fieldName_title_list,
    dataModel:"FormField",
    api: formFieldListAll,
    params: {
      formId: { must: true, label: "模型id",sourceType:sourceType.field },
    },
    match:[
      {
      dataType:DataType.array,
      dataModel:"ISelect",
      func:(datas:FormField[])=>{
        return datas.map((data:FormField)=>{return {value:data.fieldName,label:data.title}});
      }
    }
    ]
  },
  formConditionListAll: {
    label: "查询条件",
    api: formConditionListAll,
    dataType:DataType.array,// dataType.fieldName_title_list,
    dataModel:"FormCondition",
    params: {
      formId: { must: true, label: "模型id", sourceType:"field"},
    },
    match:[
      {
      dataType:DataType.array,
      dataModel:"ISelect",
      func:(datas:FormCondition[])=>{
        return datas.map((data:FormCondition)=>{return {value:data.id,label:data.name}});
      }
    }
    ]
  },
  reportItemListAll: {
    label: "统计项",
    dataType:DataType.array,
    dataModel:"ReportItem",
    api: listAll,
    params: {
      formId: { must: false, label: "模型id", sourceType:"field"},
    },
    match:[
      {
      dataType:DataType.array,
      dataModel:"ISelect",
      func:(datas:ReportItem[])=>{
        return datas.map((data:ReportItem)=>{return {value:data.id,label:data.name}});
      }
    }
    ]
  },
  // getDictByCode: {
  //   label: "字典信息",
  //   dataType: dataType.val_title_list,
  //   api: listByCode,
  //   params: {
  //     code: { must: true, label: "字典编码",sourceType:"dict" },
  //   },
  // },
  // resourcesListAll: {
  //   label: "资源信息",
  //   dataType: dataType.id_name_list,
  //   api: resourcesListAll,
  //   params: {
  //     menuCode: {
  //       must: false,
  //       label: "菜单code",
  //       sourceType:'field'
  //     },
  //   },
  // },
  // resourcesListAll_code: {
  //   label: "单个菜单的下属接口",
  //   dataType:DataType.array,
  //   dataModel: "SysResources",
  //   api: resourcesListAll,
  //   params: {
  //     menuCode: {
  //       must: true,
  //       label: "菜单字段",
  //       sourceType:sourceType.field
  //     },
  //   },
  //   match:[
  //     {
  //       dataType:DataType.array,
  //       dataModel:"ISelect",
  //       func:(datas:SysResources[])=>{
  //         return datas.map((data:SysResources)=>{return {value:data.resourcesCode,label:data.name}});
  //       }
  //     }
  //   ]
  // },
  // listMenu: {
  //   label: "菜单资源",
  //   api: listMenu,
  //   dataType: DataType.array,
  //   dataModel:"SysResources",
  //   match:[
  //     {
  //       dataType:DataType.array,
  //       dataModel:"ISelect",
  //       func:(datas:SysResources[])=>{
  //         return datas.map((data:SysResources)=>{return {value:data.resourcesCode,label:data.name}});
  //       }
  //     }
  //   ]
  // },
  areaTree: {
    label: "地区树",
    api: areaList,
    dataType: DataType.array,
    dataModel:'sysArea'
  },
  sysGroupList: {
    label: "权限组列表",
    api: groupList,
    dataType: DataType.array,
    dataModel:'sysGroup',
    match:[{
      dataType: DataType.array,
      dataModel:"ISelect",
      func:(datas:SysGroup[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.id||"",label:d.name}})
      }
    }]
  },
  orgTree: {
    label: "机构树",
    api: orgList,
    dataType: DataType.array,
    dataModel:'sysOrg',
  },
  menuTree: {
    label: "菜单树",
    api: menuList,
    dataType: DataType.array,
    dataModel:'sysMenu',
  },
  deptTree: {
    label: "部门树",
    dataType: DataType.array,
    dataModel:'sysDept',
    api: deptList,
  },
  allRoute:{
    label:"路由列表",
    dataType: DataType.array,
    dataModel:'ISelect',
    func:allRouter,//同步方法返回数据
  },
  filterType:{
    label:"过滤维度",
    dataType: DataType.array,
    dataModel:'ISelect',
    func:filterType,//同步方法返回数据
  },
  dictType:{
    label:'字典类别',
    api: listType,
    dataType:DataType.array,
    dataModel:'SysDict',
    match:[{
      dataType: DataType.array,
      dataModel:"ISelect",
      func:(datas:SysDict[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.code||"",label:d.title}})
      }
    }]
  },
  roleResources:{
    label:"菜单角色资源",
    dataType: DataType.array,
    dataModel:'MenuVo',
    api:roleResources,
    params:{
      sysRoleId:{
        label:"角色ID",
        sourceType:sourceType.field,
        must:false,
      }
    },
    match:[{
      dataType: DataType.array,
      dataModel:"PageSelectData",
      func:(datas:MenuVo[]):PageSelectData[]=>{
      const pageSelectData= datas.map((d)=>{
        return {groupName:d.name,details:d.sysResourcesList?.map((s)=>{return {
          label:s.name,
          value:s.id
        }})}
      })
      return  pageSelectData;
      }
    }]

  },
  findName: {
    label: "关联名称信息", //接口名称
    dataType: DataType.array,//接口出参类型
    dataModel: "IFkItem", //接口出参模型类型
    api: findName, //接口
    params: {
      entityType:{
        label:"模型标识",
        sourceType:"fieldInfo",
        fieldInfo:{
          attr:"entityType"
        }
      } ,
      ids:{//动态实时获取
        label:"记录值",
        sourceType:"fieldValue",
      }
    },
},
  
  roleAllResources: {
    label: "可分配的资源",
    dataType: DataType.array,
    dataModel:"SysResources",
    api: roleAllResources,
  },
  // sysFilterSelect: {
  //   api: listSysFilterVo,
  //   label: "行级数据筛选列表",
  //   dataType:DataType.array,
  //   dataModel:'SysFilterVo'
  // },
};


