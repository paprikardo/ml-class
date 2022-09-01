import { IData, IDataPoint, irisDataset, ki67positiveZellen } from "./Data";
import { useState } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import Layout1DUserLine from "./components/Layout1DUserLine";
import { Button, Center, Grid, SimpleGrid } from "@mantine/core";
import TableWrapper from "./components/TableWrapper";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import { randomPoint, rand_0_10_point } from "./Random";
import { parse } from "papaparse";
import LevelWeizen2 from "./levels/LevelWeizen2";
import LevelUserLineGame from "./levels/LevelUserLineGame2D";
function App() {
  const [currentData, setCurrentData] = useState(irisDataset);
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
  const setSelectedAttrib = (xAxisAttrib: number, yAxisAttrib?: number) => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      if (
        Array.isArray(newPrev.selected_attrib) &&
        typeof yAxisAttrib !== "undefined"
      ) {
        newPrev.selected_attrib = [xAxisAttrib, yAxisAttrib];
      } else if (
        typeof newPrev.selected_attrib == "number" &&
        typeof yAxisAttrib == "undefined"
      ) {
        newPrev.selected_attrib = xAxisAttrib;
      } else {
        console.log(
          "Error: Inconsistency in selected Attrib. Called setSelected Attrib with wrong args"
        );
      }
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
  //levels
  interface ILevel {
    initModalTitle: string;
    initModalContent: string;
    level: (title: string, content: string) => JSX.Element;
    link: string;
  }

  const levels: ILevel[] = [
    {
      initModalTitle: "Sind die Weizen-Daten linear separierbar?",
      initModalContent: "Von zwei Weizenarten wurden von je 70 Körnern die Breite, Länge und Fläche vermessen. Finde die Messung mit der sich die beiden Klassen perfekt linear separieren lassen.",
      level: (title, content) => (
        <LevelWeizen2
          currentData={currentData}
          setDataSinglePoint={setDataSinglePoint}
          setSelectedAttrib={setSelectedAttrib}
          setCurrentData={setCurrentData}
          initModalTitle={title}
          initModalContent={content}
        />
      ),
      link: "weizen2",
    },
    {
      initModalTitle: "Klassifizieren in 2D",
      initModalContent:
        "Versuche die zwei dimensionalen Punkte zu klassifizieren. Klicke und ziehe mit der Maus und versuche die beiden Punktwolken (von Klasse 1 und von Klasse 2) voneinander zu separieren. Sind die zwei Klassen linear separierbar?",
      level: (title, content) => (
        <LevelUserLineGame
          currentData={currentData}
          setDataSinglePoint={setDataSinglePoint}
          setSelectedAttrib={setSelectedAttrib}
          addRandomPoint={addRandomPoint}
          initModalTitle={title}
          initModalContent={content}
          setCurrentData={setCurrentData}
          dimensions={2}
        ></LevelUserLineGame>
      ),
      link: "klass2D",
    },
    {
      initModalTitle: "Klassifizieren in 3D",
      initModalContent:
        "Versuche die drei dimensionalen Punkte zu klassifizieren. Klicke und ziehe mit der Maus und versuche die beiden Punktwolken (von Klasse 1 und von Klasse 2) voneinander zu separieren. Sind die zwei Klassen linear separierbar?",
      level: (title, content) => (
        <LevelUserLineGame
          currentData={currentData}
          setDataSinglePoint={setDataSinglePoint}
          setSelectedAttrib={setSelectedAttrib}
          addRandomPoint={addRandomPoint}
          initModalTitle={title}
          initModalContent={content}
          setCurrentData={setCurrentData}
          dimensions={3}
        ></LevelUserLineGame>
      ),
      link: "klass3D",
    },
  ];
  const levelButtons = levels.map(
    ({ initModalTitle, initModalContent, level, link }) => (
      <Link to={"/level/" + link} key={link + "-link"}>
        <Grid.Col span={4}>
          <Button>{initModalTitle}</Button>
        </Grid.Col>
      </Link>
    )
  );
  const levelRoutes = levels.map(
    ({ initModalTitle, initModalContent, level, link }) => (
      <Route
        path={link}
        element={level(initModalTitle, initModalContent)}
        key={link + "-route"}
      ></Route>
    )
  );
  return (
    <div className="App">
      <Router>
        {/* <div>
          <button onClick={newRandomData}>Generiere neue Daten</button>
          <button onClick={setIrisData}>Iris Dataset</button>
          <button onClick={setKi67Data}>Ki67 Dataset</button>
        </div> */}
        <Routes>
          <Route
            path=""
            element={<Link to="/level-selection"> start</Link>}
          ></Route>
          <Route
            path="level-selection"
            element={
              <Center style={{ width: "100vw", height: "100vh" }}>
                <Grid>{levelButtons}</Grid>
              </Center>
            }
          ></Route>
          <Route
            path="level"
            element={
              <div>
                <Link to="/level-selection">
                  <Button>Exit</Button>
                </Link>
                <SimpleGrid cols={2} spacing="xs">
                  <TableWrapper
                    plot_data={currentData}
                    change_data={changePoint}
                    new_random_data={newRandomData}
                    set_iris_data={setIrisData}
                    setSelectedClasses={setSelectedClasses}
                    selectedClasses={currentData.selected_class}
                  ></TableWrapper>
                  <Outlet></Outlet>
                </SimpleGrid>
              </div>
            }
          >
            {levelRoutes}
            <Route
              path="robot"
              element={
                <Layout2DRobotLine
                  currentData={currentData}
                  changeNewPoint={changeNewPoint}
                  addPoint={addPoint}
                  setSelectedAttrib={setSelectedAttrib}
                ></Layout2DRobotLine>
              }
            ></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
