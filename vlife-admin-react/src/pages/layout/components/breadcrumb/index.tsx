import React, { ReactNode, useState } from "react";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { useLocation } from "react-router-dom";
import { MenuItem } from "../../types";

interface BreadcrumbItem {
  key: string;
  path?: string;
  title: string | ReactNode;
}

const { Item } = Breadcrumb;
let breadcrumbList: BreadcrumbItem[] = [];
let end = false;

// 根据pathname找出面包屑路径
const getBreadcrumbByPathName = (
  menuList: MenuItem[],
  pathname: string,
  breadcrumbs: BreadcrumbItem[] = []
) => {
  for (const menu of menuList) {
    const list: BreadcrumbItem[] = [];
    if (!end) {
      list.push({
        key: menu.itemKey,
        path: menu.path,
        title: menu.text,
      });
      if (menu.path == pathname) {
        breadcrumbList = breadcrumbs.concat(list);
        end = true;
        break;
      } else if (menu.items) {
        getBreadcrumbByPathName(menu.items, pathname, breadcrumbs.concat(list));
      }
    }
  }
};

const Index: React.FC = () => {
  const { pathname } = useLocation();
  const [_, setState] = useState(1);
  return (
    <Breadcrumb>
      {breadcrumbList.map((e) => {
        return <Item key={e.key}>{e.title}</Item>;
      })}
    </Breadcrumb>
  );
};

export default Index;
