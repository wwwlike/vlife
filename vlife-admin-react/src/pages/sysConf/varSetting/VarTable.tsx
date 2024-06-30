import { SysVar } from "@src/api/SysVar";
import TablePage from "@src/pages/common/tablePage";

/**
 * 变量列表
 */
export default () => {
  return <TablePage<SysVar> listType="sysVar" />;
};
