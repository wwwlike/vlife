import { Result } from '@src/api/base';
import apiClient from '@src/api/base/apiClient';
import { ButtonVo } from '@src/api/Button';
import { SysResources } from '@src/api/SysResources';
import { usableDatasMatch } from '@src/components/queryBuilder/funs';
import { VF, VfAction } from '@src/dsl/VF';
import { VFBtn } from '../types';

// 根据接口返回接口对应的调用方法
export const _saveFunc=(api:SysResources):((data: any) => Promise<Result<any>>)|undefined=>{
    if (
      api.paramType === "req" ||
      api.paramType === "dto" ||
      api.paramType === "entity"
    ) {
      return (data: any) => apiClient.post(api.url, data);
    } else if (api!==undefined) {
      if(api.paramWrapper === "String[]"||api.paramWrapper ==="List<String>"){
        if( api.methedType.includes("@DeleteMapping")){
          return (data: any[]) =>apiClient.delete(api.url, { data: data.map((d) => d.id) });
        } else{
          return (data: any[]) => apiClient.post(api.url, data.map((d) => d.id));
        }
      }else if(api.paramWrapper === "String"){
        if( api.methedType.includes("@DeleteMapping")){
          return (data: any) =>apiClient.delete(api.url, { data: data.id });
        } else{
          return (data: any) => apiClient.post(api.url, data.id,{  
            headers: {  
                'Content-Type': 'text/plain' // 设置请求体类型为纯文本  
            }  
        });
        }
      }
    }
    return undefined;
}

//查找按钮绑定资源对应的模型type
export const findModelByResourcesId = (
  allResources: { [key: string]: SysResources },
  sysResourcesId: string
): string | undefined => {
  const _resources = allResources[sysResourcesId];
  const _model =
    _resources?.paramType === "entity" || _resources?.paramType === "dto"
      ? _resources.paramWrapper
      : undefined;
  return _model;
};


//数据库按钮信息转换为组件按钮信息
export const buttonToVfBtn =(resources:{[key:string]:SysResources},b:any):VFBtn=>{
  const _model = findModelByResourcesId(resources, b.sysResourcesId);
  const _resources = resources[b.sysResourcesId];
  if(!_resources){
    throw new Error("按钮绑定的资源不存在")
  }
  const _multiple =
    _resources?.paramWrapper?.includes("List") ||
    _resources?.paramWrapper?.includes("[]");
  const _usableMatch = (_data: any) => {
    return b.conditionJson
      ? usableDatasMatch(JSON.parse(b.conditionJson), _data)
      : true;
  };
  const _actionType = _model ? "save" : "api";
  const _title =
    b.title ||
    (_actionType === "api"
      ? _resources?.methedType?.startsWith("@DeleteMapping(")
        ? "删除"
        : _resources.name
      : "savecreate".includes(_actionType)
      ? b.position === "tableLine"
        ? "修改"
        : "新增"
      : "");
      const _dbVF: VfAction[] = [];
      if (b?.rules) {
        b.rules?.forEach((r:any) => {
          r?.vf?.forEach((_vf:any) => {
            const executeScript = new Function("VF", `return ${_vf}`);
            const vf:VF=executeScript(VF);
            // vf.getActions();
            _dbVF.push(...vf.getActions());
          });
        });
      }
      return {
        ...b,
        sysMenuId:b.sysMenuId,
        id:b.id,
        sysResourcesId:b.sysResourcesId,
        position: b.position,
        formVoJson:b.formVoJson,
        reaction:_dbVF,
        activeTabKey:(b?.activeTabKey ? b.activeTabKey.split(","):undefined),
        disabledHide: b.disabledHide,
        submitConfirm: b.submitConfirm,
        permissionCode: _resources?.code,
        saveApi: _saveFunc(_resources),
        actionType: _actionType,
        title: _title,
        model: _model,
        sort: b.sort,
        conditionJson:b.conditionJson,
        usableMatch: _usableMatch,
        multiple: _multiple,
      
      }
      

}

 