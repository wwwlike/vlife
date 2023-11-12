import { Button } from "@douyinfe/semi-ui";
import { FormVo, list } from "@src/api/Form";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconClose } from "@douyinfe/semi-icons";

/**
 * 单模块的模型展示
 */
export default () => {
  const local = useLocation();
  const navigate = useNavigate();
  const entityType = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, []);

  //数据库保存的模型信息
  const [dbEntitys, setDbEntitys] = useState<FormVo[]>();

  const ItemTypeInfo: {
    [key: string]: { itemType: string[]; label: string };
  } = {
    formDesign: { itemType: ["entity", "vo", "save"], label: "表单" },
    tableDesign: {
      itemType: ["entity", "vo"],
      label: "列表",
    },
    filter: { itemType: ["req"], label: "查询条件" },
  };

  useEffect(() => {
    if (entityType) {
      list({ entityType }).then((d) => {
        if (d.data) {
          setDbEntitys(d.data);
        } else {
          setDbEntitys([]);
        }
      });
    }
  }, [entityType]);

  return (
    <div className="items-stretch overflow-hidden bg-white rounded-md ">
      {/*justify-end 要配合 flex  */}
      <div className=" absolute right-2 top-2">
        <Button
          type="primary"
          icon={<IconClose />}
          onClick={() => {
            navigate(-1);
          }}
          aria-label="关闭"
        />
      </div>
      {/* Entity 实体模型 */}
      {Object.keys(ItemTypeInfo).map((key) => {
        return (
          <div key={`entity_item_type${key}`} className="mt-6  mx-auto px-2 ">
            <div className="mt-3 sm:mt-2">
              <div className="hidden sm:block">
                <div className="flex items-center border-b border-gray-200">
                  <a
                    href="#"
                    aria-current="page"
                    className={`border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {ItemTypeInfo[key].label}
                  </a>
                </div>
                <div>
                  <ul role="list" className="grid  p-2 gap-4 grid-cols-10">
                    {dbEntitys
                      ?.filter((db) =>
                        ItemTypeInfo[key].itemType.includes(db.itemType)
                      )
                      .map((model, index) => (
                        <li
                          className="relative"
                          key={"li_" + model.type}
                          onClick={() => {
                            navigate(`/sysConf/${key}/${model.type}`);
                          }}
                        >
                          <div className="group relative cursor-pointer block w-full h-24 border-2 border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {model.title}
                            </span>
                            <p>{model.type}</p>
                            <div className=" hidden absolute group-hover:block justify-center  bottom-1 space-x-2">
                              <Button
                                size="small"
                                className=" text-sm"
                                onClick={() => {
                                  navigate(`/sysConf/${key}/${model.type}`);
                                }}
                              >
                                模型管理
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
