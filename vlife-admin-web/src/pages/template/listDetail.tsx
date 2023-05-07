/**
 * 列表和明细模版
 */
import {
  Button,
  Card,
  Divider,
  Dropdown,
  SplitButtonGroup,
} from "@douyinfe/semi-ui";
import { IdBean } from "@src/api/base";
import FormPage from "@src/pages/common/formPage";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSetting, IconTreeTriangleDown } from "@douyinfe/semi-icons";
import { DropDownMenuItem } from "@douyinfe/semi-ui/lib/es/dropdown";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import OrderPage from "../common/orderPage";
const mode = import.meta.env.VITE_APP_MODE;

/**
 * 查询列表的布局page组件
 * 其实也应该通过页面设计来组装，不用手写该组件
 */

export interface ContentProps<T extends IdBean> extends TablePageProps<T> {
  //按钮名称
  title?: string;
  filterType?: string; //过滤条件模型名称
  showOrder?: boolean; //是否显示order
  // filterData?: any; //初始的过滤条件
}

/**
 * crud 左右布局模版
 * @param param0
 * @returns
 */
const ListDetail = <T extends IdBean>({
  title,
  entityType,
  editType = entityType,
  listType = editType,
  filterType,
  lineBtn,
  tableBtn,
  formVo,
  req,
  btnHide,
  showOrder = true,
  // filterData,
  ...props
}: Partial<ContentProps<T>> & { entityType: String }) => {
  const [reqFormData, setReqFormData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const confirmModal = useNiceModal("vlifeModal");
  const [model, setModel] = useState<FormVo | undefined>(formVo);
  const navigate = useNavigate();
  const tableReq = useMemo(() => {
    return { ...req, ...reqFormData };
  }, [req, reqFormData]);

  const menu = useMemo((): DropDownMenuItem[] => {
    let arrays: DropDownMenuItem[] = [
      {
        node: "item",
        name: "查询配置",
        onClick: () => {
          navigate(`/sysConf/modelDesign/${filterType}/filter`);
        },
      },
      {
        node: "item",
        name: "列表配置",
        onClick: () => {
          navigate(`/sysConf/modelDesign/${listType}/list`);
        },
      },
      {
        node: "item",
        name: "表单配置",
        onClick: () => {
          navigate(`/sysConf/modelDesign/${editType}/form`);
        },
      },
      { node: "divider" },
      {
        node: "item",
        name: "权限资源",
        onClick: () => {
          navigate(`/sysConf/resources`);
        },
      },
      {
        node: "item",
        name: "模型管理",
        onClick: () => {
          navigate(`/sysConf/modelDetail/${entityType}`);
        },
      },
      {
        node: "item",
        name: "前端代码",
        onClick: () => {
          navigate(`/sysConf/modelCode/${entityType}`);
        },
      },
    ];

    let existModel = [filterType, listType, editType];

    if (lineBtn) {
      lineBtn.forEach((l) => {
        if (l.model && l.model.type && !existModel.includes(l.model.type)) {
          arrays.push({
            node: "item",
            name: l.title + "配置",
            onClick: () => {
              navigate(`/sysConf/formDesign/${l.model?.type}`);
            },
          });
          existModel.push(l.model.type);
        }
      });
    }
    if (tableBtn) {
      tableBtn.forEach((l) => {
        if (l.model && l.model.type && !existModel.includes(l.model.type)) {
          arrays.push({
            node: "item",
            name: l.title + "模型",
            onClick: () => {
              navigate(`/conf/design/${l.model?.type}`);
            },
          });
          existModel.push(l.model.type);
        }
      });
    }

    return arrays;
  }, [lineBtn, tableBtn]);

  return (
    <div className="h-full flex">
      {filterType && (
        <div className="h-full w-72">
          <Card
            title={`${title ? title : model ? model.title : ""}管理`}
            bordered={true}
            className="h-full"
            headerLine={false}
            headerStyle={{ fontSize: "small" }}
          >
            <FormPage
              key={`filter${filterType}`}
              formData={req}
              onDataChange={(data) => setReqFormData({ ...data })}
              type={filterType}
            />
            {/* 排序 */}
            {model?.fields && showOrder && (
              <>
                <Divider className=" m-2">请选择排序条件</Divider>
                <OrderPage
                  filterType={filterType}
                  fields={model.fields}
                  onDataChange={(str) => {
                    setReqFormData({ ...reqFormData, order: { orders: str } });
                  }}
                />
              </>
            )}
          </Card>
        </div>
      )}

      <Card
        className="h-full group w-full "
        title={`${title ? title : model ? model.title : ""}列表`}
        headerExtraContent={
          mode === "dev" && (
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
          )
        }
        headerLine={false}
        bordered={false}
      >
        <div className=" flex space-x-4">
          <TablePage<T>
            className=" w-64"
            column={["name"]}
            read={true}
            key={entityType + listType}
            listType={listType}
            editType={editType}
            entityType={entityType}
            lineBtn={lineBtn}
            tableBtn={tableBtn}
            req={tableReq}
            formVo={model}
            onLineClick={(d) => {
              setFormData(d);
            }}
            //列表数据回传
            //模型信息回传
            onFormModel={(formVo: FormVo) => {
              // alert(formVo.title);
              setModel(formVo);
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
          <FormPage
            className={" w-full"}
            formData={formData}
            type={editType}
            readPretty={true}
          />
        </div>
      </Card>
    </div>
  );
};

export default ListDetail;
