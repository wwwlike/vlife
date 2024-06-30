
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 系统变量
export interface SysVar extends DbEntity{
  varKey: string;  // 变量名
  val: string;  // 系统值
  remark: string;  // 变量说明
  sort: number;  // 排序
  type: string;  // 变量类型(图片,字符串，数字，布尔，枚举，日期)
  sysVar: boolean;  // 是否系统变量
  groupType: string;  // 分组
  name: string;  // 名称
}
/** 查询*/
export const page=(req:PageQuery): Promise<Result<PageVo<SysVar>>>=>{
  return apiClient.post(`/sysVar/page`,req);
};

/** 查询*/
export const list=(req:PageQuery): Promise<Result<SysVar[]>>=>{
  return apiClient.post(`/sysVar/list`,req);
};

/** 查询*/
export const varObj=(req:PageQuery): Promise<any>=>{
  return apiClient.post(`/sysVar/list`,req).then(d=>{
    return d.data?.reduce(
      (acc: { [key: string]: any }, curr: SysVar) => {
        acc[curr.varKey] = curr.val;
        return acc;
      },
      {}
    );
  });
};


/** 保存*/
export const save=(dto:SysVar): Promise<Result<SysVar>>=>{
  return apiClient.post(`/sysVar/save`,dto);
};


/** 设置保存*/
export const saveVals=(dto:SysVar[]): Promise<Result<SysVar[]>>=>{
  return apiClient.post(`/sysVar/save/vals`,dto);
};

/** 删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/sysVar/remove`,{data:ids});
};

// const a={abcd:["a","2"],date:['start','end']}
// page(})