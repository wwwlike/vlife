import { IconAlertCircle } from '@douyinfe/semi-icons';
import VlifeForm, { FormProps } from '@src/components/form';
import SearchForm from '@src/components/form/queryForm';
import { useAuth } from '@src/context/auth-context';
import { useDetails, useModelInfo } from '@src/provider/baseProvider';
import { fieldInfo, ModelInfo, TranDict } from '@src/types/vlife';
import qs from 'qs';
import React, { useEffect,useState } from 'react';


/**
 * 表单编辑通用页面
 * 1. 表单数据提取
 * 2. 字典数据提取
 * 3. 外键数据提取
 * 4. 数据透传
 */
export interface FormPageProps extends Omit<FormProps,'dicts'|'modelInfo'>{
  entityName:string,// 实体模型名称
  modelName?:string,// 查询条件，保存对象的名称,不传就是entityName
  type:'queryForm'|'dataForm',// 查询表单/数据表单

}
const FormPage=({entityName,modelName,type='dataForm',maxColumns=[2,2,2],...props}:FormPageProps)=>{
  const {getDict} =useAuth(); //context里的字典信息
  const [dicts,setDicts]=useState<TranDict[]>([]);//定义字典状态
  const [fkMap,setFkMap]=useState<any>({});
  const [modelInfo,setModelInfo]=useState<ModelInfo>();
  const {run,data}=useModelInfo({entityName});
  const {runAsync:views}=useDetails({entityName});
 
 
  /**
   * 表单及字典数据配置信息获取
   */
  useEffect(()=>{
    //step1 从数据库里取表单模型信息,判断表单是否是外键，外键是否有值
    run(modelName||entityName);
  },[entityName,modelName])

  useEffect(()=>{
      if(data?.data){
        setModelInfo(data.data);
        //step2 找到字段里有字典的数据，并从全局context里得到本次需要的字典数据
        let allFieldCodes:(string|undefined)[]=  data.data.fields.map(f=>{
          return  f.dictCode
        });
        const distCodes:string[]=[];
        allFieldCodes.forEach(s=>{
          if(s)
            distCodes.push(s);
        })
       setDicts(getDict(...distCodes))

       if(props.formData){
        //过滤出外键字段
        const fkFields:fieldInfo[]=data.data.fields.filter(f=>{
         return  (f.dataIndex!=='id'&&
         f.entityType!==data.data?.entityType&&
         (f.pathName.endsWith('Id')||f.pathName.endsWith('_id')))
        })
        fkFields.forEach(f=>{
        if(props.formData[f.dataIndex]){
          // 关联关系数据获取通过pathName获取，解决多对多时在一对多表里找不到id数据的问题
          var delimited = f.pathName.split('_');
          var query_field_entityName=delimited[delimited.length-1];
          if(query_field_entityName==='id'){
            query_field_entityName=delimited[delimited.length-2];
          }else if(query_field_entityName.endsWith('Id')){
            query_field_entityName =query_field_entityName.substring(0,query_field_entityName.length-2);
          }

          views(query_field_entityName,query_field_entityName,props.formData[f.dataIndex]).then(data=>{
            data.data?.forEach(e=>{
              fkMap[e.id]=e.name  
              return fkMap    
            })
          }).then((data)=>{
            setFkMap(fkMap)
          })
        }
        })
       }
      }
    },[data,entityName])

  if(!modelInfo){
    return (<>
        <div>{modelName}模型在后端应用中不存在，请按照规范进行配置</div>
        规范：列表查询模型的命名,应该以模型名称开头，pageReq结尾
      </>
      )
  }
  else if(type==='dataForm'){
    return (
      <> 
      {/* {JSON.stringify(fkMap)}  */}
      <VlifeForm 
          modelInfo={modelInfo}
          dicts={dicts}
          fkMap={{...fkMap}}
          maxColumns={maxColumns}
          {...props}
        ></VlifeForm>
        </>
    )
  }else{
    return (
      <>
       {/* {JSON.stringify(fkMap)}  */}
      <SearchForm 
          modelInfo={modelInfo}
          dicts={dicts}
          fkMap={{...fkMap}}
          maxColumns={maxColumns}
          {...props}
        ></SearchForm> 
        </>
    )
  }
}
export default FormPage;