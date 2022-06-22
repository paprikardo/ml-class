//*TODO: used viewbox to scale points appropriately. How to find coordinates in viewbox? */
import { type } from "@testing-library/user-event/dist/type";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { CLASS_A, CLASS_B, CLASS_NEW_POINT, IData, IDataPoint } from "../Data";

var pt: DOMPoint | undefined = undefined;
var screenctm: any = null;

var shiftKey = false;
interface IProp {
  plot_data: IData;
  addPoint: (xVal: number, yVal: number, id: string) => void;
  userLineState?: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  hideSplitLine?: boolean;
  enableUserDraw?: boolean;
  onMouseUpPlotHandler?: () => void;
  onMouseDownPlotHandler?: (cursorpt: DOMPoint | undefined) => void;
  onMouseMovePlotHandler?: (
    mouseHold: boolean,
    cursorpt: DOMPoint | undefined
  ) => void;
}
const MyPlot = forwardRef(
  (
    {
      plot_data,
      addPoint,
      userLineState,
      hideSplitLine,
      enableUserDraw = false,
      onMouseUpPlotHandler,
      onMouseDownPlotHandler,
      onMouseMovePlotHandler,
    }: IProp,
    ref
  ): JSX.Element => {
    const class1 = plot_data.data[CLASS_A];
    const class2 = plot_data.data[CLASS_B];
    const newPoint = plot_data.data[CLASS_NEW_POINT][0];
    const all_data_x = [
      ...class1.map(({ x, y }, index) => x),
      ...class2.map(({ x, y }, index) => x),
    ];
    const all_data_y = [
      ...class1.map(({ x, y }, index) => y),
      ...class2.map(({ x, y }, index) => y),
    ];
    const xmin = Math.min(...all_data_x);
    const xmax = Math.max(...all_data_x);
    const ymin = Math.min(...all_data_y);
    const ymax = Math.max(...all_data_y);

    const [mouseHold, setMouseHold] = useState(false);

    const getSVGCoords = (evt: React.MouseEvent<SVGSVGElement>) => {
      if (pt == null) {
        console.log("NULL ERROR");
      } else {
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        // The cursor point, translated into svg coordinates
        return pt.matrixTransform(screenctm.inverse());
      }
    };
    //on click add point
    const onClickHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
      const cursorpt = getSVGCoords(evt);
      if (!enableUserDraw) {
        //only add new points on click if not draw User Line mode
        if (shiftKey) {
          addPoint(
            parseFloat(cursorpt!.x.toFixed(4)),
            parseFloat((-cursorpt!.y).toFixed(4)),
            CLASS_B
          ); //-y on the points since y coordinate was flipped
        } else {
          addPoint(
            parseFloat(cursorpt!.x.toFixed(4)),
            parseFloat((-cursorpt!.y).toFixed(4)),
            CLASS_A
          ); //-y on the points since y coordinate was flipped
        }
      }
    };

    const onMouseDownHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
      const cursorpt = getSVGCoords(evt);
      setMouseHold(true);
      if (typeof onMouseDownPlotHandler === "function") {
        onMouseDownPlotHandler(cursorpt);
      }
    };
    const onMouseUpHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
      setMouseHold(false);
      if (typeof onMouseUpPlotHandler === "function") {
        onMouseUpPlotHandler();
      }
    };
    const onMouseMoveHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
      const cursorpt = getSVGCoords(evt);
      if (typeof onMouseMovePlotHandler === "function") {
        onMouseMovePlotHandler(mouseHold, cursorpt);
      }
    };
    const onKeyDownHandler: React.KeyboardEventHandler<SVGSVGElement> = (
      event
    ) => {
      if (event.shiftKey) {
        shiftKey = true;
      } else {
        shiftKey = false;
      }
    };
    // PLOT ELEMENTS
    const displaySplitLine = hideSplitLine ? "none" : "";

    const points1 = class1.map(({ x, y }, index) => (
      <circle
        key={"c1" + index}
        cx={x}
        cy={y}
        r="0.3"
        stroke="black"
        strokeWidth="0.09"
        fill="red"
      />
    ));
    const points2 = class2.map(({ x, y }, index) => (
      <circle
        key={"c2" + index}
        cx={x}
        cy={y}
        r="0.3"
        stroke="black"
        strokeWidth="0.09"
        fill="blue"
      />
    ));
    const axisLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      key: string
    ) => {
      return (
        <line
          key={key}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="gray"
          strokeWidth="2"
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
        />
      );
    };
    const tickLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      key: string
    ) => {
      return (
        <line
          key={key}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="gray"
          strokeWidth="4"
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
        />
      );
    };
    const xAxisPoints = [
      Math.round(xmin),
      Math.round(xmin + (xmax - xmin) / 2),
      Math.round(xmax),
    ];
    const yValueXAxis = ymin - 1;
    const xTicks = xAxisPoints.map((x, i) =>
      tickLine(x, yValueXAxis, x, yValueXAxis - 0.2, "xTicks-" + i + "-" + x)
    );
    const xAxis = axisLine(
      xAxisPoints[0] - 1,
      yValueXAxis,
      xAxisPoints[xAxisPoints.length - 1] + 1,
      yValueXAxis,
      "xAxis-Key"
    );
    const xLabels = xAxisPoints.map((x, i) => (
      <text
        key={"xLabel-" + i + "-" + x}
        x={x}
        y={-yValueXAxis + 0.5}
        fill="black"
        fontSize="0.3"
      >
        {x}
      </text>
    ));
    const yAxisPoints = [
      Math.round(ymin),
      Math.round(ymin + (ymax - ymin) / 2),
      Math.round(ymax),
    ];
    const xValueYAxis = xmin - 0.5;
    const yTicks = yAxisPoints.map((y, i) =>
      tickLine(xValueYAxis, y, xValueYAxis - 0.2, y, "yTicks-" + i + " " + y)
    );
    const yAxis = axisLine(
      xValueYAxis,
      yValueXAxis,
      xValueYAxis,
      yAxisPoints[yAxisPoints.length - 1] + 1,
      "yAxis-Key"
    );
    const yLabels = yAxisPoints.map((y, i) => (
      <text
        key={"yLabel-" + i + "-" + y}
        x={xValueYAxis - 0.5}
        y={-y}
        fill="black"
        fontSize="0.3"
      >
        {y}
      </text>
    ));
    const svgPadding = 1;

    useKeyPress();
    return (
      <svg
        height="100%"
        width="100%"
        onClick={onClickHandler}
        onMouseDown={onMouseDownHandler}
        onMouseUp={onMouseUpHandler}
        onMouseMove={onMouseMoveHandler}
        onKeyDown={onKeyDownHandler}
        viewBox={
          xmin -
          svgPadding +
          " " +
          (-ymax - svgPadding) +
          " " +
          (xmax - xmin + 2 * svgPadding) +
          " " +
          (ymax - ymin + 2 * svgPadding)
        }
        ref={(ref) => {
          pt = ref?.createSVGPoint();
          screenctm = ref?.getScreenCTM();
        }}
      >
        {xLabels}
        {yLabels}
        <g transform="scale(1,-1)">
          {xTicks}
          {xAxis}
          {yTicks}
          {yAxis}
          {points1}
          {points2}
          {/* Differentiation line */}
          <line
            display={displaySplitLine}
            x1={xmin}
            y1={plot_data["line"](xmin)}
            x2={xmax}
            y2={plot_data["line"](xmax)}
            stroke="black"
            strokeWidth="5"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
          />
          {/* User Line */}
          <line
            {...userLineState}
            stroke="rgb(0, 153, 51)"
            strokeWidth="5"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    );
  }
);

const useKeyPress = () => {
  // const [sh, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true
  const downHandler = (ev: KeyboardEvent) => {
    if (ev.key === "Shift") {
      shiftKey = true;
    }
  };
  // If released key is our target key then set to false
  const upHandler = (ev: KeyboardEvent) => {
    if (ev.key === "Shift") {
      shiftKey = false;
    }
  };
  useEffect(() => {
    // Add event listeners
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
};

export default MyPlot;
