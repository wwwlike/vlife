import { allRoute } from "@src/router";
import apiClient from "@src/api/base/apiClient";
import { DbEntity, Result, SaveBean } from "@src/api/base";
import { SysResources } from "@src/api/SysResources";
import { FormVo } from './Form';
// 菜单
export interface SysMenu extends DbEntity {
  code: string; // 编码
  pcode: string; // 上级菜单编码
  name: string; // 菜单名称
  icon: string; // 图标
  url: string; // 路由地址
  // entityType: string; //对应模型
  placeholderUrl: string; //替换通配符
  app: boolean; //是否作为APP
  sort: number; //排序号
  sysRoleId: string; //绑定的角色
  // plus
  confPage: boolean; //是否连接到配置页面
  pageLayoutId: string; //配置页面信息
  formId:string;
}

/**
 * 菜单资源vo
 */
export interface MenuVo extends DbEntity {
  app: boolean; //是否作为APP
  code: string; // 编码
  pcode: string; // 上级菜单编码
  name: string; // 菜单名称
  icon: string; // 图标
  url: string; // 路由地址
  // entityType: string; //对应模型
  sort: number; //排序号
  sysResourcesList: SysResources[]; //接口数据
  sysRoleId: string; //绑定的角色
  placeholderUrl:string;
  pageLayoutId: string; //配置页面信息
  formId:string;
  // plus
  confPage: boolean; //是否连接到配置页面
  // pageLayout:PageLayout;//配置页面信息
}

//菜单资源关联dto
export interface MenuResourcesDto extends SaveBean {
  sysResources_id:string[]
  formId:string,
  requiresIds:string[]
}

/**
 * 保存菜单;
 * @param dto 菜单;
 * @return 菜单;
 */
export const save = (dto: SysMenu): Promise<Result<SysMenu>> => {
  return apiClient.post(`/sysMenu/save`, dto);
};


/**
 * 菜单和资源关联保存;
 * @param dto 菜单和资源关联dto;
 */
 export const saveMenuResourcesDto = (dto: MenuResourcesDto): Promise<Result<MenuResourcesDto>> => {
  return apiClient.post(`/sysMenu/save/menuResourcesDto`, dto);
};

/**
 * 明细查询菜单;
 * @param id ;
 * @return 菜单;
 */
export const detail = (id: string): Promise<Result<SysMenu>> => {
  return apiClient.get(`/sysMenu/detail/${id}`);
};
/**
 * 所有菜单menuVo
 * @param id ;
 * @return 菜单;
 */
export const listAll = (): Promise<Result<MenuVo[]>> => {
  return apiClient.get(`/sysMenu/list/all`);
};
/**
 * 逻辑删除;
 * @param id ;
 * @return 已删除数量;
 */
export const remove = (ids: string[]): Promise<Result<number>> => {
  return apiClient.delete(`/sysMenu/remove`,{data:ids});
};

/**
 * 角色资源接口
 */
export const roleResources = (req: {
  sysRoleId: string;
}): Promise<Result<MenuVo>> => {
  return apiClient.get(`/sysMenu/list/roleResources`, { params: req });
};


/** 
* 获得指定app下的实体
* @param appId
* @return
*/
export const appFormVo=(appId: string): Promise<Result<FormVo[]>>=>{
  return apiClient.get(`/sysMenu/appFormVo/${appId}`  );
};

// 自己添加
export const allRouter = (): { label: string; value: string }[] => {
  const all: { label: string; value: string }[] = [];
  const child = (
    path: string | null,
    route: any,
    all: { label: string; value: string }[]
  ) => {
    const thisPath =
      path === null
        ? route.path
        : path.endsWith("/")
        ? path + route.path
        : path + "/" + route.path;
    all.push({
      label: `${thisPath} ${
        route.element.props.titleId ? route.element.props.titleId : ""
      }`,
      value: thisPath,
    });
    if (route.children) {
      route.children.forEach((c: any) => {
        child(thisPath, c, all);
      });
    }
  };
  allRoute.forEach((r) => {
    child(null, r, all);
  });
  return all;
};

/** 
* 菜单关联资源详情
* 有保存接口，则一定有查看明细接口
* @return
*/
export const detailMenuResourcesDto=(req:{id: string}): Promise<Result<MenuResourcesDto>>=>{
  return apiClient.get(`/sysMenu/detail/menuResourcesDto/${req.id}`  );
};