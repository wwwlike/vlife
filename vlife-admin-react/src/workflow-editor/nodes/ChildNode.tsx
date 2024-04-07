import { memo } from "react";
import { IRouteNode, IWorkFlowNode, NodeType } from "../interfaces";
import { RouteNode } from "./RouteNode";
import { NormalNode } from "./NormalNode";

export const ChildNode = memo((props: { node: IWorkFlowNode }) => {
  const { node } = props;
  return node.nodeType === NodeType.route ? (
    <RouteNode node={node as IRouteNode} />
  ) : (
    <NormalNode node={node} />
  );
});
