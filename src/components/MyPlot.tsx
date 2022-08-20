//*TODO: used viewbox to scale points appropriately. How to find coordinates in viewbox? */
import { forwardRef, useEffect, useState } from "react";
import { IData, IDataPoint, IDataClass } from "../Data";

var pt: DOMPoint | undefined = undefined;
var screenctm: any = null;

var shiftKey = false;
interface IProp {
  plot_data: IData;
  addPoint: (cl: number, new_point: IDataPoint) => void;
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
    const dimensions = plot_data.data[0].points.length;
    const oneDimensional = dimensions == 1;
    const yOneDimension = 2;
    const selectDimData = (): IDataClass[] => {
      const [a1, a2] = plot_data.selected_attrib; //indices of the selected attributes/dimensions/features
      return plot_data.data.map(({ className, points }) => {
        return {
          className: className,
          points: points.map((p) => [p[a1], p[a2]]),
        };
      });
    };
    //return data points of the selected classess where the points only contain the selected dimensions
    const selectDimSelectClassData = (): [IDataPoint[], IDataPoint[]] => {
      const [c0, c1] = plot_data.selected_class; //indices of the selected classes
      const [a1, a2] = plot_data.selected_attrib; //indices of the selected attributes/dimensions/features
      return [
        plot_data.data[c0].points.map((p) => [p[a1], p[a2]]),
        plot_data.data[c1].points.map((p) => [p[a1], p[a2]]),
      ];
    };
    var svmBorderLine:(x: number) => number= ()=>1;
    //compute line classifier
    const svmjs = require("svm");
    //c1 and c2 are the arrays of 2D data points, i.e. the selection to 2 features has to happen before calling this function, use getSelectedData() for the selection
    const computeSVMBorder = (c1: IDataPoint[], c2: IDataPoint[]) => {
      if (c1[0].length != 2 || c2[0].length != 2) {
        console.log(
          "ERROR: Calles SVM with wrong input dimensions. Maybe you have not selected the 2 distincitive features"
        );
      }
      const data = [...c1, ...c2];
      const labels: [number][] = [
        ...new Array(c1.length).fill(-1),
        ...new Array(c2.length).fill(1),
      ];
      const svm = new svmjs.SVM();
      //const trainstats
      svm.train(data, labels, { kernel: "linear", C: 1 }); // C is a parameter to SVM
      //const testlabels = svm.predict(testdata);
      // console.log("data: ",svm.data);
      // console.log("labels: ",svm.labels);
      // console.log("trainstats: ",trainstats);
      // console.log("getWeights()",svm.getWeights())
      // console.log(svm.w)
      // console.log(svm.usew_)
      // console.log(svm.marginOne([16,2145]))
      // console.log(svm.predictOne([12,2145]))
      //x[0]*w[0][0]+x[1]*w[0][1]+w[1] = 0
      //x[0]*w[0][0]+w[1] = -x[1]*w[0][1]
      //(x[0]*w[0][0]+w[1])/-w[0][1] = x[1]
      const w = svm.getWeights();
      const line_generator = (x: number) =>
        (x * w["w"][0] + w["b"]) / -w["w"][1];
      return line_generator;
    };
    //compute line and put it in data
    useEffect(() => {
      svmBorderLine = computeSVMBorder(...selectDimSelectClassData());
    }, [plot_data.data]);

    const classes = selectDimData(); //classes with selected dimensions to display
    const classPoints = classes.map((cl) => cl.points); //just their points without the class names
    const newPoint = plot_data.newPoint;
    //in the following we refer to x as all points in the first selected dimension and y as the second
    const all_points_x = classPoints
      .map((clp) => clp.map((p) => p[0]))
      .toString()
      .split(",")
      .map(Number); //extract x coords and flatten array
    const all_points_y = classPoints
      .map((clp) => clp.map((p) => p[1]))
      .toString()
      .split(",")
      .map(Number); //extract x coords and flatten array
    var xmin = Math.min(...all_points_x);
    var xmax = Math.max(...all_points_x);
    var ymin = Math.min(...all_points_y);
    var ymax = Math.max(...all_points_y);
    //set the minimum intervall that we want to show on the axis, this avoides that the plotted graph will zoom in too much when the points are very close to each other
    const minIntervalLength = 5;
    const xdistance = xmax - xmin;
    if (xdistance < minIntervalLength) {
      xmax = xmax + minIntervalLength / 2;
      xmin = xmin - minIntervalLength / 2;
    }
    const ydistance = ymax - ymin;
    if (ydistance < minIntervalLength) {
      ymax = ymax + minIntervalLength / 2;
      ymin = ymin - minIntervalLength / 2;
    }

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
        const pointToAdd = new Array(dimensions).fill(0);
        const [selectedAttrib1, selectedAttrib2] = plot_data.selected_attrib;
        pointToAdd[selectedAttrib1] = parseFloat(cursorpt!.x.toFixed(4));
        pointToAdd[selectedAttrib2] = parseFloat((-cursorpt!.y).toFixed(4)); //-y on the points since y coordinate was flipped
        if (shiftKey) {
          // add point to the second class if shiftKey
          addPoint(plot_data.selected_class[1], pointToAdd);
        } else {
          addPoint(plot_data.selected_class[0], pointToAdd);
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
    const colors = ["red", "blue", "yellow","green"]; //LIMITATION: ALLOW MAXIMUM OF 4 DIFFERENT CLASSES
    const svgCircles = classPoints.map((points, index) =>
      points.map((p) => {
        const ys = oneDimensional ? yOneDimension : p[1];
        return (
          <circle
            key={"c1" + index}
            cx={p[0]}
            cy={ys}
            r="0.3"
            stroke="black"
            strokeWidth="0.09"
            fill={colors[index]}
          />
        );
      })
    );
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
        {(() => {
          return oneDimensional ? null : yLabels;
        })()}
        <g transform="scale(1,-1)">
          {xTicks}
          {xAxis}
          {yTicks}
          {yAxis}
          {...svgCircles}
          {/* Differentiation line */}
          <line
            display={displaySplitLine}
            x1={xmin}
            y1={svmBorderLine(xmin)}
            x2={xmax}
            y2={svmBorderLine(xmax)}
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
