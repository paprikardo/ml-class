import { IData, IDataPoint, irisDataset, ki67positiveZellen } from "./Data";
import { useState } from "react";
import "./App.css";
import Layout2DRobotLine from "./components/Layout2DRobotLine";
import Layout2DUserLine from "./components/Layout2DUserLine";
import Layout1DUserLine from "./components/Layout1DUserLine";
import {
  Button,
  Card,
  Center,
  Grid,
  SimpleGrid,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import TableWrapper from "./components/TableWrapper";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import { randomPoint, rand_0_10_point } from "./Others/Random";
import { parse } from "papaparse";
import LevelWeizen2 from "./levels/LevelWeizen2";
import LevelUserLineGame2D from "./levels/LevelUserLineGame2D";
import LevelUserPointGame1D from "./levels/LevelUserPointGame1D";
import LevelRobotLineGame2D from "./levels/LevelRobotLineGame2D";
import RobotWrapper from "./components/RobotWrapper";
import LevelSchierling2D from "./levels/LevelSchierling2D";
import LevelSchierling1D from "./levels/LevelSchierling1D";
function App() {
  const [currentData, setCurrentData] = useState(irisDataset);
  /**
   * samples a random point each from the given mean and variance and adds them to the respective classes
   * @param means - array of means, one for each DataClass
   * @param variance
   */

  //levels
  interface ILevel {
    initModalTitle: string;
    initModalContent: string;
    level: (title: string, content: string) => JSX.Element;
    link: string;
  }
  const pointKlassModalContent = (dim: number) =>
    "Versuche die " +
    dim +
    " dimensionalen Punkte zu klassifizieren. Klicke mit der Maus und versuche die beiden Punktwolken (von Klasse 1 und von Klasse 2) voneinander zu separieren. Sind die zwei Klassen separierbar?";
  const robotKlassModalContent = (dim: number) =>
    "Der Roboter wird versuchen die " +
    dim +
    " dimensionalen Punkte zu klassifizieren. Klicke mit deiner Maus um einen neuen Punkt zu Klasse 1 hinzuzufügen. Drücke zusätzlich Shift um einen neuen Punkt zu Klasse 2 hinzuzufügen";
  const levels: ILevel[] = [
    {
      initModalTitle: "Roboter-Klassifizieren in 2D",
      initModalContent: robotKlassModalContent(2),
      level: (title, content) => (
        <LevelRobotLineGame2D
          initModalTitle={title}
          initModalContent={content}
          dimensions={2}
        ></LevelRobotLineGame2D>
      ),
      link: "robot-klassifizieren-2D",
    },
    {
      initModalTitle: "Roboter-Klassifizieren in 3D",
      initModalContent: robotKlassModalContent(3),
      level: (title, content) => (
        <LevelRobotLineGame2D
          initModalTitle={title}
          initModalContent={content}
          dimensions={3}
        ></LevelRobotLineGame2D>
      ),
      link: "robot-klassifizieren-3D",
    },
    {
      initModalTitle: "Punkt-Klassifizieren in 2D",
      initModalContent: pointKlassModalContent(2),
      level: (title, content) => (
        <LevelUserPointGame1D
          dimensions={2}
          initModalTitle={title}
          initModalContent={content}
        ></LevelUserPointGame1D>
      ),
      link: "punkt-klassifizieren-2D",
    },
    {
      initModalTitle: "Punkt-Klassifizieren in 3D",
      initModalContent: pointKlassModalContent(3),
      level: (title, content) => (
        <LevelUserPointGame1D
          initModalTitle={title}
          initModalContent={content}
          dimensions={3}
        ></LevelUserPointGame1D>
      ),
      link: "punkt-klassifizieren-3D",
    },
    {
      initModalTitle: "Linien-Klassifizieren in 2D",
      initModalContent:
        "Versuche die zwei dimensionalen Punkte zu klassifizieren. Klicke und ziehe mit der Maus und versuche die beiden Punktwolken (von Klasse 1 und von Klasse 2) voneinander zu separieren. Sind die zwei Klassen linear separierbar?",
      level: (title, content) => (
        <LevelUserLineGame2D
          initModalTitle={title}
          initModalContent={content}
          dimensions={2}
        ></LevelUserLineGame2D>
      ),
      link: "linien-klassifizieren-2D",
    },
    {
      initModalTitle: "Linien-Klassifizieren in 3D",
      initModalContent:
        "Versuche die drei dimensionalen Punkte zu klassifizieren. Klicke und ziehe mit der Maus und versuche die beiden Punktwolken (von Klasse 1 und von Klasse 2) voneinander zu separieren. Sind die zwei Klassen linear separierbar?",
      level: (title, content) => (
        <LevelUserLineGame2D
          initModalTitle={title}
          initModalContent={content}
          dimensions={3}
        ></LevelUserLineGame2D>
      ),
      link: "linien-klassifizieren-3D",
    },
  ];
  const datasetLevels: ILevel[] = [
    {
      initModalTitle: "Sind die Weizen-Daten in 1D separierbar?",
      initModalContent:
        "Von zwei Weizenarten wurden von je 70 Körnern die Breite, Länge und Fläche vermessen. Finde die Messung mit der sich die beiden Klassen perfekt linear separieren lassen.",
      level: (title, content) => (
        <LevelWeizen2 initModalTitle={title} initModalContent={content} />
      ),
      link: "weizen2",
    },
    {
      initModalTitle: "Sind die Schierling-Daten in 1D separierbar?",
      initModalContent:
        "Der griechische Philosoph Sokrates wurde im Athen des Jahres 399 v. Chr. zum Tode verurteilt und mit dem Schierlingsbecher hingerichtet. Mit diesem Becher wurde dem Verurteilten ein Getränk verabreicht, das aus einer Pflanze, dem giftigen Gefleckten Schierling, hergestellt wurde. Der Schierling ist für Laien leicht zu verwechseln mit anderen häufig vorkommenden Pflanzen, etwa der Hundspetersilie, die ebenfalls giftig ist, oder dem Wiesen­Kerbel, der ungiftig ist und zum Würzen von Salaten und Wildkräutersuppen verwendet wird. Alle drei Pflanzen haben ähnliche Blätter, blühen in weissen Dolden und bilden längliche Früchte.",
      level: (title, content) => (
        <LevelSchierling1D initModalTitle={title} initModalContent={content} />
      ),
      link: "schierling",
    },
    {
      initModalTitle: "Sind die Schierling-Daten in 2D separierbar?",
      initModalContent:
        "Der griechische Philosoph Sokrates wurde im Athen des Jahres 399 v. Chr. zum Tode verurteilt und mit dem Schierlingsbecher hingerichtet. Mit diesem Becher wurde dem Verurteilten ein Getränk verabreicht, das aus einer Pflanze, dem giftigen Gefleckten Schierling, hergestellt wurde. Der Schierling ist für Laien leicht zu verwechseln mit anderen häufig vorkommenden Pflanzen, etwa der Hundspetersilie, die ebenfalls giftig ist, oder dem Wiesen­Kerbel, der ungiftig ist und zum Würzen von Salaten und Wildkräutersuppen verwendet wird. Alle drei Pflanzen haben ähnliche Blätter, blühen in weissen Dolden und bilden längliche Früchte.",
      level: (title, content) => (
        <LevelSchierling2D initModalTitle={title} initModalContent={content} />
      ),
      link: "schierling2D",
    },
  ];
  const generateButtonFromLevel = (initModalTitle: string, link: string) => (
    <Link to={"/level/" + link} key={link + "-link"}>
      <Grid.Col span={4}>
        <Button>{initModalTitle}</Button>
      </Grid.Col>
    </Link>
  );
  const generateRouteFromLevel = (
    initModalTitle: string,
    initModalContent: string,
    level: (title: string, content: string) => JSX.Element,
    link: string
  ) => (
    <Route
      path={link}
      element={level(initModalTitle, initModalContent)}
      key={link + "-route"}
    ></Route>
  );
  const levelButtons = levels.map(
    ({ initModalTitle, initModalContent, level, link }) =>
      generateButtonFromLevel(initModalTitle, link)
  );
  const datasetLevelButtons = datasetLevels.map(
    ({ initModalTitle, initModalContent, level, link }) =>
      generateButtonFromLevel(initModalTitle, link)
  );
  const allLevelRoutes = levels
    .map(({ initModalTitle, initModalContent, level, link }) =>
      generateRouteFromLevel(initModalTitle, initModalContent, level, link)
    )
    .concat(
      datasetLevels.map(({ initModalTitle, initModalContent, level, link }) =>
        generateRouteFromLevel(initModalTitle, initModalContent, level, link)
      )
    );
  const gameTitle = (
    <Card className="GameTitle">
      <Title order={1}>
        Maschinelles Lernen: Punkt- und Linienklassifikatoren
      </Title>
      <Title order={4}>Eine Lernplattform von Ricardo Heinzmann</Title>
    </Card>
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
            element={
              <Stack>
                {gameTitle}
                <Link to="/level-selection">
                  <Stack justify="flex-start" align="center">
                    <RobotWrapper message={<>Bist du bereit?</>}></RobotWrapper>
                    <Title order={2}>Klicke hier um zu beginnen</Title>
                  </Stack>
                </Link>
              </Stack>
            }
          ></Route>
          <Route
            path="level-selection"
            element={
              <div>
                {gameTitle}
                <Center>
                  <Stack align="center">
                    <RobotWrapper
                      message={<>"Welches Level möchtest du spielen?"</>}
                    ></RobotWrapper>
                    <Title order={4}>Basic Level:</Title>
                    <Grid justify="center">{levelButtons}</Grid>
                    <Title order={4}>Level mit echten Datensätzen:</Title>
                    <Grid justify="center">{datasetLevelButtons}</Grid>
                    <Title order={4}>Wie geht das?:</Title>
                    <Text>
                      Vor jedem Level bekommst du eine kleine Anweisung was zu
                      tun ist
                    </Text>
                    <Text>
                      Wenn du mit einem Level fertig bist, dann klicke oben auf
                      "Zurück zur Level-Auswahl"
                    </Text>
                    <Text>
                      Benutze die Knöpfe oben rechts um die Attribute
                      auszuwählen, die auf den Axen angezeigt werden
                    </Text>
                    <Text>
                      Klicke auf die Tabellen links um die zwei Klassen
                      auszuwählen die du klassifizieren möchtest
                    </Text>
                  </Stack>
                </Center>
              </div>
            }
          ></Route>
          <Route
            path="level"
            element={
              <Stack style={{ paddingTop: "10px" }}>
                <Link to="/level-selection">
                  <Button>Zurück zur Level-Auswahl</Button>
                </Link>

                <Outlet></Outlet>
              </Stack>
            }
          >
            {allLevelRoutes}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
