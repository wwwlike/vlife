import { Result } from '@src/api/base';
import apiClient from '@src/api/base/apiClient';
import { SysResources } from '@src/api/SysResources';

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