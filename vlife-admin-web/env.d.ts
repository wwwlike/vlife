interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string; //后台地址
  readonly VITE_APP_SAVE_REMOVE: boolean; //演示数据是否能删除
  readonly VITE_APP_PAGESIZE: number; //每页数量
  readonly VITE_APP_MODE:"pro"|"dev";//生产环境，开发环境
}
