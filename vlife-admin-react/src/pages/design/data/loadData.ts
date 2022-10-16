import { Result } from "@src/mvc/base";
import { roleAllResources } from "@src/mvc/SysResources";
import { listAll, listMenu } from "@src/mvc/SysResources";
import { listAll as orgList } from "@src/mvc/SysOrg";
import { listAll as deptList } from "@src/mvc/SysDept";
import { listAll as areaList } from "@src/mvc/SysArea";
import { listSysFilterVo } from "@src/mvc/SysGroup";
/**
 * 组件异步接口信息
 * formPage里调用接口取数据，网form/index组件里传值
 */
interface loadDatasProps {
  loadData: (params: any) => Promise<Result<any>>; //接口
  props?: any;
  // 接口入参配置信息（待补充）
}

// 实现可以赋值任意字段 key接口描述
const loadDatas: { [key: string]: loadDatasProps } = {
  roleAllResources: {
    loadData: roleAllResources,
  },
  resourcesApiAll: {
    loadData: listAll,
  },
  listMenu: {
    loadData: listMenu,
  },
  areaTree: {
    loadData: areaList,
    props: {
      valField: "code",
    },
  },
  orgTree: {
    loadData: orgList,
    props: {
      valField: "code",
    },
  },
  deptTree: {
    loadData: deptList,
    props: {
      valField: "code",
    },
  },
  deptSelect: {
    loadData: deptList,
  },
  orgSelect: {
    loadData: orgList,
  },
  areaSelect: {
    loadData: areaList,
  },
  sysFilterSelect: {
    loadData: listSysFilterVo,
    props: {
      valField: "id",
    },
  },
};

export default loadDatas;
