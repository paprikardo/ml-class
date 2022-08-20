import { IData, default2DDataSpread, IDataPoint, empty2DData } from "./Data";
import { useState, useEffect } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import { SimpleGrid } from "@mantine/core";
import TableWrapper from "./components/TableWrapper";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { randn_bm, rand_0_10, randomPoint, rand_0_10_point } from "./Random";
import { parse } from "papaparse";
import { trace } from "console";
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
    cls_points.map((cl_points, index) => {
      for (var i = 0; i < numSamples; i++) {
        cl_points.push(randomPoint(means[index], variance));
      }
    });
    setCurrentData((prev) => {
      const newData: IData = { ...prev };
      cls_points.forEach((cl_points, i) => {
        newData.data[i].points = cl_points;
      });
      console.log(newData);
      return newData;
    });
  };
  //import data from a csv file
  const importNewData: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    //parse csv file given by event.target.files[o]
    if (event.target.files != null) {
      const file = event.target.files[0];
      parse(file, {
        skipEmptyLines: true,
        complete: (results) => {
          const res = results.data
          console.log((res));
          if(res.length>=2){
            if(Array.isArray(res[0]) && Array.isArray(res[1])){
              const r0 = res[0].filter((v, i, a) => a.indexOf(v) === i);//filters duplicates out of array
            }
            else{
              console.log("ERROR: Parsing failed")
            }
          }
          else{
            console.log("ERROR: CSV has to contain more than two rows")
          }
        },
      });
    } else {
      console.log("ERROR, No CSV file found");
    }
  };
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
            import_new_data={importNewData}
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
