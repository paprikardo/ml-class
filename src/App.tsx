import "./App.css";
import { Card, Center, Grid, Stack, Title, Text, Kbd } from "@mantine/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

import RobotWrapper from "./components/smallerComponents/RobotWrapper";
import {
  generateButtonFromLevel,
  getAllLevelSections,
  getAllLevelRoutes,
} from "./components/levels/Levels";
import BackToLevelSelectionButton from "./components/smallerComponents/BackToLevelSelectionButton";
import PageNotFound from "./components/smallerComponents/PageNotFound";
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
          <Route path="ml-class" element={<Outlet></Outlet>}>
            <Route
              path=""
              element={
                <Stack>
                  {gameTitle}
                  <Link to="/ml-class/level-selection">
                    <Stack justify="flex-start" align="center">
                      <RobotWrapper
                        notSticky
                        message={<>Bist du bereit?</>}
                      ></RobotWrapper>
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
                      <Title order={4}>Wie man spielt:</Title>
                      <Text>
                        Mit den <Kbd>Knöpfe</Kbd> oben rechts kannst du die
                        Attribute auswählen, die auf den Achsen angezeigt werden.
                      </Text>
                      <Text>
                        Die <Kbd>Tabellen</Kbd> links zeigen den Datensatz. Du
                        kannst auf eine <Kbd>Tabelle</Kbd>
                        klicken, um diese Klasse rechts im Koordinatensystem
                        anzuzeigen. Die Tabellen der ausgewählten Klassen sind
                        golden umrandet.
                      </Text>
                      <RobotWrapper
                        message={<>Welches Level möchtest du spielen?</>}
                        notSticky
                      ></RobotWrapper>
                      {allLevelSections.map(({ sectionHeader, levels }) => {
                        return (
                          <div key={sectionHeader.key + "section"}>
                            {sectionHeader}
                            <Grid justify="center">
                              {levels.map((l) => generateButtonFromLevel(l))}
                            </Grid>
                          </div>
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
                  <BackToLevelSelectionButton />
                  <Outlet></Outlet>
                </Stack>
              }
            >
              {getAllLevelRoutes()}
              <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
            </Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
