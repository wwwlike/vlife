import { ITree } from '@src/api/base';
// import { list as dictList, listType, SysDict } from '@src/api/SysDict';
import { DataModel, DataType } from '@src/dsl/base';
import { ISelect, ITreeData } from '@src/dsl/component';
// import { listAll as deptList, SysDept } from "@src/api/SysDept";
import { listAll as menuList,  SysMenu } from "@src/api/SysMenu";
import { ApiDatas, ApiInfo, ParamsObj, selectObj } from '../components/compConf/compConf';
import { entityModels, FormVo, model, subForms,list as formList } from '@src/api/Form';
import {listAll as formFieldListAll} from "@src/api/FormField";
import {list as listResources, listMenuUseableResources, SysResources } from '@src/api/SysResources';
import { deptOpenApi, dictOpenApi, formOpenApi, groupOpenApi, menuOpenApi, resourcesOpenApi, roleOpenApi, routeOpenApi } from './apis/Admin';
import { dynamicParamsTran } from '@src/components/form/propload';
/**
 * 将db里的树形数据转换成组件可用的树形数据
 */
export const itree2TreeData=(data:ITree[],valueName:"id"|"code"="id",root?:string,):ITreeData[]=>{
  if(root){
    return data.filter(d=>d.pcode===root).map(ddd=>{return {
      key:ddd.id,value:ddd[valueName],label:ddd.name,children:itree2TreeData(data,valueName,ddd.code)}
    })
  }else{
    return data.filter(d=>!data.map(dd=>dd.code).includes(d.pcode)).map(ddd=>{return {
      key:ddd.id,value:ddd[valueName],label:ddd.name,children:itree2TreeData(data,valueName,ddd.code)}
    })
  }
}

export type loadApiParams={
  apiInfoKey:string,
  match:string,
  paramObj?:any,
  filterFunc?:string,
  filterConnectionType?:string
}
//执行指定的数据适配转换方法
export const loadApi=({ 
  apiInfoKey,
    match,
    paramObj,
    filterFunc,
    filterConnectionType}:loadApiParams):Promise<any>=>{
      const apiInfo:ApiInfo=apiDatas[apiInfoKey];
      const params=apiInfo.match[match].params;
      return apiInfo?.api({ ...paramObj&&match&&params&&dynamicParamsTran(paramObj,params)}).then((d) => {
      //异步请求到的数据
      let datas = d.data;
      if (filterFunc  && datas&&apiInfo.filters) {
          const filters=filterFunc.split(",");
          const filterDatas=filters.map(funName=>{
            const filter= apiInfo?.filters?.[funName];
              if(filter&& typeof filter === "object" && typeof filter.func === "function"){
                return  filter.func(datas);
              }else if(funName.split(":").length===2){// filter:dictCode,filtler2,filter3 字典过滤器，暂未实现
                return datas.filter((d:any)=>{ return d[funName.split(":")[0]]===funName.split(":")[1]})
              }
              return []
            }
            )//多次过滤的数据
          if(filterConnectionType==="or"){
            //并集
            datas =   filterDatas.reduce((acc, arr) => {
              arr.forEach((obj:any) => {
                if (!acc.some((item:any) => item.id === obj.id)) {
                  acc.push(obj);
                }
              });
              return acc;
            }, []);
          }else{
            //交集
            datas =  filterDatas.reduce((acc, arr) => {
              arr.forEach((obj:any) => {
                if (filterDatas.every(subArr => subArr.some((item:any) => item.id === obj.id))) {
                  if (!acc.some((item:any) => item.id === obj.id)) {
                    acc.push(obj);
                  }
                }
              });
              return acc;
            }, []);
          }
        }
      if (apiInfo.match && apiInfo.match[match]?.func) {
        // 数据一致的转换函数
        datas = (apiInfo.match[match].func as Function)(datas, paramObj);
      }
      return datas;
  })
}


type API = {
  apiKey: string;
  matchKey: string;
  apiLabel: string;
  matchLabel?: string;
  dataModel: DataModel | string;
  dataType: DataType;
  parentClass:string[],//父类
  app: string;
  params?: ParamsObj;//入参
};
//将所有的api数据解析打平放入数组
export const allApis=(models:FormVo[]):API[] => {
  const apis: API[] = [];
  const apiKeys = Object.keys(apiDatas);
  apiKeys.forEach((apiKey) => {
    const matchKeys = Object.keys(apiDatas[apiKey].match);
    matchKeys.forEach((matchKey) => {
      const apiModel = apiDatas[apiKey].dataModel;
      const matchObj = apiDatas[apiKey].match[matchKey];
      //分类模型
      const apiForm= models?.filter(
        (f) => f.type.toLowerCase() === apiModel.toLowerCase()
      )?.[0]
      //实际接口模型
      const matchForm= models?.filter(
        (f) => f.type.toLowerCase() === matchObj.dataModel.toLowerCase()
      )?.[0]
      apis.push({
        apiKey,
        matchKey,
        apiLabel: apiDatas[apiKey].label,
        matchLabel: matchObj.label,
        dataModel: matchObj.dataModel,
        dataType: matchObj.dataType,
        parentClass:matchForm?.typeParentsStr?.split(",")||[],
        //应用分类
        app:apiForm?.sysMenuId || "other",
        params: matchObj.params,
      });
    });
  });
  return apis;
}

export const apiDatas:ApiDatas={
  dictOpenApi,//字典开放api
  resourcesOpenApi,//资源
  deptOpenApi, //科室
  menuOpenApi,//菜单
  routeOpenApi,//路由
  groupOpenApi,//权限组
  roleOpenApi,//角色
  formOpenApi,//模型
}

// //所有数据的接口
// export const apiDatas1:ApiDatas={
//   dictDatas:{
//     label:'字典数据',
//     api:dictList,
//     dataType:DataType.array,
//     dataModel:'SysDict',
//     match:{//数据转换，匹配一直的prop属性
//       ISelect:{
//         dataType: DataType.array,
//         dataModel:"ISelect",
//         func:(datas:SysDict[]):ISelect[]=>{
//           return datas.map((d)=>{return {value:d.val||d.code,label:d.title}})
//       }
//       }
//     },
//     filter:(data:SysDict[],{code}:{code:string}):SysDict[]=>{ //固定要进行数据过滤的方法
//       if(code===undefined||code==="vlife"){
//         return data.filter(d=>d.level===1)
//       }else {
//         return data.filter(d=>d.code===code&&d.level===2)
//       }
//     },
//     params:{
//       code:{
//         label:"字典分类",
//         required:false,
//         dataModel:DataModel.string,
//         dataType:DataType.basic,
//          options:():Promise<Partial<selectObj>[]>=>{
//           return  listType().then((d)=>{
//             if(d.data){
//             return d.data?.map((m)=>{ return {label:m.title,value:m.code}});
//           }else{
//             return [];
//           }
//            });
//          }
//       },
//     },
//   },


//   resources: {
//     label: "菜单可绑定api",
//     dataType: DataType.array,
//     dataModel:'sysResources',
//     api:listMenuUseableResources,
//     params:{
//       sysMenuId:{
//         label:"绑定菜单",
//         required:true,
//         dataType:DataType.basic,
//         dataModel:DataModel.string,
//         fromField:true,
//       },
//     },
//     match:{
//       ISelect:{
//         dataType: DataType.array,
//         dataModel:"ISelect",
//         func:(datas:SysResources[]):ISelect[]=>{
//           return datas.map((d)=>{return {
//             value:d.id,
//             label:d.name,
//             extra:d.remark,
//           }})
//         }
//       }
//     }
//   },
//   resourceIds: {
//     label: "查询指定的接口",
//     dataType: DataType.array,
//     dataModel:'sysResources',
//     api:listResources,
//     params:{
//       ids:{
//         label:"指定集合",
//         required:true,
//         dataType:DataType.array,
//         dataModel:DataModel.string,
//         fromField:true,
//       },
//     },
//     match:{
//       ISelect:{
//         dataType: DataType.array,
//         dataModel:"ISelect",
//         func:(datas:SysResources[]):ISelect[]=>{
//           return datas.map((d)=>{return {
//             value:d.id,
//             label:d.name,
//             // extra:d.remark,
//           }})
//         }
//       }
//     }
//   },
//   deptTree: {
//     label: "部门树",
//     dataType: DataType.array,
//     dataModel:'sysDept',
//     api: deptList,
//     match:{//数据转换，匹配一直的prop属性
//       ID_ITreeData:{
//         label:"选项值为主键",
//         dataType: DataType.array,
//         dataModel:"ITreeData",
//         func:(datas:SysDept[]):ITreeData[]=>{
//            return  itree2TreeData(datas);
//         } 
//       },
//       CODE_ITreeData:{
//         label:"选项值为code",
//         dataType: DataType.array,
//         dataModel:"ITreeData",
//         func:(datas:SysDept[]):ITreeData[]=>{
//            return  itree2TreeData(datas,"code");
//         } 
//       }
//     },
//   },
//   menuTree: {
//       label: "菜单数据",
//       api: menuList,
//       dataType: DataType.array,
//       dataModel:'sysMenu',
//       match:{
//         ISelect:{
//           dataType: DataType.array,
//           dataModel:"ISelect",
//           func:(datas:SysMenu[]):ISelect[]=>{
//             return datas.map((d)=>{return {value:d.id||"",label:d.name}})
//           }
//       },
//       ID_ITreeData:{
//         label:"选项值为主键",
//         dataType: DataType.array,
//         dataModel:"ITreeData",
//         func:(datas:SysMenu[]):ITreeData[]=>{
//            return  itree2TreeData(datas);
//         } 
//       }, CODE_ITreeData:{
//         label:"选项值为code",
//         dataType: DataType.array,
//         dataModel:"ITreeData",
//         func:(datas:SysMenu[]):ITreeData[]=>{
//            return  itree2TreeData(datas,"code");
//         } 
//       }
//     }
//   },
//   formListAll: {
//     label: "查询实体模型数据",
//     dataType:DataType.array,
//     dataModel:"FormVo",
//     api: entityModels,
//     params: {
//       appId: { 
//         required: false, 
//         label: "应用id", 
//         dataType: DataType.basic,
//         dataModel:DataModel.string,
//         remark:"应用id就是类型为应用的菜单id",
//         fromField:{entity:"sysMenu",field:"id"} //从当前表单里找
//       },
//     },
//     // filter(data:FormVo[], {appId}:{appId?:string}) {
//     //   if(appId){
//     //     return data.filter(d => d.itemType == "entity");
//     //   }else{
//     //     return data;
//     //   }
//     // },
//     match:{
//       id:{
//         dataType:DataType.array,
//         dataModel:"ISelect",
//         label:"id作为选项值",
//         func:(datas:{id:string,title:string}[]):ISelect[]=>{
//           return datas.map((data:{id:string,title:string})=>{return {value:data.id,label:data.title}});
//        }},
//        type:{
//         label:"type作为选项值",
//         dataType:DataType.array,
//         dataModel:"ISelect",
//         func:(datas:{type:string,title:string}[]):ISelect[]=>{
//           return datas.map((data:{type:string,title:string})=>{return {value:data.type,label:data.title}});
//        }},
//        resources:{
//         label:"与资源关联",
//         dataType:DataType.array,
//         dataModel:"ITreeData",
//         func:(datas:FormVo[],params:any):ITreeData[]=>{
//           //根据参数进行转换
//           return datas.map((data:FormVo)=>{
//             // if(params.appId){
//             //   return {key:data.id,value:data.id,label:data.title,
//             //     //菜单已关联和可关联的接口信息
//             //     children:data.resources?.filter(r=>(r.sysMenuId===undefined||r.sysMenuId===null||r.sysMenuId===params.appId)&&r.state==="1").map(r=>{return {key:r.id,value:r.id,label:r.name}})}
//             // }
//             if(params.appId){
//               return {key:data.id,value:data.id,label:data.title,
//                 //菜单已关联和可关联的接口信息
//                 children:data.resources?.filter(r=>(r.sysMenuId===undefined||r.sysMenuId===null||r.sysMenuId===params.appId)&&r.state==="1").map(r=>{return {key:r.id,value:r.id,label:r.name}})}
//             }else{
//               return {key:data.id,value:data.id,label:data.title,
//                 //菜单已关联和可关联的接口信息
//                 children:data.resources?.map(r=>{return {key:r.id,value:r.id,label:r.name}})}
//             }
//        })}
//       },
//     }
//   },
//   formDatas:{
//     label: "模型数据",
//     dataType:DataType.array,
//     dataModel:"FormVo",
//     api:formList,
//     match:{
//       entity:{
//         label:"实体",
//         dataType:DataType.array,
//         dataModel:"ISelect",
//         func:()=>{

//         }
//       }
//     }

//   },
//   subForms: {
//     label: "当前表的子数据集",
//     dataType:DataType.array,
//     dataModel:"FormVo",
//     api: subForms,
//     params: {
//       id: { 
//         required:true,
//         label: "模型id", 
//         dataModel:DataModel.string,
//         fromField:{entity:"form",field:"id"} //数据来自同表单的对应到实体form的id字段
//       },
//     },
//   },
//   formVo: {
//     label: "单个数据集",
//     dataType:DataType.object,
//     dataModel:"FormVo",
//     api: model,
//     params: {
//       id: { 
//         required:true,
//         label: "模型id", 
//         dataModel:DataModel.string,
//         fromField:{entity:"form",field:"id"} //数据来自同表单的对应到实体form的id字段
//       },
//     },
//   },

//   formFields: {
//     label: "字段",
//     dataType:DataType.array,// dataType.fieldName_title_list,
//     dataModel:"FormField",
//     api: formFieldListAll,
//     params: {
//       formId:{
//         label:"模型id",
//         required:true,
//         dataModel:DataModel.string,
//         fromField:{entity:"form",field:"id"}//入参来源是这个字段的值
//         // options:(formVo:FormVo):selectObj[]=>{
//         //   // alert(JSON.stringify(formVo.parentForm).length)]
//         //   const form=formVo
//         //   return form.fields.filter(f=>f.pathName==='formId').map((f)=>{
//         //     return {label:f.title,value:f.fieldName}
//         //   })
//         // }
//       }
//     },
//     match:{
//       ISelectr_ID:{
//         dataType:DataType.array,
//         dataModel:"ISelect",
//         label:"ID作为选项值",
//         func:(datas:{id:string,title:string}[]):ISelect[]=>{
//             return datas.map((data:{id:string,title:string})=>{return {value:data.id,label:data.title}});
//          }
//         },
//       ISelectr_TYPE:{
//         label:"字段名作为选项值",
//         dataType:DataType.array,
//         dataModel:"ISelect",
//         func:(datas:{fieldName:string,title:string}[]):ISelect[]=>{
//           return datas.map((data:{fieldName:string,title:string})=>{return {value:data.fieldName,label:data.title}});
//          }
//         }
//       }
//   },

//   allRoute:{
//     label:"路由列表",
//     dataType: DataType.array,
//     dataModel:'ISelect',
//     api:()=>{
//       return new Promise((resolve) => {
//         resolve({ code: "200", msg: "success", data: allRouter() });
//       });
//     }
//   },
// }
