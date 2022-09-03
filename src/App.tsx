import "./App.css";
import { Button, Card, Center, Grid, Stack, Title, Text } from "@mantine/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

import RobotWrapper from "./components/RobotWrapper";
import { generateButtonFromLevel, getAllLevelRoutes, getAllLevelSections } from "./levels/Levels";
function App() {
  /**
   * samples a random point each from the given mean and variance and adds them to the respective classes
   * @param means - array of means, one for each DataClass
   * @param variance
   */

  const gameTitle = (
    <Card className="GameTitle">
      <Title order={1}>
        Maschinelles Lernen: Punkt- und Linienklassifikatoren
      </Title>
      <Title order={4}>Eine Lernplattform von Ricardo Heinzmann</Title>
    </Card>
  );

  const allLevelSections = getAllLevelSections();

  return (
    <div className="App">
      <Router>
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
                    <RobotWrapper
                      message={<>"Welches Level möchtest du spielen?"</>}
                    ></RobotWrapper>
                    {allLevelSections.map(({ sectionName, levels }) => {
                      return (
                        <>
                          <Title order={4}>{sectionName}</Title>
                          <Grid justify="center">
                            {levels.map((l) => generateButtonFromLevel(l))}
                          </Grid>
                        </>
                      );
                    })}
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
            {getAllLevelRoutes()}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
