import { Result } from './base';
import apiClient from './base/apiClient';

export const login=(params: {password:string,username:string}): Promise<Result<string>> => {
  return apiClient.post(`/login`, params);
}
