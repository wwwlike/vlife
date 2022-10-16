/**
 * 用户管理远程数据接口
 */
import { useRequest } from "ahooks";
import { Result } from "@src/mvc/base";
import { Options } from "ahooks/lib/useRequest/src/types";
import { currUser, UserDetailVo } from "@src/mvc/SysUser";
import apiClient from "@src/mvc/apiClient";

export interface AuthForm {
  username?: string;
  password?: string;
}
/**
 * 当前用户(封装)
 */
export const useCurrUser = (
  options: Options<Result<UserDetailVo>, any> = { manual: true }
) => useRequest(currUser, options);

/**
 * 用户登录
 */
export const useLogin = (
  options: Options<Result<string>, any> = { manual: true }
) =>
  useRequest((params: AuthForm): Promise<Result<string>> => {
    return apiClient.post(`/login`, params);
  }, options);
