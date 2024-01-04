import { Result } from '../base';
import apiClient from '../base/apiClient';
import { ThirdAccountDto } from '../SysUser';

/**
 * 单个用户信息视图
 * @param id
 * @return
 */
 export const gitToken = (code: string,from:string): Promise<Result<ThirdAccountDto>> => {
  return apiClient.get(`/git/token/${from}?code=${code}`);
};


/**
 * gitee访问入口地址
 * @return
 */
 export const giteeUrl = (): Promise<Result<string>> => {
  return apiClient.get(`/git/giteeUrl`);
};

/**
 * 邮箱校验
 * @return
 */
 export const openCheckCode = (): Promise<Result<boolean>> => {
  return apiClient.get(`/git/openCheckCode`);
};