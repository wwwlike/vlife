// import { ConfigProvider, theme } from "antd";
import { memo } from "react";

export const ConfigRoot = memo(
  (props: { themeMode?: "dark" | "light"; children?: React.ReactNode }) => {
    const { themeMode, children } = props;
    return (
      <>屏蔽</>
      // <ConfigProvider
      //   theme={{
      //     algorithm:
      //       themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      //   }}
      // >
      //   {children}
      // </ConfigProvider>
    );
  }
);
