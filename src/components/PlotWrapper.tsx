import MyPlot from "./MyPlot"
import {IData, IDataGroup } from "../Data";

const svmjs = require("svm");

const computeLinePoints = ([c1,c2]:[IDataGroup,IDataGroup]) => {
  const data = [...c1["data"].map(({x,y})=>[x,y]),...c2["data"].map(({x,y})=>[x,y])];
  const labels: [number][] = [...new Array(c1["data"].length).fill(-1),...new Array(c2["data"].length).fill(1)];
  const svm = new svmjs.SVM();
  //const trainstats = 
  svm.train(data, labels, { kernel: 'linear', C: 1}); // C is a parameter to SVM
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
  const line_generator = (x:number)=> (x*w["w"][0]+w["b"])/(-w["w"][1])
  return line_generator
}

const PlotWrapper = ({ plot_data, addPoint}: { plot_data: IData, addPoint:(xVal:number,yVal:number,id:string)=>void}) => {
  //const LineLayer = createLineLayer(plot_data.line);
  plot_data["line"] = computeLinePoints(plot_data.data as [IDataGroup,IDataGroup])
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div style={{ position: "absolute", height: "100%", width: "100%" }}>
        <MyPlot plot_data={plot_data} addPoint={addPoint}/>
      </div>
    </div>
  );
};
export default PlotWrapper;
