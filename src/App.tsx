import "./App.css";
import { Button, Card, Center, Grid, Stack, Title, Text, Kbd } from "@mantine/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

import RobotWrapper from "./components/RobotWrapper";
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
          <Route
            path=""
            element={
              <Stack>
                {gameTitle}
                <Link to="/level-selection">
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
                      Benutze die <Kbd>Knöpfe</Kbd> oben rechts um die Attribute
                      auszuwählen, die auf den Axen angezeigt werden
                    </Text>
                    <Text>
                      Du kannst auch auf die <Kbd>Tabellen</Kbd> der Klassen links klicken, um
                      die Klassen auszuwählen die du klassifizieren möchtest.
                      Die ausgewählten Klassen sind golden umrandet.
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
