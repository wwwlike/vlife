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
    } else if (
      api &&
      api.methedType.includes("@DeleteMapping") &&
      api.paramWrapper === "String[]"
    ) {
      // export const remove=(ids:String[]): Promise<Result<number>>=>{
      //   return apiClient.delete(`/sysUser/remove`,{data:ids});
      //   };
      return (data: any[]) =>
        apiClient.delete(api.url, { data: data.map((d) => d.id) });
    }
    return undefined;

}