//*TODO: used viewbox to scale points appropriately. How to find coordinates in viewbox? */



import { IData } from "../Data";
const boxmargin = 10; //border in percent

var pt: DOMPoint | undefined = undefined;
var screenctm: any = null;

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

  const onClickHandler = (evt: React.MouseEvent<SVGSVGElement>) => {
    console.log("clicked");
    if (pt == null) {
      console.log("NULL ERROR");
    } else {
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      // The cursor point, translated into svg coordinates
      var cursorpt = pt.matrixTransform(screenctm.inverse());
      addPoint(cursorpt.x,cursorpt.y,"Kerbel")
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
      viewBox={xmin+" "+ymin+" "+(xmax-xmin)+" "+(ymax-ymin)}
      ref={(ref) => {
        pt = ref?.createSVGPoint();
        screenctm = ref?.getScreenCTM();
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
        x1={xmin}
        y1={plot_data["line"](xmin)}
        x2={xmax}
        y2={plot_data["line"](xmax)}
        stroke="black"
        strokeWidth="5"
        strokeLinecap="butt"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default myPlot;
