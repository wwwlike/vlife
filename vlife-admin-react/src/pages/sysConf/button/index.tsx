import React, { useState } from "react";
import Content from "@src/pages/template/content";
import { result } from "lodash";
import BtnToolBar from "@src/components/button/BtnToolBar";
import { useAuth } from "@src/context/auth-context";

export default () => {
  const { resources } = useAuth();
  const [data, setData] = useState<any[]>([]);
  return (
    <>
      <Content
        listType="button"
        onGetData={(d) => {
          setData(d.result);
        }}
      />
      {/* {data && data.length > 0 && <BtnToolBar btns={data} />} */}
    </>
  );
};
