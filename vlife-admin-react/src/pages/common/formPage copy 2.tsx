import { IconAlertCircle } from '@douyinfe/semi-icons';
import VlifeForm, { FormProps } from '@src/components/form';
import SearchForm from '@src/components/form/queryForm';
import { useAuth } from '@src/context/auth-context';
import { getFkInfo, useDetails, useModelInfo } from '@src/provider/baseProvider';
import { fieldInfo, ModelInfo, TranDict } from '@src/types/vlife';
import { rejects } from 'assert';

import React, { useCallback, useEffect,useMemo,useRef,useState } from 'react';



/**
 * 入参：
 * formData=> 表单初始化数据
 * 
 * 内部逻辑
 * 请求表单模型->提取字典模型
 * formData+表单模型->请求外键信息
 *   
 * 
 *  
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
  const [fkMap,setFkMap]=useState<any>({});
  const {run,data:modelInfo}=useModelInfo({entityName});
  const fkInfoFun=getFkInfo;


  /**
   * 模型里的字典数组
   */
   const modelDicts=useMemo(():string[]=>{
    let allFieldCodes=modelInfo?.data?.fields.map(f=>{
      return  f.dictCode
    })||[];
    const distCodes:string[]=[];
    allFieldCodes.forEach(s=>{
      if(s)
        distCodes.push(s);
    })
   return distCodes;
  },[modelInfo])

  /**
   * 外键字段信息
   * 字段：字段请求模块
   */
  const fkInfos=useMemo(():{dataIndex:string,entityName:string}[]=>{
    if(!props.formData){ //没有数据则不用提炼
      return [];
    }
    const fkFields= modelInfo?.data?.fields.filter(f=>{
      return  (f.dataIndex!=='id'&&
      f.entityType!==modelInfo.data?.entityType&&
      (f.pathName.endsWith('Id')||f.pathName.endsWith('_id')))
     })||[]
     // filedINfo 转换成 dataIndex，enetityName数据机构数据
     return fkFields.map(f=>{
      var delimited = f.pathName.split('_');
          var query_field_entityName=delimited[delimited.length-1];
          if(query_field_entityName==='id'){
            query_field_entityName=delimited[delimited.length-2];
          }else if(query_field_entityName.endsWith('Id')){
            query_field_entityName =query_field_entityName.substring(0,query_field_entityName.length-2);
          }
        return {dataIndex:f.dataIndex,entityName:query_field_entityName
      }
     })
  },[modelInfo,props.formData])

  function printName(name:string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(name)
        }, 2000)
    } )
  }
  /**
   * 表单及字典数据配置信息获取
   */
  useEffect(()=>{
    //step1 从数据库里取表单模型信息,判断表单是否是外键，外键是否有值
    run(modelName||entityName);
  },[])

  useEffect(()=>{
        //step2 找到字段里有字典的数据，并从全局context里得到本次需要的字典数据
        fkInfos.forEach( f=>{
        if(props.formData[f.dataIndex]){
          fkInfoFun(f.entityName,props.formData[f.dataIndex]).then(data=>{
            data.data?.forEach(e=>{
              fkMap[e.id]=e.name
              setFkMap({...fkMap})      
            })
          })
        }
        })
    },[fkInfos])

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
      <VlifeForm 
          modelInfo={modelInfo.data}
          dicts={getDict(...modelDicts)}
          fkMap={fkMap}
          maxColumns={maxColumns}
          {...props}
        ></VlifeForm>
        </>
    )
  }else{
    return (
      <>
      <SearchForm 
          entityName={entityName}
          modelInfo={modelInfo.data}
          dicts={getDict(...modelDicts)}
          fkMap={{...fkMap}}
          maxColumns={maxColumns}
          {...props}
        ></SearchForm> 
        </>
    )
  }
}
export default FormPage;