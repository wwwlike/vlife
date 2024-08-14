import { FormVo, list } from '@src/api/Form';
import { list as deptList,SysDept } from '@src/api/SysDept';
import { list as dictList, SysDict } from '@src/api/SysDict';
import { list as userList, SysUser } from '@src/api/SysUser';
import { listAll as groupList } from '@src/api/SysGroup';
import { listAll as roleList,SysRole } from '@src/api/SysRole';
import { listAll, listAll as menuList, MenuVo, SysMenu } from '@src/api/SysMenu';
import { list as resourcesList, listButtons, SysResources } from '@src/api/SysResources';
import { ApiInfo } from '@src/components/compConf/compConf';
import { DataModel, DataType, OptEnum } from '@src/dsl/base';
import { ISelect, ITreeData } from '@src/dsl/component';
import { allRouter } from '@src/router';
import { isNull } from 'lodash';
import { itree2TreeData } from '../ApiDatas';
import { listAll as fieldList,FormFieldVo, FormField } from '@src/api/FormField';
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
        label:'字典项选择',
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
      },
      dictItem:{
        label:'字典项信息',
        dataType: DataType.array,
        dataModel:"SysDict",
        params:{//参数配置
          code:{
            label:'字典编码',
            required:true,
            dynamicParams:true,
            dataModel:DataModel.string,
            dataType:DataType.basic,
            options:{apiInfoKey:"dictOpenApi",match:"ISelect_TYPE"}
          }
        },
        func:(datas:SysDict[]):SysDict[]=>{
          return   datas.filter(d=>d.level===2)
        }
      }
  }
}

export const userOpenApi:ApiInfo={
  label:'用户查询',
  dataType:DataType.array,
  dataModel:'SysUser',
  api:userList,
  match:{
    ISelect_id:{
      label:'id/name',
      dataType: DataType.array,
      dataModel:"ISelect",
      params:{//参数配置
        id:{
          label:'用户id集合',
          dataModel:DataModel.string,
          dataType:DataType.array,
        },
        username:{
          label:'用户username集合',
          dataModel:DataModel.string,
          dataType:DataType.array,
        },
        sysDept_code:{
          label:'部门编码查询',
          dataModel:DataModel.string,
          dataType:DataType.basic,
        },
        name:{
          label:'用户名/电话/邮箱',
          dataModel:DataModel.string,
          dataType:DataType.basic,
        }
      },
      func:(datas:SysUser[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.id,label:d.name}})
      }
    },
    ISelect_username:{
      label:'username/name',
      dataType: DataType.array,
      dataModel:"ISelect",
      params:{//参数配置
        id:{
          label:'用户id集合',
          dataModel:DataModel.string,
          dataType:DataType.array,
        },
        username:{
          label:'用户username集合',
          dataModel:DataModel.string,
          dataType:DataType.array,
        },
        sysDept_code:{
          label:'部门编码查询',
          dataModel:DataModel.string,
          dataType:DataType.basic,
        },
        name:{
          label:'用户名/电话/邮箱',
          dataModel:DataModel.string,
          dataType:DataType.basic,
        }
      },
      func:(datas:SysUser[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.username,label:d.name}})
      }
    },
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
     SELF:{
      dataType: DataType.array,
      dataModel:'sysResources',
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
     },
     flow:{
      label:"流程可触发执行的接口",
      dataType: DataType.array,
      dataModel:"ISelect",
      params:{
        entityType:{
          label:"实体类型",
          required:true,
          dynamicParams:true,
          dynamicParamsOpt:OptEnum.eq,
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:true,
        },
      },
      func:(datas:SysResources[]):ISelect[]=>{
        return datas.filter(f=>f.methedType.startsWith("@Post")&&f.methedType.indexOf("{id}")!==-1).map((d)=>{return {
          value:d.url,
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
    },level2:{
      title:"业务应用",
      func:(datas:SysMenu[])=>{
        return datas.filter((d)=>{return d.app&&d.name!=='平台管理'});
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
      params:{
        sysMenuId:{
          fromField:true,
          dataModel:DataModel.string,
          dataType:DataType.basic,
          label:"应用id",
        }
      },
      func:(datas:FormVo[]):ISelect[]=>{
        return datas.map((data:FormVo)=>{return {value:data.id,label:data.title||data?.type}});
      }
    },
    type:{
      label:"选项值为type",
      dataType:DataType.array,
      dataModel:"ISelect",
      func:(datas:FormVo[]):ISelect[]=>{
        return datas.map((data:{type:string,title:string})=>{return {value:data.type,label:data?.title||data?.type}});
      }
    },
    entityRelationModel:{
      label:"关联dto/vo/req模型",
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
    subModel:{
      label:"关联外键实体模型",
      dataType:DataType.array,
      dataModel:"FormVo",
      params:{
        entityId:{
          dataModel:DataModel.string,
          dataType:DataType.basic,
          fromField:true,
          required:true,
          send:false,
        }
      },
      filterKey:[],
      func:(datas:FormVo[],{entityId}:{entityId:string}):FormVo[]=>{
        const model=datas.filter(d=>d.id===entityId)?.[0];
        const fkEntityName:string[]=model?.fields?.filter(f=>f.entityType!==model?.type)?.map(f=>f.entityType)||[];
        return datas.filter(d=>fkEntityName.includes(d.type));
      }
    },
    groupFieldSelect:{
      label:"表和其外键表可分组字段",
      dataType:DataType.array,
      dataModel:"ISelect",
      params:{
        formId:{
          dataModel:DataModel.string,
          dataType:DataType.basic,
          required:true,
          fromField:true,
          send:false,
        }
      },
      filterKey:[],
      func:(datas:FormVo[],{formId}:{formId:string}):ISelect[]=>{
        const model=datas.filter(d=>d.id===formId)?.[0];
        const fkEntityName:string[]=model?.fields?.filter(f=>f.entityType!==model.type).map(f=>f.entityType);
        const fkModel= datas?.filter(d=>fkEntityName.includes(d.type));
        const groupField:ISelect[]=[]
       //主表字段
        groupField.push(... model.fields.filter((f:FormFieldVo)=>f.dataType==="basic"&&(f.dictCode||f.fieldType==="date"||f.pathName.endsWith("Id"))).map(f=>{
            return {label:f.title,value:f.id}
        }))
       //外键表可分组字段
       fkModel.forEach(m=>{
        groupField.push(
          ...m.fields.filter((f:FormFieldVo)=>f.dataType==="basic"&&(f.dictCode||f.fieldType==="date"||f.pathName.endsWith("Id"))).map(f=>{
            return {label:`${m.title}.${f.title}`,value:f.id}
          })
        )})
        return groupField
      }
    },
    single:{
      label:"单个模型",
      dataModel:"FormVo",
      dataType:DataType.object,
      params:{
        id:{
          label:"模型ID",
          dataType:DataType.basic,
          dataModel:DataModel.string,
          required:true,
          fromField:true,
        }
      },
      func:(data:FormVo[], params:any)=> {
          return data[0]
      },
    }
  },

}
export const groupOpenApi:ApiInfo={
  label:"权限组",
  dataType: DataType.array,
  dataModel:'SysGroup',
  api:groupList,
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

export const fieldOpenApi:ApiInfo={
  label:"字段",
  dataType: DataType.array,
  dataModel:'FormField',
  api:fieldList,
  filters:{
    total:{
      title:"可统计字段",
      func:(datas)=>{return datas.filter((f)=>{
        return f.dataType === "basic" &&(f.fieldType === "number"||f.fieldName==="id")
      })}
    }
  },
  match:{
    IselectId:{
      label:"统计模型字段选择(主键)",
      dataType:DataType.array,
      dataModel:"ISelect",
      params:{
        formId:{
          label:"模型id",
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:true,
          required:true
        }
      },
      func:(datas:FormFieldVo[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.id,label:d.fieldName==="id"?"数据总量":d.title}});
      }
    },IselectFieldName:{
      label:"模型字段选择(fieldName)",
      dataType:DataType.array,
      dataModel:"ISelect",
      params:{
        formId:{
          label:"模型id",
          dataType:DataType.basic,
          dataModel:DataModel.string,
          dynamicParams:true,
          fromField:true,
          required:true
        }
      },
      func:(datas:FormField[]):ISelect[]=>{
        return datas.map((d)=>{return {value:d.fieldName,label:d.fieldName==="id"?"数据总量":d.title}});
      }
    }
  }
}

export const routeOpenApi:ApiInfo={
  label:"MenuVo",
  dataType: DataType.array,
  dataModel:'MenuVo',
  api:listAll,
  match:{
    self:{  
        label:"路由列表",
        dataType: DataType.array,
        dataModel:'ISelect',
        func:(datas:MenuVo[]):ISelect[]=>{
          const routerList=datas.filter((d:MenuVo)=>d.routerAddress).map(d=>d.routerAddress);
          //未使用过的路由
          return allRouter().filter(d=>!routerList.includes(d.value))
        }
    },
    menuVO:{
      dataType: DataType.array,
      dataModel:'MenuVo',
    }
  }
}

export const resourcesButtonOpenApi:ApiInfo= {
  label: "按钮接口资源",
  dataType: DataType.array,
  dataModel:'sysResources',
  api:listButtons,
  match:{
    ButtonResources:{
      dataType: DataType.array,
      dataModel:"ISelect",
      params:{
        formId:{
          label:"模块",
          required:true,
          dynamicParams:true,
          dataType:DataType.basic,
          dataModel:DataModel.string,
          fromField:true,
        },
      },
      func:(datas:SysResources[],{formId,sysMenuId}:{formId:string,sysMenuId:string}):ISelect[]=>{
        return datas.map((d)=>{return {
          value:d.id,
          label:d.name,
          extra:d.remark,
        }})
      }
    },
  }
}