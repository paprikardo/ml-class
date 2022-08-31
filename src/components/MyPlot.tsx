import { forwardRef, useEffect, useState } from "react";
import { IData, IDataPoint, IDataClass, colors } from "../Data";
import "../App.css";

var pt: DOMPoint | undefined = undefined;
var screenctm: any = null;

var shiftKey = false;
interface IProp {
  plot_data: IData;
  addPoint: (cl: number, new_point: IDataPoint) => void;
  enableUserDraw?: boolean; //toggles if the User is allowed to draw its own classifier into the plot
  userLineState?: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }; //The current state of the drawn user line, MyPlot does not track this, it is always displayed (with zero length if hidden)
  userPointXState?: number; //the current user point
  previewUserPoint?: boolean; //if true, the user Point is only in "preview" mode, transparent and not definite, if false the point is diplayed properly, if undefined it is not shown
  hideSplitLine?: boolean; //toogles if "Split Line" computed by AI is displayed
  isOneDimensional?: boolean; //toggles if this plot should only display one Dimension
  onMouseUpPlotHandler?: () => void;
  onMouseDownPlotHandler?: (cursorpt: DOMPoint | undefined) => void;
  onMouseMovePlotHandler?: (
    mouseHold: boolean,
    cursorpt: DOMPoint | undefined
  ) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
  overwriteClickHandler?: (cursorpt: DOMPoint | undefined) => void;
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
      setSelectedAttrib,
      isOneDimensional,
      overwriteClickHandler,
      previewUserPoint,
      userPointXState,
    }: IProp,
    ref
  ): JSX.Element => {
    const dimensions = plot_data.data[0].points[0].length;
    const oneDimensional = isOneDimensional ? true : dimensions === 1;
    const yOneDimension = 0;
    //return selected data of all of the classes (selected attributes of the points from all classes)
    const selectDimData = (): IDataClass[] => {
      if (Array.isArray(plot_data.selected_attrib)) {
        //2D axis case
        const [a1, a2] = plot_data.selected_attrib; //indices of the selected attributes/dimensions/features
        return plot_data.data.map(({ className, points }) => {
          return {
            className: className,
            points: points.map((p) => [p[a1], p[a2]]),
          };
        });
      } else {
        const attrib = plot_data.selected_attrib;
        return plot_data.data.map(({ className, points }) => {
          return {
            className: className,
            points: points.map((p) => [p[attrib]]),
          };
        });
      }
    };
    //return data points of the selected classes where the points only contain the selected dimensions/attributes
    const selectDimSelectClassData = (): [IDataPoint[], IDataPoint[]] => {
      const [c0, c1] = plot_data.selected_class; //indices of the selected classes
      if (Array.isArray(plot_data.selected_attrib)) {
        //if 2D axis case
        const [a1, a2] = plot_data.selected_attrib; //indices of the selected attributes/dimensions/features
        return [
          plot_data.data[c0].points.map((p) => [p[a1], p[a2]]),
          plot_data.data[c1].points.map((p) => [p[a1], p[a2]]),
        ];
      } else {
        const attrib = plot_data.selected_attrib;
        return [
          plot_data.data[c0].points.map((p) => [p[attrib]]),
          plot_data.data[c1].points.map((p) => [p[attrib]]),
        ];
      }
    };

    const classes = selectDimData(); //classes with selected dimensions to display
    const classPoints = classes.map((cl) => cl.points); //just their points without the class names
    const newPoint = plot_data.newPoint;
    //in the following we refer to x as all points in the first selected dimension and y as the second
    const all_points_x = classPoints //extract all x values
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
    // //set the minimum intervall that we want to show on the axis, this avoides that the plotted graph will zoom in too much when the points are very close to each other
    // const minIntervalLength = 8;
    // const xdistance = xmax - xmin;
    // if (xdistance < minIntervalLength) {
    //   xmax = xmax + (minIntervalLength - xdistance) / 2;
    //   xmin = xmin - (minIntervalLength - xdistance) / 2;
    // }
    // const ydistance = ymax - ymin;
    // if (ydistance < minIntervalLength) {
    //   ymax = ymax + (minIntervalLength - ydistance) / 2;
    //   ymin = ymin - (minIntervalLength - ydistance) / 2;
    // }

    const [mouseHold, setMouseHold] = useState(false);
    const afterScalingIntervall = 15;
    //scales any point to the desired max Intervall
    const scaleY = (y: number) => {
      return scale(y, ymin, ymax);
    };
    const scaleX = (x: number) => {
      return scale(x, xmin, xmax);
    };
    const scaleXInv = (x: number) => {
      return scaleInv(x, xmin, xmax);
    };
    const scaleYInv = (y: number) => {
      return scaleInv(y, ymin, ymax);
    };
    //if v=vmin it is mapped to itself. All other values are mapped proportionally to its distance such that vmax is mapped to vmin + afterScalingMaxIntervall
    const scale = (v: number, vmin: number, vmax: number) => {
      if (vmin == vmax) {
        return v;
      }
      return vmin + (afterScalingIntervall * (v - vmin)) / (vmax - vmin);
    };
    //inverse
    const scaleInv = (v: number, vmin: number, vmax: number) => {
      if (vmin == vmax) {
        return v;
      }
      return vmin + ((v - vmin) * (vmax - vmin)) / afterScalingIntervall;
    };

    const getSVGCoords = (evt: React.MouseEvent<SVGSVGElement>) => {
      if (pt == null) {
        console.log("NULL ERROR");
      } else {
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        // The cursor point, translated into svg coordinates
        const cursorpt = pt.matrixTransform(screenctm.inverse());
        const result = {
          ...cursorpt,
          x: scaleXInv(cursorpt!.x),
          y: scaleYInv(-cursorpt!.y), //-y on the points since y coordinate was flipped
        }; //overwrite x, y to rescale
        return result;
      }
    };

    const selectDimSelectClassDataScaled = (): [IDataPoint[], IDataPoint[]] => {
      const [s1, s2] = selectDimSelectClassData();
      if (Array.isArray(plot_data.selected_attrib)) {
        //if 2D
        const f = (x: IDataPoint[]) =>
          x.map((p) => [scaleX(p[0]), scaleY(p[1])]);
        return [f(s1), f(s2)];
      } else {
        //if 1D
        const f = (x: IDataPoint[]) => x.map((p) => [scaleX(p[0])]);
        return [f(s1), f(s2)];
      }
    };
    //compute line classifier
    const svmjs = require("svm");
    //c1 and c2 are the arrays of 2D or 1D data points, i.e. the selection to 2 features/1 feature has to happen before calling this function, use getSelectedData() for the selection
    const computeSVMBorderWeights = (c1: IDataPoint[], c2: IDataPoint[]) => {
      if (![1, 2].includes(c1[0].length) || ![1, 2].includes(c2[0].length)) {
        console.log(
          "ERROR: Calles SVM with wrong input dimensions. Maybe you have not selected the 2 or 1 distincitive features"
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
      return w;
    };
    const getDiffLineGenerator = (w: { w: number[]; b: number }) => {
      if (w.w.length != 2) {
        console.log(
          "ERROR: tried to compute Line Generator with dimensions: " +
            w.w.length
        );
      }
      return (
        x: number // X*w +b = x0*w0+x1*w1 + b = pred = 0,  so therefore
      ) => (x * w["w"][0] + w["b"]) / -w["w"][1]; // "y" = x1 = -(x0*w0+b)/w1
    };
    const getDiffPoint = (w: { w: number[]; b: number }) => {
      if (w.w.length != 1) {
        console.log(
          "ERROR: tried to compute Diff Point with dimensions: " + w.w.length
        );
      }
      return -w.b / w.w[0]; // X*w +b = x0*w0 + b = pred = 0,  so therefore x0 = -b/w0
    };
    //compute line
    const svmBorderWeights = computeSVMBorderWeights(
      ...selectDimSelectClassDataScaled()
    );

    //on click add point
    const onClickHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
      const cursorpt = getSVGCoords(evt);
      if (typeof overwriteClickHandler == "function") {
        // overwrite the normal click handler with overwriteclickhandler if it exists
        overwriteClickHandler(cursorpt);
      } else if (!enableUserDraw) {
        //only add new points on click if not draw User Line mode
        const pointToAdd = new Array(dimensions).fill(0);
        if (Array.isArray(plot_data.selected_attrib)) {
          //2D case i.e. two axis shown
          const [selectedAttrib1, selectedAttrib2] = plot_data.selected_attrib;
          pointToAdd[selectedAttrib1] = parseFloat(cursorpt!.x.toFixed(4));
          pointToAdd[selectedAttrib2] = parseFloat(cursorpt!.y.toFixed(4));
        } else {
          //plot_data.selected_attrib : number
          pointToAdd[plot_data.selected_attrib] = parseFloat(
            cursorpt!.x.toFixed(4)
          );
        }
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
    const displaySplitLineParam = hideSplitLine ? "none" : "";
    const diffByRobotElement = oneDimensional ? (
      <circle
        cx={getDiffPoint(svmBorderWeights)}
        cy={yOneDimension}
        r="0.3"
        stroke="black"
        strokeWidth="0.09"
      />
    ) : (
      <line
        display={displaySplitLineParam}
        x1={scaleX(xmin)}
        y1={getDiffLineGenerator(svmBorderWeights)(scaleX(xmin))}
        x2={scaleX(xmax)}
        y2={getDiffLineGenerator(svmBorderWeights)(scaleX(xmax))}
        stroke="black"
        strokeWidth="5"
        strokeLinecap="butt"
        vectorEffect="non-scaling-stroke"
      />
    );
    const svgCircles = classPoints.map((points, cl_index) =>
      points.map((p, points_index) => {
        const xs = scaleX(p[0]);
        const ys = oneDimensional ? yOneDimension : scaleY(p[1]);
        return (
          <circle
            key={"c" + cl_index + "p" + points_index}
            cx={xs}
            cy={ys}
            r="0.3"
            stroke="black"
            strokeWidth="0.09"
            fill={colors[cl_index]}
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
    const xAxisPointsScaled = xAxisPoints.map((x) => scaleX(x)); //scale points before putting them in svg
    const yValueXAxis = oneDimensional ? yOneDimension : ymin - 0.5; //y value where the x axis is displayed
    const yValueXAxisScaled = yValueXAxis; //no need to scale ymin
    const xTicks = xAxisPointsScaled.map((x, i) =>
      tickLine(
        x,
        yValueXAxisScaled,
        x,
        yValueXAxisScaled - 0.2,
        "xTicks-" + i + "-" + x
      )
    );
    const xAxis = axisLine(
      xAxisPointsScaled[0] - 1,
      yValueXAxisScaled,
      xAxisPointsScaled[xAxisPoints.length - 1] + 1,
      yValueXAxisScaled,
      "xAxis-Key"
    );
    const xLabels = xAxisPoints.map((x, i) => (
      <text
        key={"xLabel-" + i + "-" + x}
        x={xAxisPointsScaled[i] - 0.1} //take label from xAxisPoints but take point from scaled version
        y={-yValueXAxisScaled + 0.5}
        fill="black"
        fontSize="0.3"
      >
        {x}
      </text>
    ));
    const yAxisPoints = oneDimensional //only render y axis if two dimensional
      ? []
      : [
          Math.round(ymin),
          Math.round(ymin + (ymax - ymin) / 2),
          Math.round(ymax),
        ];
    const yAxisPointsScaled = yAxisPoints.map((y) => scaleY(y)); //scale points before putting them in svg
    const xValueYAxis = xmin - 0.5;
    const xValueYAxisScaled = xValueYAxis; //no need to scale xmin
    const yTicks = oneDimensional ? ( //only render y ticks if two dimensional
      <div></div>
    ) : (
      yAxisPointsScaled.map((y, i) =>
        tickLine(
          xValueYAxisScaled,
          y,
          xValueYAxisScaled - 0.2,
          y,
          "yTicks-" + i + " " + y
        )
      )
    );
    const yAxis = oneDimensional ? ( //only render y axis if two dimensional
      <></>
    ) : (
      axisLine(
        xValueYAxisScaled,
        yValueXAxisScaled,
        xValueYAxisScaled,
        yAxisPointsScaled[yAxisPointsScaled.length - 1] + 1,
        "yAxis-Key"
      )
    );
    const yLabels = oneDimensional ? ( //only render y labels if two dimensional
      <div></div>
    ) : (
      yAxisPoints.map(
        (
          y,
          i //take label from yAxisPoints but take point from scaled version
        ) => (
          <text
            key={"yLabel-" + i + "-" + y}
            x={xValueYAxisScaled - 0.5}
            y={-yAxisPointsScaled[i] + 0.1}
            fill="black"
            fontSize="0.3"
          >
            {y}
          </text>
        )
      )
    );
    const svgPadding = 2; //padding arround the svg elements
    useKeyPress();
    return (
      <div>
        <div>
          X-Axis
          <div>
            {plot_data.attrib.map((str, index) => (
              <button
                key={str + index}
                onClick={() =>
                  setSelectedAttrib(
                    index,
                    Array.isArray(plot_data.selected_attrib) //if 2D
                      ? plot_data.selected_attrib[1]
                      : undefined
                  )
                }
                style={
                  Array.isArray(plot_data.selected_attrib) //if 2D
                    ? plot_data.selected_attrib[0] == index
                      ? { backgroundColor: "#8db8cc" }
                      : {}
                    : {}
                }
              >
                {str}
              </button>
            ))}
          </div>
        </div>

        {oneDimensional ? (
          <></>
        ) : (
          <div>
            Y-Axis
            <div>
              {plot_data.attrib.map((str, index) => (
                <button
                  key={str + index}
                  onClick={() =>
                    setSelectedAttrib(
                      Array.isArray(plot_data.selected_attrib) //if 2D
                        ? plot_data.selected_attrib[0]
                        : index,
                      index
                    )
                  }
                  style={
                    Array.isArray(plot_data.selected_attrib) //if 2D
                      ? plot_data.selected_attrib[1] == index
                        ? { backgroundColor: "#8db8cc" }
                        : {}
                      : {}
                  }
                >
                  {str}
                </button>
              ))}
            </div>
          </div>
        )}
        <svg
          height="100%"
          width="100%"
          onClick={onClickHandler}
          onMouseDown={onMouseDownHandler}
          onMouseUp={onMouseUpHandler}
          onMouseMove={onMouseMoveHandler}
          onKeyDown={onKeyDownHandler}
          viewBox={
            scaleX(xmin) -
            svgPadding +
            " " +
            (-scaleY(ymax) - svgPadding) +
            " " +
            (scaleX(xmax) - scaleX(xmin) + 2 * svgPadding) +
            " " +
            (scaleY(ymax) - scaleY(ymin) + 2 * svgPadding)
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
            {svgCircles}
            {/* Differentiation by robot */}
            {diffByRobotElement}
            {/* User Line */}
            <line
              {...(typeof userLineState !== "undefined"
                ? {
                    x1: scaleX(userLineState.x1),
                    x2: scaleX(userLineState.x2),
                    y1: scaleY(userLineState.y1),
                    y2: scaleY(userLineState.y2),
                  }
                : {})}
              stroke="rgb(0, 153, 51)"
              strokeWidth="5"
              strokeLinecap="butt"
              vectorEffect="non-scaling-stroke"
            />
            {/* User Point */}
            {typeof previewUserPoint !== "undefined" &&
            typeof userPointXState !== "undefined" ? (
              <circle
                cx={scaleX(userPointXState)}
                cy={yOneDimension}
                r="0.3"
                stroke="green"
                strokeWidth="0.09"
              />
            ) : (
              <></>
            )}
          </g>
        </svg>
      </div>
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
