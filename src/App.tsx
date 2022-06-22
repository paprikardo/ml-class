import {
  IData,
  defaultDataSpread,
  IDataPoint,
  CLASS_A,
  CLASS_B,
  emptyData,
} from "./Data";
import { useState, useEffect } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {randn_bm,rand_0_10} from "./Random"
function App() {
  const [currentData, setCurrentData] = useState(defaultDataSpread);
  //adds a random point to both classes CLASS A and CLASS B
  const addRandomPoint = (mean_CLASS_A:IDataPoint,mean_CLASS_B:IDataPoint,variance: number = 2) => {
    addPoint(
      randn_bm(mean_CLASS_A.x, variance),
      randn_bm(mean_CLASS_A.y, variance),
      CLASS_A
    );
    addPoint(
      randn_bm(mean_CLASS_B.x, variance),
      randn_bm(mean_CLASS_B.y, variance),
      CLASS_B
    );
  };
  
  const addPoint = (xVal: number, yVal: number, id: string): void => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      const newPrevData = { ...prev.data };
      const group = newPrevData[id];
      if (group === undefined) {
        console.log("UNDEFINED ERROR");
      } else {
        const newGroup = [...group, { x: xVal, y: yVal }];
        newPrev.data = newPrevData;
        newPrev.data[id] = newGroup;
      }
      return newPrev; //return same object with new reference so rerender triggers
    });
  };
  const changePoint = (
    id: string,
    key: number,
    new_point: IDataPoint
  ): void => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      const newPrevData = { ...prev.data };
      const group = newPrevData[id];
      if (group === undefined) {
        console.log("UNDEFINED ERROR");
      } else {
        group[key] = new_point;
      }
      const newGroup = [...group];
      newPrevData[id] = newGroup;
      newPrev.data = newPrevData;
      return newPrev;
    });
  };
  const setDataEmpty = () => {
    setCurrentData(emptyData);
  }
  const newRandomData = () => {
    const numSamples = 5;
    const variance = 2;
    const m1 = { x: rand_0_10(), y: rand_0_10() };
    const m2 = { x: rand_0_10(), y: rand_0_10() };
    const points1: IDataPoint[] = [];
    const points2: IDataPoint[] = [];
    for (var i = 0; i < numSamples; i++) {
      points1.push({
        x: randn_bm(m1.x, variance),
        y: randn_bm(m1.y, variance),
      });
      points2.push({
        x: randn_bm(m2.x, variance),
        y: randn_bm(m2.y, variance),
      });
    }
    setCurrentData((prev) => {
      const newData: IData = {
        data: { ...prev.data },
        line: () => 0,
      };
      newData.data[CLASS_A] = points1;
      newData.data[CLASS_B] = points2;
      console.log(newData);
      return newData;
    });
  };

  //compute line classifier
  const svmjs = require("svm");

  const computeLinePoints = (c1: IDataPoint[], c2: IDataPoint[]) => {
    const data = [
      ...c1.map(({ x, y }) => [x, y]),
      ...c2.map(({ x, y }) => [x, y]),
    ];
    const labels: [number][] = [
      ...new Array(c1.length).fill(-1),
      ...new Array(c2.length).fill(1),
    ];
    const svm = new svmjs.SVM();
    //const trainstats =
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
        prevCopy.line = computeLinePoints(
          prev.data[CLASS_A],
          prev.data[CLASS_B]
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
            <Link to="/userline">
              User Line
            </Link>
          </div>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <Layout2DRobotLine
                currentData={currentData}
                changePoint={changePoint}
                addPoint={addPoint}
                new_random_data={newRandomData}
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
                new_random_data={newRandomData}
                setDataEmpty={setDataEmpty}
                addRandomPoint={addRandomPoint}
              ></Layout2DUserLine>
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
