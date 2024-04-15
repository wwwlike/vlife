import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { Toolbar } from "./component/Toolbar";
import { NavTabs } from "./component/NavTabs";
import FormDesign from "./FormDesign";
import { useLocation, useNavigate } from "react-router-dom";
import { FormVo, list, saveFormDto } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import BasicSetting from "./component/BasicSetting";
import FlowDesign from "./FlowDesign";
import { Space } from "@douyinfe/semi-ui";
import BtnToolBar from "@src/components/button/BtnToolBar";
import { publish } from "@src/api/workflow/Flow";
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  height: 0;
`;
export enum TabType {
  baseSettings = "baseSettings",
  formDesign = "formDesign",
  flowDesign = "flowDesign",
  addvancedSettings = "addvancedSettings",
}

export default memo(() => {
  const local = useLocation();
  const navigate = useNavigate();
  const { clearModelInfo } = useAuth();
  const [currModel, setCurrModel] = useState<FormVo>();

  const type = useMemo<string>(() => {
    return local.pathname.split("/")[local.pathname.split("/").length - 1];
  }, [local.pathname]);
  const designType = useMemo<string>(() => {
    return local.pathname.split("/")[local.pathname.split("/").length - 2];
  }, [local.pathname]);
  const [selectedTab, setSelectedTab] = useState<TabType>(
    designType as TabType
  );
  useEffect(() => {
    list({ type }).then((d) => {
      const f = d.data?.[0];
      setCurrModel(f);
    });
  }, [type]);

  const optionsTitle = useMemo(() => {
    const tabTitle = [
      {
        key: TabType.baseSettings,
        label: "基础设置",
      },
      {
        key: TabType.formDesign,
        label: "表单设计",
      },
    ];
    //业务模块可以添加工作流
    if (
      !currModel?.entityType.startsWith("sys") &&
      !currModel?.entityType.startsWith("form") &&
      !currModel?.entityType.startsWith("page") &&
      !currModel?.entityType.startsWith("report")
    ) {
      tabTitle.push({
        key: TabType.flowDesign,
        label: "流程设计",
      });
    }
    // {
    //   key: TabType.addvancedSettings,
    //   label: "高级设置",
    // },
    return tabTitle;
  }, [currModel]);

  const handleNavChange = useCallback((key?: string) => {
    setSelectedTab((key || TabType.flowDesign) as TabType);
  }, []);

  return (
    <Container className={"  bg-white"}>
      {/* {currModel?.unpublishJson} */}
      <Toolbar
        title={
          <Space>
            <i
              className=" text-xl cursor-pointer icon-arrow-back"
              onClick={() => {
                navigate(-1);
              }}
            />
            {/* <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => {
                navigate(-1);
              }}
            /> */}
            {/* <Avatar
              shape="square"
              style={{
                backgroundColor: "rgba(44,121,245, 0.2)",
                color: "#2c79f6",
              }}
            /> */}
            {currModel?.name}
          </Space>
        }
        actions={
          <BtnToolBar
            btns={[
              {
                actionType: "edit",
                title: "保存",
                disabled: (selectedTab as string) === "flowDesign",
                datas: currModel,
                disabledHide: true,
                saveApi: saveFormDto,
                onSubmitFinish: (data) => {
                  setCurrModel(data);
                  //缓存清除
                  clearModelInfo(currModel?.type);
                },
              },
              {
                actionType: "edit",
                title: "发布",
                disabledHide: (selectedTab as string) !== "flowDesign",
                tooltip: "请配置正确的流程节点信息",
                disabled:
                  (selectedTab as string) !== "flowDesign" ||
                  currModel?.unpublishJson === undefined ||
                  currModel?.unpublishJson === null,
                datas: currModel,
                saveApi: publish,
                onSubmitFinish: (data) => {
                  setCurrModel(data);
                  clearModelInfo(currModel?.type);
                },
              },
            ]}
          ></BtnToolBar>
        }
      >
        {currModel?.itemType !== "req" && (
          <NavTabs
            options={optionsTitle}
            value={selectedTab}
            onChange={handleNavChange}
          />
        )}
      </Toolbar>
      {selectedTab === TabType.baseSettings && currModel && (
        <BasicSetting
          formVo={currModel}
          onDataChange={function (formVo: FormVo): void {
            setCurrModel(formVo);
          }}
        />
      )}
      {/* 字段设计+列宽 */}
      {selectedTab === TabType.formDesign && (
        <FormDesign
          onModelChange={(formVo: FormVo) => {
            setCurrModel((m) => {
              return (
                m && {
                  ...m,
                  modelSize: formVo.modelSize,
                  fields: formVo.fields,
                }
              );
            });
          }}
        />
      )}
      {/* 流程设计json */}
      {selectedTab === TabType.flowDesign && currModel && (
        <FlowDesign
          type={currModel?.type}
          formVo={currModel}
          onDataChange={function (flowJson: string): void {
            setCurrModel((m) => {
              //只更新未发布的
              return m && { ...m, unpublishJson: flowJson };
            });
            // setCurrModel({ ...currModel, new });
          }}
        />
      )}
      {/* {selectedTab === TabType.addvancedSettings && <>4</>} */}
    </Container>
  );
});
