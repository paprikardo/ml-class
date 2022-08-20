import {
  IData,
  default2DDataSpread,
  IDataPoint,
  CLASS_A,
  CLASS_B,
  empty2DData,
} from "./Data";
import { useState, useEffect } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import { SimpleGrid } from "@mantine/core";
import TableWrapper from "./components/TableWrapper";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { randn_bm, rand_0_10, randomPoint, rand_0_10_point } from "./Random";
function App() {
  const [currentData, setCurrentData] = useState(default2DDataSpread);
  const dimensions = currentData.attrib.length;
  const numClasses = currentData.data.length;
  /**
   * samples a random point each from the given mean and variance and adds them to the respective classes
   * @param means - array of means, one for each DataClass
   * @param variance
   */
  const addRandomPoint = (means: IDataPoint[], variance: number = 2) => {
    means.forEach((cl_mean, i) => addPoint(i, randomPoint(cl_mean, variance)));
  };
  //adds a point to the Data.data array (i.e. the cl'th class/group)
  const addPoint = (cl: number, new_point: IDataPoint): void => {
    setCurrentData((prev) => {
      prev.data[cl].points.push(new_point);
      const newPrev = { ...prev };
      // const newPrevData = [...prev.data];
      // const dataClass = newPrevData[cl];
      // const newDataClassPoints = [...dataClass.points, { x: xVal, y: yVal }];
      // dataClass.points = newDataClassPoints;
      // newPrev.data[id] = newGroup;
      return newPrev; //return same object with new reference so rerender triggers
    });
  };
  //changes a point with the key "key" in the Data.data dictionary with key "id" to "new_point"
  const changePoint = (
    cl: number,
    key: number,
    new_point: IDataPoint
  ): void => {
    setCurrentData((prev) => {
      prev.data[cl].points[key] = new_point;
      const newPrev = { ...prev };
      // const newPrevData = { ...prev.data };
      // const group = newPrevData[id];
      // if (group === undefined) {
      //   console.log("UNDEFINED ERROR");
      // } else {
      //   group[key] = new_point;
      // }
      // const newGroup = [...group];
      // newPrevData[id] = newGroup;
      // newPrev.data = newPrevData;
      return newPrev;
    });
  };
  const setDataEmpty = () => {
    setCurrentData(empty2DData);
  };
  //generates "numSamples" new points for both classes from a random variance and mean
  const newRandomData = () => {
    const numSamples = 5;
    const variance = 2;
    const means: IDataPoint[] = [];
    for (var i = 0; i < currentData.data.length; i++) {
      means.push(rand_0_10_point(dimensions));
    }
    const cls_points: IDataPoint[][] = [];
    for (var i = 0; i < numClasses; i++) {
      cls_points.push([]);
    }
    cls_points.map((cl_points, i) => {
      for (var i = 0; i < numSamples; i++) {
        cl_points.push(randomPoint(means[i], variance));
      }
    });
    setCurrentData((prev) => {
      const newData: IData = { ...prev };
      cls_points.forEach((cl_points,i)=>{newData.data[i].points=cl_points})
      console.log(newData);
      return newData;
    });
  };

  //compute line classifier
  const svmjs = require("svm");
  //c1 and c2 are the arrays of 2D data points, i.e. the selection to 2 features has to happen before calling this function
  const computeSVMBorder = (c1: IDataPoint[], c2: IDataPoint[]) => {
    if(c1[0].length != 2 || c2[0].length != 2){
      console.log("ERROR: Calles SVM with wrong input dimensions. Maybe you have not selected the 2 distincitive features")
    }
    const data = [...c1,...c2]
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
    const line_generator = (x: number) => (x * w["w"][0] + w["b"]) / -w["w"][1];
    return line_generator;
  };
  //compute line and put it in data
  useEffect(
    () =>
      setCurrentData((prev) => {
        const prevCopy = { ...prev };
        prevCopy.line = computeSVMBorder(
          prev.data[CLASS_A].points,
          prev.data[CLASS_B].points
        );
        return prevCopy;
      }),
    [currentData.data]
  );
  return (
    <div className="App">
      <Router>
        <nav>
          <div style={{ height: 50 }}>
            <Link to="/">
              <div style={{ height: "20" }}>Robot Line</div>
            </Link>
            <Link to="/userline">User Line</Link>
          </div>
        </nav>
        <div>DKR DKR</div>
        <SimpleGrid cols={2} spacing="xs">
          <TableWrapper
            plot_data={currentData}
            change_data={changePoint}
            new_random_data={newRandomData}
          ></TableWrapper>
          <Routes>
            <Route
              path="/"
              element={
                <Layout2DRobotLine
                  currentData={currentData}
                  changePoint={changePoint}
                  addPoint={addPoint}
                ></Layout2DRobotLine>
              }
            ></Route>
            <Route
              path="/userline"
              element={
                <Layout2DUserLine
                  currentData={currentData}
                  changePoint={changePoint}
                  addPoint={addPoint}
                  setDataEmpty={setDataEmpty}
                  addRandomPoint={addRandomPoint}
                ></Layout2DUserLine>
              }
            ></Route>
          </Routes>
        </SimpleGrid>
      </Router>
    </div>
  );
}

export default App;
