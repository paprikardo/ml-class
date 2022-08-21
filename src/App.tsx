import {
  IData,
  default2DDataSpread,
  IDataPoint,
  irisDataset,
  NEW_POINT,
} from "./Data";
import { useState } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import { SimpleGrid } from "@mantine/core";
import TableWrapper from "./components/TableWrapper";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { randomPoint, rand_0_10_point } from "./Random";
import { parse } from "papaparse";
import RobotWrapper from "./components/RobotWrapper";
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
    means.forEach((cl_mean, i) => {
      console.log(cl_mean,i);
      addPoint(i, randomPoint(cl_mean, variance));
    });
    console.log("----",currentData)
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
      return newPrev;
    });
  };
  const changeNewPoint = (new_point: IDataPoint): void => {
    setCurrentData((prev) => {
      prev.newPoint = new_point;
      const newPrev = { ...prev };
      return newPrev;
    });
  };
  const setDataSinglePoint = (means: IDataPoint[]) => {
    setCurrentData((prev): IData => {
      return {
        data: prev.data.map((cl, cl_index) => {
          return {
            className: cl.className,
            points: [randomPoint(means[cl_index])],
          };
        }),
        selected_attrib: prev.selected_attrib,
        selected_class: prev.selected_class,
        newPoint: prev.newPoint,
        attrib: prev.attrib,
      };
    });
  };
  const setIrisData = () => {
    setCurrentData(irisDataset);
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
          const res = results.data;
          if (res.length >= 2) {
            if (Array.isArray(res[0]) && Array.isArray(res[1])) {
              const r0 = res[0].filter((v, i, a) => a.indexOf(v) === i); //filters duplicates out of array
            } else {
              console.log("ERROR: Parsing failed");
            }
          } else {
            console.log("ERROR: CSV has to contain more than two rows");
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
          <Link to="/">
            <div>Robot Line</div>
          </Link>
          <Link to="/userline">User Line</Link>
        </nav>
        <div>
          <button onClick={newRandomData}>Generiere neue Daten</button>
          <button onClick={setIrisData}>Iris Dataset</button>
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={importNewData}
          ></input>
        </div>
        <SimpleGrid cols={2} spacing="xs">
          <TableWrapper
            plot_data={currentData}
            change_data={changePoint}
            new_random_data={newRandomData}
            import_new_data={importNewData}
            set_iris_data={setIrisData}
          ></TableWrapper>
          <Routes>
            <Route
              path="/"
              element={
                <Layout2DRobotLine
                  currentData={currentData}
                  changeNewPoint={changeNewPoint}
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
                  setDataSinglePoint={setDataSinglePoint}
                  addRandomPoint={addRandomPoint}
                ></Layout2DUserLine>
              }
            ></Route>
          </Routes>
          <RobotWrapper class_result="result"></RobotWrapper>
        </SimpleGrid>
      </Router>
    </div>
  );
}

export default App;
