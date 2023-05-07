/**
 * 聚合数据设计器
 */

import { Select } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";

export interface groupPorps {
  /** 数据值 */
  data: any;
  /** 表单数据 */
  form: FormVo;
  onDataChange: (data: any) => void;
}

export default ({ ...props }: groupPorps) => {
  return (
    <>
      <Select
        placeholder="统计项字段"
        style={{ width: "130px" }}
        onChange={(data) => {}}
      />
      <Select
        placeholder="聚合方式"
        style={{ width: "130px" }}
        onChange={(data) => {}}
      />
      <Select
        placeholder="分组字段(多选，可以无)"
        style={{ width: "130px" }}
        onChange={(data) => {}}
      />
    </>
  );
};
