import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import apiClient from "@src/components/func/apiClient";

export interface UserPageReq {
  search?: string;
  joinYear?: number;
}

export interface UserVo {
  id: string;
  name: string;
  tel?: string;
  joinYear?: number;
  idNumber?: string;
  unit_name?: string;
  areaName?: string;
}

export interface UnitDto {}

export interface Role {}

export interface UserDto {
  /**
   * id
   */
  id?: string;
  /**
   * 用户名称
   */
  username?: string;
  /**
   * 电话号码
   */
  tel?: string;
  idno?: string;
  roleId?: string[];
  roles?: Role[];
  unit?: UnitDto;
}

function getUsername(): Promise<string> {
  return apiClient.get(`/user/page`);
  // new Promise((resolve) => {
  //   setTimeout(() => {}, 1000);
  // });
}

// 将获取文章的 API 封装成一个远程资源 Hook
const useGetUserPager = (req: UserPageReq) => {
  // 设置三个状态分别存储 data, error, loading
  const { data, error, loading } = useRequest(getUsername);
  // console.log(data);

  // if (error) {
  //   console.log("error" + error);
  // }
  // if (loading) {
  //   console.log("loading" + loading);
  // }
  // if (!loading) {
  //   console.log("data" + data);
  // }

  // 将三个状态作为 Hook 的返回值
  return {
    loading,
    error,
    data,
  };
};

export { useGetUserPager };
