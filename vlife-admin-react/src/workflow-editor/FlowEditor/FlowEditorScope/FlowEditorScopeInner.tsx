import { useToken } from "antd/es/theme/internal";
import { memo, useMemo, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { EditorEngine } from "../../classes";
import { WorkflowEditorStoreContext } from "../../contexts";
import { INodeMaterial, IMaterialUIs } from "../../interfaces";
import { useTranslate } from "../../react-locales";
import { IThemeToken } from "../../theme";
import { defaultMaterials } from "../defaultMaterials";

export const FlowEditorScopeInner = memo(
  (props: {
    mode?: "dark" | "light"; //皮肤
    themeToken?: IThemeToken;
    children?: React.ReactNode;
    materials?: INodeMaterial[]; // dlc  理解成可添加的节点信息
    materialUis?: IMaterialUIs; // dlc 节点物料map
  }) => {
    const { mode, children, themeToken, materials, materialUis } = props;
    const [, token] = useToken();
    const t = useTranslate();
    const theme: { token: IThemeToken; mode?: "dark" | "light" } =
      useMemo(() => {
        return {
          token: themeToken || token,
          mode,
        };
      }, [mode, themeToken, token]);

    //dlc 编辑器引擎 提供各种方法service
    const store: EditorEngine = useMemo(() => {
      return new EditorEngine();
    }, []);

    //dlc 国际化
    useEffect(() => {
      store.t = t;
    }, [store, t]);

    //dlc 数据装载
    useEffect(() => {
      const oldMaterials = store.materials;
      const oldMaterialUis = store.materialUis;
      store.materials = [
        ...oldMaterials,
        ...defaultMaterials,
        ...(materials || []),
      ];
      store.materialUis = { ...oldMaterialUis, ...materialUis };

      // useEffect 返回一个函数时，这个函数会在组件销毁时执行，用来清除副作用操作，比如取消订阅、清除定时器等。这样可以确保在组件销毁时及时清理副作用，防止内存泄漏和其他问题。
      return () => {
        store.materials = oldMaterials;
        store.materialUis = oldMaterialUis;
      };
    }, [materialUis, materials, store]);

    return (
      <WorkflowEditorStoreContext.Provider value={store}>
        {/*dlc children -> workFlowEditorInner*/}
        <ThemeProvider theme={theme}>{store && children}</ThemeProvider>
      </WorkflowEditorStoreContext.Provider>
    );
  }
);
