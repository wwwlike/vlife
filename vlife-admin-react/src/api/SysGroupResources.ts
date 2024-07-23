import {DbEntity} from '@src/api/base' 
// 权限与资源关联 
export interface SysGroupResources extends DbEntity{   
  sysGroupId: string;   
  sysResourcesId: string; 
  sysMenuId:string;
}