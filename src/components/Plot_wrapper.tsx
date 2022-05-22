import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import {
  ScatterPlotCustomSvgLayer,
  ScatterPlotLayerProps,
} from "@nivo/scatterplot";
import MyPlot from "./MyPlot"
import { IDataPoint, IData, IDataGroup } from "../Data";
import { computeLine } from "./Math";
import { line } from "d3-shape";

const svmjs = require("svm");

const stv = (points:[number,number][]):[number,number] => {
  // E((X_i - E(X_i)) * (Y_i - E(Y_i)))
  // sum (xi[0]-mean[0]) * (xi[1]-mean[1]) /n
  const [m0,m1] = mean(points);
  var r00 = 0
  var r11 = 0
  for (let i = 0; i < points.length; i++) {
    r00 += (points[i][0]-m0)**2
    r11 += (points[i][1]-m1)**2
  }
  r00 /= points.length
  r11 /= points.length
  return [Math.sqrt(r00)/2,Math.sqrt(r11)/2]
}

const mean = (points:[number,number][]):[number,number]=> {
  var mean: [number,number] = [0,0];
  for (let i = 0; i < points.length; i++) {
    mean[0] += points[i][0];
    mean[1] += points[i][1];
  }
  mean[0] /= points.length
  mean[1] /= points.length
  return mean;
}

const LineLayer: ScatterPlotCustomSvgLayer<IDataPoint> = ({
  nodes,
}: ScatterPlotLayerProps<IDataPoint>): JSX.Element => {
  const lineGenerator = line();
  // .x((d, i, a) => {
  //   console.log("This is d:",d);
  //   return xScale(i) + a.length / 2;
  // })
  // .y((d, i, a) => yScale(i));

  //const nodes_array : [number,number, string|number][]  = nodes.map(({ x, y, serieId }) => [x, y, serieId])
  //const cb = computeLine(nodes_array);

  const xy_renorm:[number,number][] = [[0,0]]
  return (
    <path d={lineGenerator(xy_renorm)!} fill="none" stroke="rgba(200, 30, 15, 1)" />
  );
};
// const createLineLayer = (
//   l: IDataPoint[]
// ): ((nodes: ScatterPlotLayerProps<IDataPoint>) => JSX.Element) => {
//   return (nodes: ScatterPlotLayerProps<IDataPoint>) => {
//     const lineGenerator = line().x(d => xScale(d.data.index) + d.width / 2).y(d => yScale(d.data.data.lineValue));;
//     return (
//       <path d={lineGenerator(l.map(({x, y}) => [x, y]))!} fill="none" stroke="rgba(200, 30, 15, 1)" />
//     );
//   };
// };

const computeLinePoints = ([c1,c2]:[IDataGroup,IDataGroup]) => {
  const data = [...c1["data"].map(({x,y})=>[x,y]),...c2["data"].map(({x,y})=>[x,y])];
  const labels: [number][] = [...new Array(c1["data"].length).fill(-1),...new Array(c2["data"].length).fill(1)];
  const svm = new svmjs.SVM();
  const trainstats = svm.train(data, labels, { kernel: 'linear', C: 1}); // C is a parameter to SVM
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
  const w = svm.getWeights()
  const xses = [-5,-2,0,2,5]
  const line_generator = (x:number)=> (x*w["w"][0]+w["b"])/(-w["w"][1])
  return line_generator
}

const Plot_wrapper = ({ plot_data, addPoint}: { plot_data: IData, addPoint:(xVal:number,yVal:number,id:string)=>void}) => {
  //const LineLayer = createLineLayer(plot_data.line);
  plot_data["line"] = computeLinePoints(plot_data.data as [IDataGroup,IDataGroup])
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div style={{ position: "absolute", height: "100%", width: "100%" }}>
        {/* <ResponsiveScatterPlot
          data={plot_data.data}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          xScale={{ type: "linear", min: "auto" }}
          layers={[
            "grid",
            "axes",
            "nodes",
            "markers",
            "mesh",
            "legends",
            LineLayer,
          ]}
        /> */}
        <MyPlot plot_data={plot_data} addPoint={addPoint}/>
      </div>
    </div>
  );
};
export default Plot_wrapper;
