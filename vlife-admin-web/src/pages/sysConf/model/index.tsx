import { Button, Tooltip } from "@douyinfe/semi-ui";
import { useAuth } from "@src/context/auth-context";
import { Form, list } from "@src/api/Form";
import { useNiceModal } from "@src/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconCode } from "@douyinfe/semi-icons";
import Scrollbars from "react-custom-scrollbars";
import { listAll, SysMenu } from "@src/api/SysMenu";

/**
   ## 模型管理
   ### 模型介绍
    > 涉及到实体模型entity,视图模型vo,传输模型dto,查询模型req相关的所有与页面显示层有关的设置都放在里面。
    - entity支持成为vo,dto,req
    - dto 传输模型，可以作为vo
    - vo  视图层，可以作为列表
    - req 查询条件 

  ###
  .模型列表(tab页签)
    -   启用的模型
      启用后模型可以按照业务分类
    1.1 未启用模型 （启用）
    1.2 外键表，关联表查看
    1.3 模型代码生成
 
    1.4 模型设置
    1.5.1 表单设置
    1.5.2 相应设置
 */
const Model = () => {
  const [menus, setMenus] = useState<SysMenu[]>();
  const [dbEntitys, setDbEntitys] = useState<Form[]>();
  const navigate = useNavigate();
  useEffect(() => {
    list({ itemType: "entity" }).then((d) => {
      if (d.data) {
        setDbEntitys(d.data);
      } else {
        setDbEntitys([]);
      }
    });

    listAll().then((t) => {
      setMenus(t.data);
    });
  }, []);

  const card = useCallback((e: Form, index: number) => {
    return (
      <div className=" group relative block w-full h-24 border-2 border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <Tooltip content="前端代码">
          <Button
            size="small"
            className=" rounder-br-lg absolute bottom-0 right-0"
            onClick={() => {
              navigate("/sysConf/modelCode/" + e.type);
            }}
            icon={<IconCode />}
          />
        </Tooltip>
        <span className="mt-2 block text-sm font-medium text-gray-900">
          {e.title}
        </span>
        <p>{e.type}</p>

        <div className=" hidden absolute group-hover:block justify-center  bottom-1 space-x-2">
          <Button
            size="small"
            className=" text-sm"
            onClick={() => {
              navigate("/sysConf/modelDetail/entity/" + e.type);
            }}
          >
            模型管理
          </Button>
        </div>
      </div>
    );
  }, []);

  return (
    <Scrollbars autoHide={true}>
      <div className="flex-1 flex items-stretch overflow-hidden bg-white rounded-md ">
        <main className="flex-1 overflow-y-auto">
          {/* max-w-7xl */}
          <div className="pt-2  mx-auto px-2 ">
            {menus &&
              menus
                .filter((m) => m.pcode === null)
                .filter((m) => {
                  return (
                    menus.filter((k) => k.pcode === m.code && k.entityType)
                      .length > 0
                  );
                })
                .map((d, index) => (
                  <div key={"model_" + index} className="">
                    <div className="hidden sm:block">
                      <div className="flex items-center border-b border-gray-200">
                        <a
                          href="#"
                          aria-current="page"
                          className={`border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                          {d.name}
                        </a>
                      </div>
                      <div>
                        <ul
                          role="list"
                          className="grid  p-2 gap-4 grid-cols-10"
                        >
                          {dbEntitys
                            ?.filter((db) =>
                              menus
                                .filter((m) => m.pcode === d.code)
                                .map((mm) => mm.entityType)
                                .includes(db.type)
                            )
                            .map((e, index) => (
                              <li
                                key={e.type + index}
                                className="relative"
                                onDoubleClick={() => {
                                  navigate("/sysConf/modelDetail/" + e.type);
                                }}
                              >
                                {card(e, index)}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

            <div key={"model_other"} className="">
              <div className="hidden sm:block">
                <div className="flex items-center border-b border-gray-200">
                  <a
                    href="#"
                    aria-current="page"
                    className={`border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {"其他模块"}
                  </a>
                </div>
                <div>
                  <ul role="list" className="grid  p-2 gap-4 grid-cols-10">
                    {menus &&
                      dbEntitys
                        ?.filter(
                          (db) =>
                            !menus.map((mm) => mm.entityType).includes(db.type)
                        )
                        .map((e, index) => (
                          <li
                            key={e.type + index}
                            className="relative"
                            onDoubleClick={() => {
                              navigate("/sysConf/modelDetail/" + e.type);
                            }}
                          >
                            {card(e, index)}
                          </li>
                        ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Scrollbars>
  );
};

export default Model;
