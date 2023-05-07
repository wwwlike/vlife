import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Example1 from "./Example1";

export default () => {
  const { pathname } = useLocation();

  const exampleName = useMemo(() => {
    const length = pathname.indexOf("/curd/");
    const name = pathname.substring(length);
    return "1";
  }, [pathname]);

  return exampleName === "1" ? <Example1 /> : <>{exampleName}</>;
};
