import React, { useMemo, useState } from "react";
import { IdBean } from "@src/api/base";
import FormPage from "@src/pages/common/formPage";
import { useNavigate } from "react-router-dom";
import { IconSetting, IconTreeTriangleDown } from "@douyinfe/semi-icons";
import Dropdown, { DropDownMenuItem } from "@douyinfe/semi-ui/lib/es/dropdown";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { Button, Space, SplitButtonGroup } from "@douyinfe/semi-ui";
import { useSize } from "ahooks";
import { VfAction } from "@src/dsl/VF";
const mode = import.meta.env.VITE_APP_MODE;

/**
 * 查询列表的布局page组件
 * 适用于弹出层
 */
export interface ContentProps<T extends IdBean> extends TablePageProps<T> {
  title: string; //页面标题
  filterType: string; //左侧布局查询条件模型
  filterReaction: VfAction[];
  onReq?: (req: any) => void; //过滤条件回传
}

/**
 * crud 左右布局模版
 * @param param0
 * @returns
 */
const Content = <T extends IdBean>({
  title,
  listType,
  editType,
  filterType,
  req,
  btns,
  onReq,
  ...props
}: Partial<ContentProps<T>> & { listType: string }) => {
  const navigate = useNavigate();
  const { user, menuState } = useAuth();
  const [tableModel, setTableModel] = useState<FormVo>();
  const confirmModal = useNiceModal("vlifeModal");
  const [formData, setFormData] = useState<any>({});
  // const [model, setModel] = useState<FormVo | undefined>(formVo);
  const tableReq = useMemo(() => {
    return { ...req, ...formData };
  }, [req, formData]);

  const windowWidth = useSize(document.querySelector("body"))?.width;
  const [filterOpen, setFilterOpen] = useState(filterType ? true : false);
  //动态计算table区块宽度
  const tableWidth = useMemo((): number => {
    let width = windowWidth || 0;
    if (filterOpen === true) {
      width = width - 280;
    } else {
      width = width - 0;
    }
    width = menuState === "mini" ? width - 80 : width - 240;
    return width;
  }, [windowWidth, filterOpen, menuState]);

  const menu = useMemo((): DropDownMenuItem[] => {
    let arrays: DropDownMenuItem[] = [
      {
        node: "item",
        name: `[列表]${listType}`,
        onClick: () => {
          navigate(`/sysConf/tableDesign/${listType}`);
        },
      },
      { node: "divider" },
      {
        node: "item",
        name: "接口导入",
        onClick: () => {
          navigate(`/sysConf/resources`);
        },
      },
      {
        node: "item",
        name: "模型管理",
        onClick: () => {
          navigate(`/sysConf/model/${tableModel?.entityType}`);
        },
      },
      {
        node: "item",
        name: "前端代码",
        onClick: () => {
          navigate(`/sysConf/model/code/${tableModel?.entityType}`);
        },
      },
    ];

    if (filterType) {
      //插入到前面
      arrays.unshift({
        node: "item",
        name: `[查询]${filterType}`,
        onClick: () => {
          navigate(`/sysConf/formDesign/${filterType}`);
        },
      });
    }
    if (editType || tableModel?.entityType) {
      arrays.unshift({
        node: "item",
        name: `[表单]${editType || tableModel?.entityType}`,
        onClick: () => {
          navigate(`/sysConf/formDesign/${editType || tableModel?.entityType}`);
        },
      });
    }
    //其他表单模型
    const otherEdits = Array.from(
      new Set(
        btns
          ?.filter((btn) => btn.model && btn.model !== editType)
          .map((btn) => btn.model)
      )
    );

    if (otherEdits) {
      otherEdits.forEach((l) => {
        arrays.unshift({
          node: "item",
          name: `[表单]${l}`,
          onClick: () => {
            navigate(`/sysConf/formDesign/${l}`);
          },
        });
      });
    }

    return arrays;
  }, [btns, tableModel]);

  return (
    <div className="flex relative   ">
      <div
        style={{ width: `${filterType && filterOpen ? 280 : 0}px` }}
        className={`${
          filterType && filterOpen ? "p-3" : ""
        }  flex border-r relative border-gray-100   flex-col  overflow-hidden bg-white transition-width duration-200`}
      >
        {filterType && (
          <FormPage
            title={`${tableModel?.name}查询`}
            key={`filter${filterType}`}
            reaction={props.filterReaction}
            formData={req}
            // fontBold={true}
            onDataChange={(data) => {
              setFormData({ ...data });
              onReq?.(data);
            }}
            type={filterType}
          />
        )}
      </div>

      {filterType && (
        <i
          style={{ fontSize: "25px" }}
          onClick={() => {
            setFilterOpen(!filterOpen);
          }}
          className={` text-gray-400  entryIcon icon ${
            filterOpen ? "icon-sideslip_left left-64 " : "icon-sideslip_right"
          } z-40 top-1/2 cursor-pointer absolute  `}
        />
      )}
      <div
        className={` flex flex-1 flex-col relative rounded-md ${
          filterOpen ? "pl-1" : ""
        } `}
      >
        {/*仿tab标题行(做成配置需要便展示) */}
        <div className="flex w-full h-12 items-center border-b bg-white ">
          <div className="text-sm w-28 border flex items-center bg-gray-100 justify-center font-bold rounded-t-md ml-6 mt-2 h-10 border-b-0  ">
            <div className="">{title || tableModel?.name}</div>
          </div>
          {/* 按钮组 */}
          <div className=" text-base flex flex-1 justify-end space-x-1 pr-4">
            <Space>
              {(user?.superUser || mode === "dev") && (
                <SplitButtonGroup style={{ marginRight: 10 }}>
                  <Button theme="light" icon={<IconSetting />}>
                    配置
                  </Button>
                  <Dropdown
                    // onVisibleChange={(v) => handleVisibleChange(2, v)}
                    menu={menu}
                    trigger="click"
                    position="bottomRight"
                  >
                    <Button
                      style={{
                        padding: "8px 4px",
                      }}
                      className=" hover:bg-slate-400"
                      icon={<IconTreeTriangleDown />}
                    ></Button>
                  </Dropdown>
                </SplitButtonGroup>
              )}
            </Space>
          </div>
        </div>
        {/* 列表行 */}
        <TablePage<T>
          className="flex-grow "
          width={tableWidth}
          key={listType}
          listType={listType}
          editType={editType}
          req={tableReq}
          reaction={props.reaction}
          btns={btns}
          columnTitle={filterType !== undefined ? "sort" : true}
          // formVo={model}
          //列表数据回传
          //模型信息回传
          onTableModel={(formVo: FormVo) => {
            setTableModel(formVo);
          }}
          //错误信息回传
          onHttpError={(e) => {
            if (e.code === 4404) {
              confirmModal.show({
                title: `接口错误`,
                children: (
                  <>{`${e.code}无法访问，请配置或者在模块页面手工传入loadData的prop`}</>
                ),
                okFun: () => {
                  navigate(`/conf/design/${listType}/list`);
                },
              });
            }
          }}
          {...props}
        />
      </div>
    </div>
  );
};

// Content.header = function ToolbarHeader(props: any) {
//   return <div className={`toolbar-header ${props.type}`}>{props.title}</div>;
// };
export default Content;
