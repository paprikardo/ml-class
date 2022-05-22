//*TODO: used viewbox to scale points appropriately. How to find coordinates in viewbox? */



import { IData } from "../Data";
const boxmargin = 10; //border in percent

const scaleX = (x: number, xmin: number, xmax: number): number => {
  return x
  // const len_intervall = xmax - xmin;
  // const percent = (x - xmin) / len_intervall;
  // //console.log("mapped ", x, " to ", percent);
  // // 100*x+b = 100-b
  // // 100*x = 100-2b
  // // x = 1-2b/100
  // return percent * 100 * (1 - (2 * boxmargin) / 100) + boxmargin + "%";
};
const scaleY = (y: number, ymin: number, ymax: number): number => {
  return scaleX(y, ymin, ymax);
};
const scaleXInv = (x: number, xmin: number, xmax: number): number => {
  const len_intervall = xmax - xmin;
  const percent = (x - boxmargin/100) / ((1 - (2 * boxmargin) / 100))
  return percent*len_intervall+xmin
};
const scaleYInv = (y: number, ymin: number, ymax: number): number => {
  return scaleXInv(y, ymin, ymax);
};

var pt: DOMPoint | undefined = undefined;
var screenctm: any = null;
var svg_bbox: any = undefined;
var xBlue = 1
var yBlue = 1

const myPlot = ({
  plot_data,
  addPoint,
}: {
  plot_data: IData;
  addPoint: (xVal:number,yVal:number,id:string)=>void;
}) => {
  const class1 = plot_data.data[0];
  const class2 = plot_data.data[1];
  const all_data_x = [
    ...class1.data.map(({ x, y }, index) => x),
    ...class2.data.map(({ x, y }, index) => x),
  ];
  const all_data_y = [
    ...class1.data.map(({ x, y }, index) => y),
    ...class2.data.map(({ x, y }, index) => y),
  ];
  const xmin = Math.min(...all_data_x);
  const xmax = Math.max(...all_data_x);
  const ymin = Math.min(...all_data_y);
  const ymax = Math.max(...all_data_y);

  const addPointFromPercent = (x: number, y: number): void => {
    xBlue = x
    yBlue = y
    addPoint(
      x,
      y,
      "Kerbel"
    );
  };
  const onClickHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
    console.log("clicked");
    if (pt == null) {
      console.log("NULL ERROR");
    } else {
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      // The cursor point, translated into svg coordinates
      var cursorpt = pt.matrixTransform(screenctm.inverse());
      addPointFromPercent(cursorpt.x,cursorpt.y)
    }
  };

  const points1 = class1.data.map(({ x, y }, index) => (
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
  const points2 = class2.data.map(({ x, y }, index) => (
    <circle
      key={"c2" + index}
      cx={x}
      cy={y}
      r="0.3"
      stroke="black"
      strokeWidth="0.09"
      fill="red"
    />
  ));

  return (
    <svg
      height="100%"
      width="100%"
      onClick={onClickHandler}
      viewBox={xmin+" "+ymin+" "+xmax+" "+ymax}
      ref={(ref) => {
        pt = ref?.createSVGPoint();
        screenctm = ref?.getScreenCTM();
        svg_bbox = ref?.getBBox();
      }}
    >
      {points1}
      {points2}
      <circle
      cx={xBlue}
      cy={yBlue}
      r="0.3"
      stroke="black"
      strokeWidth="0.09"
      fill="blue"
    />
      <line
        x1={scaleX(xmin, xmin, xmax)}
        y1={scaleY(plot_data["line"](xmin), ymin, ymax)}
        x2={scaleX(xmax, xmin, xmax)}
        y2={scaleY(plot_data["line"](xmax), ymin, ymax)}
        stroke="black"
        strokeWidth="5"
        strokeLinecap="butt"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default myPlot;
