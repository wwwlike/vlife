import { page } from "@src/api/workflow/Flow";
import React, { useEffect, useState } from "react";

export default () => {
  const [data, setData] = useState<any>();
  useEffect(() => {
    page({}).then((d) => {
      setData(d.data);
    });
  }, []);

  return <>{JSON.stringify(data)}</>;
};
