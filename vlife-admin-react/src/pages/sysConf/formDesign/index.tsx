import { LeftOutlined, RocketOutlined } from "@ant-design/icons";
import { Avatar, Button, Space } from "antd";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { Toolbar } from "./component/Toolbar";
import { IWorkFlowNode } from "@src/workflow-editor";
import { NavTabs } from "./component/NavTabs";
import FormDesign from "./FormDesign";
import { useLocation, useNavigate } from "react-router-dom";
import { FormVo, list, saveFormDto } from "@src/api/Form";
import VfButton from "@src/components/button";
import { useAuth } from "@src/context/auth-context";
import BasicSetting from "./component/BasicSetting";
import FlowDesign from "./FlowDesign";

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

export default memo((props: { flowNode?: IWorkFlowNode }) => {
  const local = useLocation();
  const navigate = useNavigate();
  const { clearModelInfo } = useAuth();
  const type = useMemo<string>(() => {
    return local.pathname.split("/")[local.pathname.split("/").length - 1];
  }, [local.pathname]);

  const [currModel, setCurrModel] = useState<FormVo>();
  useEffect(() => {
    list({ type }).then((d) => {
      const f = d.data?.[0];
      setCurrModel(f);
    });
  }, [type]);

  const { flowNode, ...other } = props;
  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.formDesign);

  const optionsTitle = useMemo(() => {
    return [
      {
        key: TabType.baseSettings,
        label: "基础设置",
      },
      {
        key: TabType.formDesign,
        label: "表单设计",
      },
      !currModel?.entityType.startsWith("sys") &&
      !currModel?.entityType.startsWith("form") &&
      !currModel?.entityType.startsWith("page")
        ? {
            key: TabType.flowDesign,
            label: "流程设计",
          }
        : null,
      // {
      //   key: TabType.addvancedSettings,
      //   label: "高级设置",
      // },
    ].filter((f) => f !== null);
  }, [currModel]);

  const handleNavChange = useCallback((key?: string) => {
    setSelectedTab((key || TabType.flowDesign) as TabType);
  }, []);

  return (
    <Container className={"  bg-white"} {...other}>
      <Toolbar
        title={
          <Space>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => {
                navigate(-1);
              }}
            />
            <Avatar
              shape="square"
              style={{
                backgroundColor: "rgba(44,121,245, 0.2)",
                color: "#2c79f6",
              }}
              icon={<RocketOutlined />}
            />
            {currModel?.name}
          </Space>
        }
        actions={
          <Space>
            <VfButton
              position="formFooter"
              actionType="edit"
              title="保存"
              datas={currModel}
              saveApi={saveFormDto}
              onSubmitFinish={(data) => {
                setCurrModel(data);
                //缓存清除
                clearModelInfo(currModel?.type);
              }}
            />
          </Space>
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
