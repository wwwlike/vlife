import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IdBean } from "@src/api/base";
import FormPage from "@src/pages/common/formPage";
import { useNavigate } from "react-router-dom";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { useSize } from "ahooks";
import { VF, VfAction } from "@src/dsl/VF";
import BtnToolBar from "@src/components/table/component/BtnToolBar";
import { Tabs } from "@douyinfe/semi-ui";
import GroupLabel from "@src/components/form/component/GroupLabel";
import { listByCode, SysDict } from "@src/api/SysDict";

//tab页签
type TableTab = {
  itemKey: string; //视图编码(唯一)
  tab: string | ReactNode; //名称
  icon?: ReactNode; //图标
  active?: boolean; //当前页
  req?: object | { field: string; opt: string; value?: Object }[]; //视图过滤条件(简单方式)
};
/**
 * 查询列表的布局page组件
 * 适用于弹出层
 */
export interface ContentProps<T extends IdBean> extends TablePageProps<T> {
  title: string; //页面标题
  filterType: string; //左侧布局查询条件模型
  filterReaction: VfAction[]; //左侧布局的联动数组对象
  tabList: TableTab[]; //tab条件对象或者根据字段dictcode字典分组
  tabDictField: string; //是字典类型的字段，根据该字段的字典进行tab页签展示
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
  tabDictField,
  filterReaction,
  req,
  btns,
  onReq,
  ...props
}: Partial<ContentProps<T>> & { listType: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const confirmModal = useNiceModal("vlifeModal");
  const [formData, setFormData] = useState<any>({});
  const [tableModel, setTableModel] = useState<FormVo>();
  const allTab: TableTab = { itemKey: "all", tab: "全部", active: true };
  //固定项页签 tab abList方式+tabDictField方式
  const [fixedTab, setFixedTab] = useState<TableTab[]>([]);
  //计算后的页面页签
  const contentTab = useMemo((): TableTab[] | undefined => {
    if (fixedTab.length > 0) {
      return [allTab, ...fixedTab];
    }
    return undefined;
  }, [fixedTab]);
  const [activeKey, setActiveKey] = useState<string>(
    contentTab?.filter((tab) => tab.active === true)?.[0]?.itemKey ||
      contentTab?.[0]?.itemKey ||
      "all"
  );

  //固定页签组装
  useEffect(() => {
    const tabs: TableTab[] = [];
    if (tabList) {
      tabs.push(...tabList);
    }
    const dictcode = tableModel?.fields?.filter(
      (f) => f.fieldName === tabDictField
    )?.[0]?.dictCode;
    if (tabDictField && dictcode) {
      listByCode({ code: dictcode }).then((d) => {
        const dicts: SysDict[] = d.data || [];
        tabs.push(
          ...dicts.map((d) => {
            return {
              itemKey: d.id, //视图编码(唯一)
              tab: d.title,
              req: {
                [tabDictField]: d.val,
              }, //视图过滤条件(简单方式)
            };
          })
        );
        setFixedTab(tabs);
      });
    } else if (tabList) {
      setFixedTab(tabs);
    }
  }, [tabDictField, tableModel, tabList]);

  const tableReq = useMemo(() => {
    //自定义视图的查询方式
    let customViewReq: any = contentTab?.filter(
      (item) => item.itemKey === activeKey
    )?.[0]?.req;
    if (activeKey && contentTab && customViewReq) {
      //object转conditionGroup
      if (typeof customViewReq === "object") {
        customViewReq = Object.keys(customViewReq).map((key) => {
          return { fieldName: key, opt: "eq", value: [customViewReq[key]] };
        });
      }
      return {
        ...req,
        ...formData,
        ...customViewReq,
        conditionGroups: [{ where: customViewReq }],
      };
    } else {
      return { ...req, ...formData };
    }
  }, [req, formData, contentTab, activeKey]);

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
    <div ref={ref} className="flex relative">
      {filterType && (
        <>
          <div
            style={{ width: 280 }}
            className={`${
              filterOpen ? "p-3" : ""
            }   border-r flex border-gray-100 relative  flex-col  overflow-hidden bg-white transition-width duration-200`}
          >
            <GroupLabel text={`${tableModel?.name}查询`} className="mb-6" />
            <FormPage
              key={`filter${filterType}`}
              reaction={filterReaction}
              formData={req}
              // fontBold={true}
              onDataChange={(data) => {
                setFormData({ ...data });
                onReq?.(data);
              }}
              type={filterType}
            />
          </div>
          <i
            style={{ fontSize: "25px" }}
            onClick={() => {
              setFilterOpen(!filterOpen);
            }}
            className={` text-gray-400  entryIcon icon ${
              filterOpen ? "icon-sideslip_left left-64 " : "icon-sideslip_right"
            } z-40 top-1/2 cursor-pointer absolute  `}
          />
        </>
      )}
      <div
        className={` flex flex-1 flex-col relative rounded-md ${
          filterOpen ? "pl-1" : ""
        } `}
      >
        {contentTab !== undefined && (
          <div className=" bg-white  pt-1">
            <Tabs
              style={{ height: "36px", paddingLeft: "10px" }}
              type="card"
              activeKey={activeKey}
              tabList={contentTab}
              onChange={(key) => {
                if (key !== "add") {
                  setActiveKey(key);
                }
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
export default Content;
