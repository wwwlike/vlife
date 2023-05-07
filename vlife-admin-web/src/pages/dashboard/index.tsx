/**
 * 桌面
 */

import { Avatar, Card } from "@douyinfe/semi-ui";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta";
import { SysMenu, listAll } from "@src/api/SysMenu";

import { useEffect, useState } from "react";

export default () => {
  const [apps, setApps] = useState<SysMenu[]>([]);
  useEffect(() => {
    listAll().then((datas) => {
      setApps(datas.data?.filter((d) => d.app) || []);
    });
  }, []);

  const minCard = (menu: SysMenu) => {
    return (
      <Card key={menu.code} style={{ maxWidth: 360 }}>
        <Meta
          title={menu.name}
          description={menu.name}
          avatar={
            <Avatar
              size="default"
              src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
            />
          }
        />
      </Card>
    );
  };

  return (
    <Card title="应用">
      <div className=" flex space-x-8">
        {apps.map((menu, index) => {
          return minCard(menu);
        })}
      </div>
    </Card>
  );
};
