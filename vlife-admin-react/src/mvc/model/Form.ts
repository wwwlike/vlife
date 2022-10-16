import apiClient from '../apiClient'
import { DbEntity, Result, SaveBean, VoBean } from '../base'
import { FormField, FormFieldVo } from './FormField'

export interface Form extends DbEntity {
  title: string
  type: string
  itemType: string
  entityType: string
  gridSpan: number
  name: string
}

export interface FormDto extends SaveBean {
  title?: string
  type?: string
  itemType?: string
  entityType?: string
  gridSpan?: number
  name?: string
  fields?: Partial<FormField>[]
}

export interface FormVo extends VoBean {
  title: string
  type: string
  itemType: string
  entityType: string
  gridSpan: number
  name: string
  fields: FormFieldVo[]
}

/**
 * 未编辑的模型信息
 */
export const models = (uiType: string): Promise<Result<FormVo[]>> => {
  return apiClient.get(`/form/models/${uiType}`)
}

/**
 * 未编辑的模型信息
 */
export const model = (params: {
  uiType: string
  modelName: string
}): Promise<Result<FormVo>> => {
  return apiClient.get(`/form/model/`, { params })
}

/**
 * 已发布的模型(编辑)
 * @returns
 */
export const published = (): Promise<Result<FormVo[]>> => {
  return apiClient.get(`/form/published`)
}

/**
 * 表单保存
 */
export const saveFormDto = (dto: Partial<FormDto>): Promise<Result<FormVo>> => {
  return apiClient.post(`/form/save/formDto`, dto)
}
