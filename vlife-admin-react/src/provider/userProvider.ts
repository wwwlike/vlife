/**
 * 用户管理远程数据接口
 */
import { useRequest } from "ahooks";
import apiClient from "@src/utils/apiClient";
import { Result } from "@src/types/vlife";
import {
  AuthForm,
  User,
  userDetailVo,
  UserPageReq,
  UserVo,
} from "@src/types/user";
import { Options } from "ahooks/lib/useRequest/src/types";

/**
 * 当前用户
 */
export const useCurrUser = (
  options: Options<Result<userDetailVo>, any> = { manual: true }
) =>
  useRequest((): Promise<Result<userDetailVo>> => {
    return apiClient.get(`/sysUser/currUser`);
  }, options);

/**
 * 用户登录
 */
export const useLogin = (
  options: Options<Result<string>, any> = { manual: true }
) =>
  useRequest((params: AuthForm): Promise<Result<string>> => {
    return apiClient.post(`/login`, params);
  }, options);

/**
 * 用户保存
 */
export const useSaveUser = (
  options: Options<Result<User>, any> = { manual: true }
) =>
  useRequest((params: Partial<User>): Promise<Result<User>> => {
    return apiClient.post(`/sysUser/save`, params);
  }, options);

/**
 * 用户保存
 */
export const useSaveUser1 = (
  options: Options<Result<User>, any> = { manual: true }
) => {
  const res = useRequest((params: Partial<User>): Promise<Result<User>> => {
    return apiClient.post(`/sysUser/save`, params);
  }, options);
  return { ...res, saveUser: res.run, saveUserAsync: res.runAsync };
};

/**
 * 用户分页列表
 */
export const usePageUser = (
  options: Options<Result<UserVo[]>, any> = { manual: true }
) =>
  useRequest((params: Partial<UserPageReq>): Promise<Result<UserVo[]>> => {
    return apiClient.get(`/sysUser/page`, { params: params });
  }, options);

/**
 * 用户详情
 */
export const useDetailUser = (
  options: Options<Result<userDetailVo>, any> = { manual: true }
) =>
  useRequest((id: string): Promise<Result<userDetailVo>> => {
    return apiClient.get(`/sysUser/detail/{id}`);
  }, options);

/**
 * 列表详情
 */
export const useColumnUser = (
  options: Options<Result<any>, any> = { manual: true }
) =>
  useRequest((voName: string): Promise<Result<any>> => {
    return apiClient.get(`/sysUser/tableInfo/${voName}`);
  }, options);
