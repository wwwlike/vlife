import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  itemKey: string;
  text: string|ReactNode;
  code?: string;
  // icon?: React.ReactNode;
  icon?: any;
  path?: string;
  items?: MenuItem[];
  component?: React.ComponentType<any>;
}