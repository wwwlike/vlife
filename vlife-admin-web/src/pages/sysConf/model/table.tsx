import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import React, { useState } from "react";
/**
 * 表说明
 */
export default () => {
  const { models } = useAuth();
  // const [table, setTable] = useState<FormVo>();
  return (
    <div>
      <div>表明</div>
    </div>
  );
};
