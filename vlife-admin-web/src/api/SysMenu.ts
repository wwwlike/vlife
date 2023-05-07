
import { allRoute } from '@src/router';
import apiClient from '@src/api/base/apiClient'
import {DbEntity,Result} from '@src/api/base'
import { SysResources } from '@src/api/SysResources';
// 菜单
export interface SysMenu extends DbEntity{
  code: string;  // 编码
  pcode: string;  // 上级菜单编码
  name: string;  // 菜单名称
  icon: string;  // 图标
  url: string;  // 路由地址
  entityType:string;//对应模型
  placeholderUrl:string;//替换通配符
  app:boolean;//是否作为APP
}

/**
 * 菜单资源vo
 */
export interface MenuVo extends DbEntity{
  code: string;  // 编码
  pcode: string;  // 上级菜单编码
  name: string;  // 菜单名称
  icon: string;  // 图标
  url: string;  // 路由地址
  entityType:string;//对应模型
  sysResourcesList:SysResources[];//接口数据
}
/** 
   * 保存菜单;
   * @param dto 菜单;
   * @return 菜单;
   */
export const save=(dto: SysMenu): Promise<Result<SysMenu>>=>{
  return apiClient.post(`/sysMenu/save`  ,dto  );
};
/** 
   * 明细查询菜单;
   * @param id ;
   * @return 菜单;
   */
export const detail=(id: string): Promise<Result<SysMenu>>=>{
  return apiClient.get(`/sysMenu/detail/${id}`  );
};
/** 
   * 所有菜单
   * @param id ;
   * @return 菜单;
   */
export const listAll=(): Promise<Result<SysMenu[]>>=>{
  return apiClient.get(`/sysMenu/list/all`);
};
/** 
   * 逻辑删除;
   * @param id ;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/sysMenu/remove/${id}`  );
};

/**
 * 角色资源接口 
 */
export const roleResources=(req:{sysRoleId:string}): Promise<Result<MenuVo>>=>{
  return apiClient.get(`/sysMenu/list/roleResources`,{params:req}  );
};

// 自己添加
export const allRouter=():{label:string,value:string}[]=>{
  const all:{label:string,value:string}[]=[]
  const child=(path:string|null,route:any, all:{label:string,value:string}[])=>{
    const thisPath=path===null?route.path:(path.endsWith("/")?path+route.path:path+"/"+route.path);
      all.push({label:`${thisPath} ${route.element.props.titleId?route.element.props.titleId:""}`,value:thisPath})
      if(route.children){
        route.children.forEach((c:any)=>{
          child(thisPath,c,all)
        })
      }
  }
   allRoute.forEach(r=>{
    child(null,r,all);
   })
   return all;
}