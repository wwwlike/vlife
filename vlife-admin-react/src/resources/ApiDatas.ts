import { ITree } from '@src/api/base';
import { all, listType, SysDict } from '@src/api/SysDict';
import { DataModel, DataType } from '@src/dsl/base';
import { ISelect, ITreeData } from '@src/dsl/component';
import { listAll as deptList, SysDept } from "@src/api/SysDept";
import { allRouter, listAll as menuList,  SysMenu } from "@src/api/SysMenu";
import { ApiDatas, selectObj } from '../components/compConf/compConf';
import { detailFormVo, entityModels, FormVo, subForms } from '@src/api/Form';
import {listAll as formFieldListAll ,listGroupOption,listRelationField} from "@src/api/FormField";
import { list } from '@src/api/demo/DemoCustomer';

/**
 * 将db里的树形数据转换成组件可用的树形数据
 */
function itree2TreeData(data:ITree[],valueName:"id"|"code"="id",root?:string,):ITreeData[]{
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


//所有数据的接口
export const apiDatas:ApiDatas={
  dictDatas:{
    label:'字典数据',
    api:all,
    dataType:DataType.array,
    dataModel:'SysDict',
    match:{//数据转换，匹配一直的prop属性
      ISelect:{
        label:"下拉选项结构",
        dataType: DataType.array,
        dataModel:"ISelect",
        func:(datas:SysDict[]):ISelect[]=>{
          return datas.map((d)=>{return {value:d.val||d.code,label:d.title}})
      }
      }
    },
    filter:(data:SysDict[],{code}:{code:string}):SysDict[]=>{ //固定要进行数据过滤的方法
      if(code){
        return data.filter(d=>d.code===code&&d.dictType!==true)
      }else{
        return data.filter(d=>d.dictType===true)
      }
    },
    params:{
      code:{
        label:"字典分类",
        must:false,
        dataModel:DataModel.string,
         options:():Promise<Partial<selectObj>[]>=>{
          return  listType().then((d)=>{
            if(d.data){
            return d.data?.map((m)=>{ return {label:m.title,value:m.code}});
          }else{
            return [];
          }
           });
         }
      },
    },
  },

  cardNum: {
    label: "单个指标分析",
    dataType: DataType.basic,
    dataModel:'number',
    api: deptList,
  },
  cardNum2: {
    label: "单个指标分析2",
    dataType: DataType.basic,
    dataModel:'number',
    api: deptList,
  },
  deptTree: {
    label: "部门树",
    dataType: DataType.array,
    dataModel:'sysDept',
    api: deptList,
    match:{//数据转换，匹配一直的prop属性
      ID_ITreeData:{
        label:"选项值为主键",
        dataType: DataType.array,
        dataModel:"ITreeData",
        func:(datas:SysDept[]):ITreeData[]=>{
           return  itree2TreeData(datas);
        } 
      },
      CODE_ITreeData:{
        label:"选项值为code",
        dataType: DataType.array,
        dataModel:"ITreeData",
        func:(datas:SysDept[]):ITreeData[]=>{
           return  itree2TreeData(datas,"code");
        } 
      }
    },
  },

  menuTree: {
      label: "菜单树",
      api: menuList,
      dataType: DataType.array,
      dataModel:'sysMenu',
      match:{
        ISelect:{
        label:"下拉菜单数据结构",
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
    }
  },
  formListAll: {
    label: "所有实体数据集",
    dataType:DataType.array,
    dataModel:"FormVo",
    api: entityModels,
    params: {
      appId: { 
        must: false, 
        label: "应用id", 
        dataModel:DataModel.string,
        remark:"应用id就是类型为应用的菜单id",
        fromField:{entity:"sysMenu",field:"id"} //自动去匹配该字段
        // options:(formVo:FormVo)=>{
        //   return  formVo.fields.map((f)=>{return {label:f.title,value:f.fieldName}})
        // } 
      },
    },
    match:{
      id:{
        dataType:DataType.array,
        dataModel:"ISelect",
        label:"选项值是数据集ID",
        func:(datas:{id:string,title:string}[]):ISelect[]=>{
          return datas.map((data:{id:string,title:string})=>{return {value:data.id,label:data.title}});
       }},
       type:{
        label:"选项值是数据集类型",
        dataType:DataType.array,
        dataModel:"ISelect",
        func:(datas:{type:string,title:string}[]):ISelect[]=>{
          return datas.map((data:{type:string,title:string})=>{return {value:data.type,label:data.title}});
       }},
       resources:{
        label:"多级选择",
        dataType:DataType.array,
        dataModel:"ITreeData",
        func:(datas:FormVo[],params:any):ITreeData[]=>{
          return datas.map((data:FormVo)=>{
            return {key:data.id,value:data.id,label:data.title,
              //过滤出未关联的资源和已和appId关联的资源
              children:data.resources?.filter(r=>r.sysMenuId===undefined||r.sysMenuId===null||r.sysMenuId===params.appId).map(r=>{return {key:r.id,value:r.id,label:r.name}})}
       })}
      }
    }
  },
  subForms: {
    label: "当前表的子数据集",
    dataType:DataType.array,
    dataModel:"FormVo",
    api: subForms,
    params: {
      id: { 
        must:true,
        label: "模型id", 
        dataModel:DataModel.string,
        fromField:{entity:"form",field:"id"} //数据来自同表单的对应到实体form的id字段
      },
    },
  },
  formVo: {
    label: "单个数据集",
    dataType:DataType.object,
    dataModel:"FormVo",
    api: detailFormVo,
    params: {
      formId: { 
        must:true,
        label: "模型id", 
        dataModel:DataModel.string,
        fromField:{entity:"form",field:"id"} //数据来自同表单的对应到实体form的id字段
      },
    },
  },

  formFields: {
    label: "字段",
    dataType:DataType.array,// dataType.fieldName_title_list,
    dataModel:"FormField",
    api: formFieldListAll,
    params: {
      formId:{
        label:"模型id",
        must:true,
        dataModel:DataModel.string,
        fromField:{entity:"form",field:"id"}//入参来源是这个字段的值
        // options:(formVo:FormVo):selectObj[]=>{
        //   // alert(JSON.stringify(formVo.parentForm).length)]
        //   const form=formVo
        //   return form.fields.filter(f=>f.pathName==='formId').map((f)=>{
        //     return {label:f.title,value:f.fieldName}
        //   })
        // }
      }
    },
    match:{
      ISelectr_ID:{
        dataType:DataType.array,
        dataModel:"ISelect",
        label:"ID作为选项值",
        func:(datas:{id:string,title:string}[]):ISelect[]=>{
            return datas.map((data:{id:string,title:string})=>{return {value:data.id,label:data.title}});
         }
        },
      ISelectr_TYPE:{
        label:"字段名作为选项值",
        dataType:DataType.array,
        dataModel:"ISelect",
        func:(datas:{fieldName:string,title:string}[]):ISelect[]=>{
          return datas.map((data:{fieldName:string,title:string})=>{return {value:data.fieldName,label:data.title}});
         }
        }
      }
  },

  allRoute:{
    label:"路由列表",
    dataType: DataType.array,
    dataModel:'ISelect',
    api:()=>{
      return new Promise((resolve) => {
        resolve({ code: "200", msg: "success", data: allRouter() });
      });
    }
  },
  //demo
  projectPage: {
    label: "公司客户",
    dataType: DataType.array,
    dataModel:"DemoProject",
    api: list,
    match:{
      ISelect:{
        label:"客户选择项",
        dataType:DataType.array,
        dataModel:"ISelect",
        func:(datas:{id:string,name:string}[]):ISelect[]=>{
          const selectOptions= datas.map((data:{id:string,name:string})=>{return {value:data.id,label:data.name}});
          return selectOptions
      }}
    }
  },
}
