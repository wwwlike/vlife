import React from "react";

export default ({ maxColumns }: { maxColumns: number[] }) => {
  console.log(maxColumns);
  // alert("1111");
  return <>{JSON.stringify(maxColumns)}</>;
};
