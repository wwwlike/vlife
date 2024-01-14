import { FormVo, list } from '@src/api/Form';
import { list as deptList,SysDept } from '@src/api/SysDept';
import { list as dictList, SysDict } from '@src/api/SysDict';
import { listAll } from '@src/api/SysGroup';
import { listAll as roleList,SysRole } from '@src/api/SysRole';
import { listAll as menuList, SysMenu } from '@src/api/SysMenu';
import { list as resourcesList, SysResources } from '@src/api/SysResources';
import { ApiInfo } from '@src/components/compConf/compConf';
import { DataModel, DataType, OptEnum } from '@src/dsl/base';
import { ISelect, ITreeData } from '@src/dsl/component';
import { allRouter } from '@src/router';
import { match } from 'assert';
import { isNull } from 'lodash';
import { itree2TreeData } from '../ApiDatas';
/**
 * 平台接口定义文件
 */

//字典api
export const dictOpenApi:ApiInfo={
    label:'字典',
    dataType:DataType.array,
    dataModel:'SysDict',
    api:dictList,
    //和参数无关的过滤
    filters:{
      field: {
        title:"业务字典",
        func:(sysDicts:SysDict[])=>{
          return sysDicts.filter((d,index)=>d.type==='field');
        },
      },
      admin: {
        title:"平台字典",
        func:(sysDicts:SysDict[])=>{
          return sysDicts.filter((d,index)=>d.type==='admin');
        },
      },vlife: {
        title:"系统字典",
        func:(sysDicts:SysDict[])=>{
          return sysDicts.filter((d,index)=>d.type==='vlife');
        },
      },
    },
    match:{
      ISelect_ITEMS:{
        label:'分项选择',
        dataType: DataType.array,
        dataModel:"ISelect",
        filterKey:[],//不使client用过滤
        params:{//参数配置
          code:{
            label:'字典编码',
            required:true,
            dynamicParams:true,
            dataModel:DataModel.string,
            dataType:DataType.basic,
            //参数来自下拉选项(options); 选项数据来自指定接口的指定匹配模式
            options:{apiInfoKey:"dictOpenApi",match:"ISelect_TYPE"}
          }
        },
        func:(datas:SysDict[]):ISelect[]=>{
          return datas.filter(d=>d.level===2).map((d)=>{return {value:d.val,label:d.title}})
        }
      },
      ISelect_TYPE:{
        label:'分类选择',
        dataType: DataType.array,
        dataModel:"ISelect",
        filterKey:["field","vlife"],
        func:(datas:SysDict[]):ISelect[]=>{
          return datas.filter(d=>d.level===1).map((d)=>{return {value:d.code,label:d.title}})
        }
      }
  }
}

export const resourcesOpenApi:ApiInfo= {
  label: "权限资源",
  dataType: DataType.array,
  dataModel:'sysResources',
  api:resourcesList,
  match:{
    ISelectMenuResources:{
      label:'指定菜单可关联资源',
      dataType: DataType.array,
      dataModel:"ISelect",
      params:{
        sysMenuId:{
          label:"菜单",
          // required:true,
          send:false,
          dynamicParams:true,
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:true,
        },
        formId:{
          label:"模块",
          // required:true,
          dynamicParams:true,
          send:false,
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:true,
        },
      },
      func:(datas:SysResources[],{formId,sysMenuId}:{formId:string,sysMenuId:string}):ISelect[]=>{
        return datas.filter(
          s=>s.formId===formId&&(isNull(s.sysMenuId)||s.sysMenuId===sysMenuId)
            &&("single"===s.permission||("extend"===s.permission&&isNull(s.pcode)))).map((d)=>{return {
          value:d.id,
          label:d.name,
          extra:d.remark,
        }})
      }
    },
    ISelect_IDS:{
      label:"指定集合的资源",
      dataType: DataType.array,
      dataModel:"ISelect",
      params:{
        id:{
          label:"关联字段集合",
          required:true,
          dynamicParams:true,
          dynamicParamsOpt:OptEnum.in,
          dataType:DataType.array,
          dataModel:DataModel.string,
          fromField:true,
        },
      },
      func:(datas:SysResources[]):ISelect[]=>{
        return datas.map((d)=>{return {
          value:d.id,
          label:d.name,
        }})
      }
     }
  }
}
export const deptOpenApi:ApiInfo= {
  label: "部门科室",
  dataType: DataType.array,
  dataModel:'sysDept',
  api: deptList,
  match:{//数据转换，匹配一直的prop属性
    SELF:{
      dataType: DataType.array,
      dataModel:'sysDept',
    },
    ID_ITreeData:{
      label:"选项值为部门ID",
      dataType: DataType.array,
      dataModel:"ITreeData",
      func:(datas:SysDept[]):ITreeData[]=>{
          return  itree2TreeData(datas);
      } 
    },
    CODE_ITreeData:{
      label:"选项值为部门Code",
      dataType: DataType.array,
      dataModel:"ITreeData",
      func:(datas:SysDept[]):ITreeData[]=>{
          return  itree2TreeData(datas,"code");
      } 
    }
  },
};
export const menuOpenApi:ApiInfo= { 
  label: "菜单",
  dataType: DataType.array,
  dataModel:'sysMenu',
  api: menuList,
  filters:{
    level1:{
      title:"应用",
      func:(datas:SysMenu[])=>{
        return datas.filter((d)=>{return d.app});
      }
    }
  },
  match:{//数据转换，匹配一直的prop属性
    SELF:{
      dataType: DataType.array,
      dataModel:'sysMenu',
    },
    ISelect:{
      dataType: DataType.array,
      dataModel:"ISelect",
      func:(datas:SysMenu[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.id||"",label:d.name}})
      }
    },
    ID_ITreeData:{
      label:"选项值为主键",
      dataType: DataType.array,
      dataModel:"ITreeData",
      func:(datas:SysMenu[]):ITreeData[]=>{
          return  itree2TreeData(datas);
      } 
    }, CODE_ITreeData:{
      label:"选项值为code",
      dataType: DataType.array,
      dataModel:"ITreeData",
      func:(datas:SysMenu[]):ITreeData[]=>{
          return  itree2TreeData(datas,"code");
      } 
    }
  },
}

export const formOpenApi:ApiInfo= { 
  label: "模型",
  dataType: DataType.array,
  dataModel:'formVo',
  api: list,
  filters:{
    entity:{
      title:"过滤实体模型",
      func:(datas:FormVo[])=>{
        return datas.filter(d=>d.itemType==="entity");
      }
    },
    req:{
      title:"查询模型",
      func:(datas:FormVo[])=>{
        return datas.filter(d=>d.itemType==="req");
      }
    }
    
  },
  match:{
    id:{
      dataType:DataType.array,
      dataModel:"ISelect",
      label:"选项值为主键",
      func:(datas:FormVo[]):ISelect[]=>{
        return datas.map((data:{id:string,title:string})=>{return {value:data.id,label:data.title}});
      }
    },
    type:{
      label:"选项值为type",
      dataType:DataType.array,
      dataModel:"ISelect",
      func:(datas:FormVo[]):ISelect[]=>{
        return datas.map((data:{type:string,title:string})=>{return {value:data.type,label:data.title}});
      }
    },
    entityRelationModel:{
      label:"实体相关模型",
      dataType:DataType.array,
      dataModel:"ISelect",
      params:{
        entityId:{
          dataModel:DataModel.string,
          dataType:DataType.basic,
          fromField:true,
          send:false,
        }
      },
      filterKey:[],
      func:(datas:FormVo[],{entityId}:{entityId:string}):ISelect[]=>{
        const entityType=datas.filter(d=>d.id===entityId)?.[0]?.type;
        return datas.filter(d=>d.entityType===entityType&&(d.itemType==="save"||d.itemType==="entity")).map((data:{type:string,title:string})=>{return {value:data.type,label:data.type}});
      }
    },
    // resources:{
    //     label:"与资源关联",
    //     dataType:DataType.array,
    //     dataModel:"ITreeData",
    //     func:(datas:FormVo[],params:any):ITreeData[]=>{
    //       //根据参数进行转换
    //       return datas.map((data:FormVo)=>{
    //         // if(params.appId){
    //         //   return {key:data.id,value:data.id,label:data.title,
    //         //     //菜单已关联和可关联的接口信息
    //         //     children:data.resources?.filter(r=>(r.sysMenuId===undefined||r.sysMenuId===null||r.sysMenuId===params.appId)&&r.state==="1").map(r=>{return {key:r.id,value:r.id,label:r.name}})}
    //         // }
    //         if(params.appId){
    //           return {key:data.id,value:data.id,label:data.title,
    //             //菜单已关联和可关联的接口信息
    //             children:data.resources?.filter(r=>(r.sysMenuId===undefined||r.sysMenuId===null||r.sysMenuId===params.appId)&&r.state==="1").map(r=>{return {key:r.id,value:r.id,label:r.name}})}
    //         }else{
    //           return {key:data.id,value:data.id,label:data.title,
    //             //菜单已关联和可关联的接口信息
    //             children:data.resources?.map(r=>{return {key:r.id,value:r.id,label:r.name}})}
    //         }
    //    })}
    //   },
    // }
  }
}
export const groupOpenApi:ApiInfo={
  label:"权限组",
  dataType: DataType.array,
  dataModel:'SysGroup',
  api:listAll,
  match:{
   ISelect:{
      dataType: DataType.array,
      dataModel:'ISelect',
      func:(datas:SysMenu[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.id,label:d.name}})
      }
   }
  }
}

export const roleOpenApi:ApiInfo={
  label:"角色",
  dataType: DataType.array,
  dataModel:'SysRole',
  api: roleList,
  match:{
   ISelect:{
      dataType: DataType.array,
      dataModel:'ISelect',
      func:(datas:SysRole[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.id,label:d.name}})
      }
   }
  }
}



export const routeOpenApi:ApiInfo={
  label:"路由列表",
  dataType: DataType.array,
  dataModel:'ISelect',
  api:()=>{
    return new Promise((resolve) => {
      resolve({ code: "200", msg: "success", data: allRouter() });
    });
  },
  match:{
    self:{    
        dataType: DataType.array,
        dataModel:'ISelect',
    }
  }
}


