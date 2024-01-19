import { ITree } from '@src/api/base';
import { DataModel, DataType } from '@src/dsl/base';
import {  ITreeData } from '@src/dsl/component';
import { ApiDatas, ApiInfo, ParamsObj } from '@src/components/compConf/compConf';
import { FormVo,  } from '@src/api/Form';
import { deptOpenApi, dictOpenApi, fieldOpenApi, formOpenApi, groupOpenApi, menuOpenApi, resourcesOpenApi, roleOpenApi, routeOpenApi } from './apis/Admin';
import { dynamicParamsTran } from '@src/components/form/propload';
import { orderSaleOpenApi, productOpenApi, stockItemOpenApi } from './apis/Erp';
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
  fieldOpenApi,//字段
  //erp
  productOpenApi,//产品接口
  stockItemOpenApi,//库存接口
  orderSaleOpenApi,//展厅
}
