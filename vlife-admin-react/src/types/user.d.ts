import { IdBean, Pager } from "./vlife";

// interface userModel{
//   page:{listModal:string,queryModal:string}[]
//   edit:{saveModal:string}[]

// }

interface userDetailVo {
  id: string;
  username: string; //账号
  name: string; //姓名
  groupName: string; //角色组名称
  resourceCodes: string[]; //角色组能够访问的资源代码
  menus: string[]; //角色组能够访问的菜单菜单code
}

interface AuthForm {
  username?: string;
  password?: string;
}

interface UserVo {
  name: string;
  username: string;
  groupName: string; //角色名称
  idno: string;
  tel: string;
  usetype: string; //启用状态，字典
  state: string; //启用状态，字典
}
interface UserPageReq extends Pager {
  search: string;
  sysGroupId: string;
}

interface User extends IdBean {
  name: string;
  username: string;
  idno: string;
  tel: string;
  usetype: string; //启用状态，字典
  state: string; //启用状态，字典
  sysGroupId: string;
}
