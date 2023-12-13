import React, { ReactNode, useMemo, useRef, useState } from "react";
import { IdBean } from "@src/api/base";
import FormPage from "@src/pages/common/formPage";
import { useNavigate } from "react-router-dom";
import { IconSetting } from "@douyinfe/semi-icons";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { Button, Space, Tabs } from "@douyinfe/semi-ui";
import { useSize } from "ahooks";
import { VfAction } from "@src/dsl/VF";
const mode = import.meta.env.VITE_APP_MODE;

//tab页签
type TableTab = {
  itemKey: string; //视图编码
  tab: string; //名称
  icon?: ReactNode; //图标
  active?: boolean; //当前页
  req?: any; //视图过滤条件
};
/**
 * 查询列表的布局page组件
 * 适用于弹出层
 */
export interface ContentProps<T extends IdBean> extends TablePageProps<T> {
  title: string; //页面标题
  filterType: string; //左侧布局查询条件模型
  filterReaction: VfAction[];
  tabList: TableTab[];
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
  tabList,
  req,
  btns,
  onReq,
  ...props
}: Partial<ContentProps<T>> & { listType: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tableModel, setTableModel] = useState<FormVo>();
  const confirmModal = useNiceModal("vlifeModal");
  const [activeKey, setActiveKey] = useState<string>(
    tabList?.filter((tab) => tab.active === true)?.[0]?.itemKey ||
      tabList?.[0]?.itemKey ||
      ""
  );
  const [formData, setFormData] = useState<any>({});
  // const [model, setModel] = useState<FormVo | undefined>(formVo);
  const tableReq = useMemo(() => {
    if (
      activeKey &&
      tabList &&
      tabList.filter((item) => item.itemKey === activeKey)[0].req
    ) {
      return {
        ...req,
        ...formData,
        ...tabList.filter((item) => item.itemKey === activeKey)[0].req,
      };
    } else {
      return { ...req, ...formData };
    }
  }, [req, formData, activeKey]);

  // const windowWidth = useSize(document.querySelector("body"))?.width;

  const ref = useRef(null);
  const size = useSize(ref);

  const [filterOpen, setFilterOpen] = useState(filterType ? true : false);
  //动态计算table区块宽度
  const tableWidth = useMemo((): number => {
    let width = size?.width || 0;
    if (filterOpen === true) {
      width = width - 280;
    } else {
      width = width - 0;
    }
    // width = menuState === "mini" ? width - 80 : width - 240;
    return width;
  }, [size, filterOpen]);

  return (
    <div ref={ref} className="flex relative   ">
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
        {/* <div className="flex w-full h-12 items-center border-b bg-white ">
          <div className="text-sm w-28 border flex items-center bg-gray-100 justify-center font-bold rounded-t-md ml-6 mt-2 h-10 border-b-0  ">
            <div className="">{title || tableModel?.name}</div>
          </div>
          <div className=" text-base flex flex-1 justify-end space-x-1 pr-4">
            <Space>
              {(user?.superUser || mode === "dev") && tableModel && (
                <Button
                  onClick={() => {
                    navigate(
                      `/sysConf/model?type=${tableModel?.entityType}&goBack=true`
                    );
                  }}
                  theme="light"
                  icon={<IconSetting />}
                >
                  配置
                </Button>
              )}
            </Space>
          </div>
        </div> */}
        {tabList && (
          <div className=" bg-white  pt-1">
            <Tabs
              style={{ height: "36px", paddingLeft: "10px" }}
              type="card"
              activeKey={activeKey}
              tabList={tabList}
              onChange={(key) => {
                setActiveKey(key);
              }}
            />
          </div>
        )}
        {/* 列表行 */}
        <TablePage<T>
          className="flex-grow  "
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
