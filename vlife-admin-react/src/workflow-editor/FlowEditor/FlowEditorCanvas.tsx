import { CSSProperties, memo, useCallback, useRef, useState } from "react";
import { styled } from "styled-components";
import { StartNode } from "../nodes/StartNode";
import { canvasColor } from "../utils/canvasColor";
import { ZoomBar } from "./ZoomBar";
import { SettingsPanel } from "./SettingsPanel";
import { OperationBar } from "./OperationBar";
import { FormVo } from "@src/api/Form";

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  background-color: ${canvasColor};
  position: relative;
  height: 0;
`;

const Canvas = styled.div`
  flex: 1;
  padding: 56px 16px;
  padding-bottom: 0;
  overflow: auto;
  cursor: grab; //grabbing
  display: flex;
`;

const CanvasInner = styled.div`
  flex: 1;
  transform-origin: 0px 0px;
`;
function toDecimal(x: number) {
  const f = Math.round(x * 10) / 10;
  return f;
}

export interface IPosition {
  x: number;
  y: number;
  scrollLeft: number;
  scrollTop: number;
}
//dlc 工作流编辑器画布
export const FlowEditorCanvas = memo(
  (props: { className?: string; style?: CSSProperties; formVo?: FormVo }) => {
    const [zoom, setZoom] = useState(1);
    const [scrolled, setScrolled] = useState(false);
    const [mousePressedPoint, setMousePressedPoint] = useState<IPosition>();
    const canvasRef = useRef<HTMLDivElement>(null);

    const haneldZoomIn = useCallback(() => {
      setZoom((zoom) => toDecimal(zoom < 3 ? zoom + 0.1 : zoom));
    }, []);

    const haneldZoomOut = useCallback(() => {
      setZoom((zoom) => toDecimal(zoom > 0.1 ? zoom - 0.1 : zoom));
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      canvasRef.current &&
        setMousePressedPoint({
          x: e.clientX,
          y: e.clientY,
          scrollLeft: canvasRef.current.scrollLeft,
          scrollTop: canvasRef.current.scrollTop,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
      setMousePressedPoint(undefined);
    }, []);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!mousePressedPoint) {
          return;
        }

        const dragMoveDiff = {
          x: mousePressedPoint.x - e.clientX,
          y: mousePressedPoint.y - e.clientY,
        };

        if (canvasRef.current) {
          canvasRef.current.scrollLeft =
            mousePressedPoint.scrollLeft + dragMoveDiff.x;
          canvasRef.current.scrollTop =
            mousePressedPoint.scrollTop + dragMoveDiff.y;
        }
      },
      [mousePressedPoint]
    );

    const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
      if (e.currentTarget.scrollTop > 60 || e.currentTarget.scrollLeft > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }, []);

    return (
      //dlc div容器
      <CanvasContainer {...props}>
        {/* dlc 也是一个容器 */}
        <Canvas
          ref={canvasRef}
          className={"flow-canvas"}
          style={{
            cursor: mousePressedPoint ? "grabbing" : "grab",
          }}
          draggable={false}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onScroll={handleScroll}
        >
          {/* 可放大缩小的div */}
          <CanvasInner
            style={{
              transform: `scale(${zoom})`,
            }}
            draggable={true}
          >
            {/* 开始节点 */}
            <StartNode />
          </CanvasInner>
        </Canvas>
        {/* 前进后退 */}
        <OperationBar float={scrolled} />
        {/* 放大缩小 */}
        <ZoomBar
          float={scrolled}
          zoom={zoom}
          onZoomIn={haneldZoomIn}
          onZoomOut={haneldZoomOut}
        />
        {/* 右侧配置面板 */}
        <SettingsPanel formVo={props.formVo} />
      </CanvasContainer>
    );
  }
);
