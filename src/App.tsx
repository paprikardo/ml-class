import {
  IData,
  default2DDataSpread,
  IDataPoint,
  irisDataset,
  ki67positiveZellen,
} from "./Data";
import { useState } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import Layout1DUserLine from "./components/Layout1DUserLine";
import { SimpleGrid } from "@mantine/core";
import TableWrapper from "./components/TableWrapper";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { randomPoint, rand_0_10_point } from "./Random";
import { parse } from "papaparse";
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
      addPoint(i, randomPoint(cl_mean, variance));
    });
  };
  //adds a point to the Data.data array (i.e. the cl'th class/group)
  const addPoint = (cl: number, new_point: IDataPoint): void => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      newPrev.data = [...prev.data];
      newPrev.data[cl] = { ...prev.data[cl] };
      newPrev.data[cl].points = [...prev.data[cl].points, new_point]; //adding new point
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
  //sets the selected attributes (selected to being displayed in the plot) to xAxisAttrib and yAxisAttrib
  const setSelectedAttrib = (xAxisAttrib: number, yAxisAttrib: number) => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      newPrev.selected_attrib = [xAxisAttrib, yAxisAttrib];
      return newPrev;
    });
  };
  //sets the selected classes (selected to the classification) to class1 and class2
  const setSelectedClasses = (class1: number, class2: number) => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      newPrev.selected_class = [class1, class2];
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
  const setKi67Data = () => {
    setCurrentData(ki67positiveZellen);
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
    for (i = 0; i < numClasses; i++) {
      cls_points.push([]);
    }
    cls_points.forEach((cl_points, index) => {
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
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/">
            <div>Robot Line</div>
          </Link>
          <Link to="/userline"><div>User Line</div></Link>
          <Link to="/oneD"> oneD</Link>
        </nav>
        <div>
          <button onClick={newRandomData}>Generiere neue Daten</button>
          <button onClick={setIrisData}>Iris Dataset</button>
          <button onClick={setKi67Data}>Ki67 Dataset</button>
        </div>
        <SimpleGrid cols={2} spacing="xs">
          <TableWrapper
            plot_data={currentData}
            change_data={changePoint}
            new_random_data={newRandomData}
            set_iris_data={setIrisData}
            setSelectedClasses={setSelectedClasses}
            selectedClasses={currentData.selected_class}
          ></TableWrapper>
          <Routes>
            <Route
              path="/"
              element={
                <Layout2DRobotLine
                  currentData={currentData}
                  changeNewPoint={changeNewPoint}
                  addPoint={addPoint}
                  setSelectedAttrib={setSelectedAttrib}
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
                  setSelectedAttrib={setSelectedAttrib}
                ></Layout2DUserLine>
              }
            ></Route>
            <Route
              path="/oneD"
              element={
                <Layout1DUserLine
                  currentData={currentData}
                  changePoint={changePoint}
                  addPoint={addPoint}
                  setDataSinglePoint={setDataSinglePoint}
                  addRandomPoint={addRandomPoint}
                  setSelectedAttrib={setSelectedAttrib}
                ></Layout1DUserLine>
              }
            ></Route>
          </Routes>
        </SimpleGrid>
      </Router>
    </div>
  );
}

export default App;
