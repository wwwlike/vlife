export interface MenuItem {
  itemKey: string;
  text: string;
  code?: string;
  // icon?: React.ReactNode;
  icon?: any;
  path?: string;
  items?: MenuItem[];
  component?: React.ComponentType<any>;
}