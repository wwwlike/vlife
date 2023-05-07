import React from "react";
import Content from "../../template/content";
import { LinkMan } from "@src/api/LinkMan";

export default () => {
  return (
    <Content<LinkMan>
      entityType="linkMan"
      filterType="linkManPageReq"
    ></Content>
  );
};
