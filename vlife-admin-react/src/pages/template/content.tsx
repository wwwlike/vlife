import React, { ReactNode, useMemo, useRef, useState } from "react";
import FormPage from "@src/pages/common/formPage";
import { useNavigate } from "react-router-dom";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { useSize } from "ahooks";
import GroupLabel from "@src/components/form/component/GroupLabel";
import { OptEnum, where } from "@src/dsl/base";
import { TableBean } from "@src/components/table";
import { VF, VfAction } from "@src/dsl/VF";

//tab页签
type TableTab = {
  itemKey: string; //视图编码(唯一)
  tab: string | ReactNode; //名称
  icon?: ReactNode; //图标
  showCount?: boolean; //是否显示统计数量
  req?: object | { fieldName: string; opt: OptEnum; value?: Object }[]; //视图过滤条件(简单方式)
  subs?: (TableTab & { singleReq?: boolean })[]; //子级过滤页签 singleReq:表示不联合上一级过滤条件
};
/**
 * 查询列表的布局page组件
 * 适用于弹出层
 */
export interface ContentProps<T extends TableBean> extends TablePageProps<T> {
  title: string; //页面标题
  filterType: string | { type: string; reaction: VfAction[] }; //左侧布局查询条件模型以及级联响应的低代码
  // // tabList: TableTab[]; //tab分组的条件对象
  // tabDictField: string; //是字典类型的字段，根据该字段的字典进行tab页签展示
  // customView: boolean; //是否支持自定义页签
  onReq?: (req: any) => void; //过滤条件回传
}

/**
 * 对象转condition的where查询语法
 */
const objToConditionWhere = (obj: any): Partial<where>[] => {
  const fieldNames: string[] = Object.keys(obj);
  return fieldNames.map((f) => {
    return {
      fieldName: f,
      opt: OptEnum.eq,
      value: Array.isArray(obj[f]) ? obj[f] : [obj[f]],
    };
  });
};

/**
 * crud 左右布局模版
 */
const Content = <T extends TableBean>({
  title,
  listType,
  editType,
  filterType,
  // tabList,
  // tabDictField,
  req,
  btns,
  // customView = true,
  onReq,
  ...props
}: Partial<ContentProps<T>> & { listType: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const confirmModal = useNiceModal("vlifeModal");
  const [filterFormVo, setFilterFormVo] = useState<FormVo>();
  const [formData, setFormData] = useState<any>({});
  const [tableModel, setTableModel] = useState<FormVo>();

  //左侧列表根据查询维度隐藏指定字段(如查看本人数据，则不需要部门搜索条件)
  const filterReaction = useMemo((): VfAction[] => {
    if (filterFormVo) {
      // 部门code
      const deptCode = filterFormVo.fields.filter(
        (f) => f.entityType === "sysDept" && f.fieldName === "code"
      )?.[0];
      if (deptCode !== undefined) {
        return [
          VF.result(user?.groupFilterType === "sysUser_1")
            .then("code")
            .hide(),
        ];
      }
    }
    return [];
  }, [filterFormVo]);

  //查询条件组装
  const tableReq = useMemo(() => {
    const where: Partial<where>[] = [];
    //页面传入req转换成where方式条件
    if (req) {
      where.push(...objToConditionWhere(req));
    }
    return {
      ...formData, //表单object方式搜索
      conditionGroups: [{ where: where }],
    };
  }, [req, formData]);
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
              reaction={
                typeof filterType === "string"
                  ? filterReaction
                  : [...filterReaction, ...filterType.reaction]
              }
              // formData={req}
              onDataChange={(data) => {
                setFormData({ ...data });
                onReq?.(data);
              }}
              onVfForm={(v) => {
                setFilterFormVo(v);
              }}
              type={
                typeof filterType === "string" ? filterType : filterType.type
              }
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
      {/* 列表行 */}
      <TablePage<T>
        className="flex-grow"
        width={tableWidth}
        key={listType}
        listType={listType}
        editType={editType}
        req={tableReq}
        btns={btns}
        onGetData={(data) => {}}
        //视图数据过滤
        columnTitle={filterType !== undefined ? "sort" : true}
        onTableModel={setTableModel}
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
  );
};
export default Content;
