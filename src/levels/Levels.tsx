import LevelUserLineGame2D from "./LevelUserLineGame2D";
import LevelUserPointGame1D from "./LevelUserPointGame1D";
import LevelRobotLineGame2D from "./LevelRobotLineGame2D";
import { Link, Route } from "react-router-dom";
import { Button, Grid } from "@mantine/core";
import RealDataLevel1D from "./realDataLevel1D";
import { gegenstaendeDataset, irisDataset, schierlingDataset, weinsortenDataset, weizen2Dataset } from "../Data";
import RealDataLevel2D from "./realDataLevel2D";

interface ILevel {
  initModalTitle: string;
  initModalContent: string;
  getLevelComponent: (title: string, content: string) => JSX.Element;
  link: string;
}
interface ILevelSection {
  sectionName: string;
  levels: ILevel[];
}

const pointKlassModalContent = (dim: number) =>
  "Versuche die " +
  dim +
  " dimensionalen Punkte zu klassifizieren. Klicke mit der Maus und versuche die beiden Punktwolken (von Klasse 1 und von Klasse 2) voneinander zu separieren. Sind die zwei Klassen separierbar?";
const robotKlassModalContent = (dim: number) =>
  "Der Roboter wird versuchen die " +
  dim +
  " dimensionalen Punkte zu klassifizieren. Klicke mit deiner Maus um einen neuen Punkt zu Klasse 1 hinzuzufügen. Drücke zusätzlich Shift um einen neuen Punkt zu Klasse 2 hinzuzufügen";

export const generateButtonFromLevel = (level: ILevel) => (
  <Link to={"/level/" + level.link} key={level.link + "-link"}>
    <Grid.Col span={4}>
      <Button>{level.initModalTitle}</Button>
    </Grid.Col>
  </Link>
);
export const generateRouteFromLevel = (level: ILevel) => (
  <Route
    path={level.link}
    element={level.getLevelComponent(
      level.initModalTitle,
      level.initModalContent
    )}
    key={level.link + "-route"}
  ></Route>
);
//    RANDOM DATA
//Robot classsification levels
const levelRoboter: ILevel[] = [
  {
    initModalTitle: "Roboter-Klassifizieren in 2D",
    initModalContent: robotKlassModalContent(2),
    getLevelComponent: (title, content) => (
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
    getLevelComponent: (title, content) => (
      <LevelRobotLineGame2D
        initModalTitle={title}
        initModalContent={content}
        dimensions={3}
      ></LevelRobotLineGame2D>
    ),
    link: "robot-klassifizieren-3D",
  },
];
//User classification levels
const levelUser: ILevel[] = [
  {
    initModalTitle: "Punkt-Klassifizieren in 2D",
    initModalContent: pointKlassModalContent(2),
    getLevelComponent: (title, content) => (
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
    getLevelComponent: (title, content) => (
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
    getLevelComponent: (title, content) => (
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
    getLevelComponent: (title, content) => (
      <LevelUserLineGame2D
        initModalTitle={title}
        initModalContent={content}
        dimensions={3}
      ></LevelUserLineGame2D>
    ),
    link: "linien-klassifizieren-3D",
  },
];
//    REAL DATA
const getRealeDatensätzeInitModalTitle = (s: string, d: number) =>
  s + "-Daten in " + d + "D";
//Weizen levels
const weizenInitModalContent =
  "Von zwei Weizenarten wurden von je 70 Körnern die Breite, Länge und Fläche vermessen. Finde die Messung mit der sich die beiden Klassen perfekt linear separieren lassen.";
const weizenLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weizen", 1),
    initModalContent: weizenInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={weizen2Dataset}
      />
    ),
    link: "weizen1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weizen", 2),
    initModalContent: weizenInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel2D
        initModalTitle={title}
        initModalContent={content}
        dataset={weizen2Dataset}
      />
    ),
    link: "weizen2D",
  },
];
//Schierling levels
const schierlingInitModalContent =
  "Der griechische Philosoph Sokrates wurde im Athen des Jahres 399 v. Chr. zum Tode verurteilt und mit dem Schierlingsbecher hingerichtet. Mit diesem Becher wurde dem Verurteilten ein Getränk verabreicht, das aus einer Pflanze, dem giftigen Gefleckten Schierling, hergestellt wurde. Der Schierling ist für Laien leicht zu verwechseln mit anderen häufig vorkommenden Pflanzen, etwa der Hundspetersilie, die ebenfalls giftig ist, oder dem Wiesen­Kerbel, der ungiftig ist und zum Würzen von Salaten und Wildkräutersuppen verwendet wird. Alle drei Pflanzen haben ähnliche Blätter, blühen in weissen Dolden und bilden längliche Früchte.";
const schierlingLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Schierling", 1),
    initModalContent: schierlingInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel1D initModalTitle={title} initModalContent={content} dataset={schierlingDataset}/>
    ),
    link: "schierling1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Schierling", 2),
    initModalContent: schierlingInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel2D initModalTitle={title} initModalContent={content} dataset={schierlingDataset}/>
    ),
    link: "schierling2D",
  },
];
//Weinsorten levels
const weinsortenInitModalContent = "";
const weinsortenLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weinsorten", 1),
    initModalContent: weinsortenInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel1D initModalTitle={title} initModalContent={content} dataset={weinsortenDataset}/>
    ),
    link: "weinsorten1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weinsorten", 2),
    initModalContent: weinsortenInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel2D initModalTitle={title} initModalContent={content} dataset={weinsortenDataset}/>
    ),
    link: "weinsorten2D",
  },
];
//Iris levels
const irisInitModalContent = "";
const irisLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Iris", 1),
    initModalContent: irisInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel1D initModalTitle={title} initModalContent={content} dataset={irisDataset}/>
    ),
    link: "iris1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Iris", 2),
    initModalContent: irisInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel2D initModalTitle={title} initModalContent={content} dataset={irisDataset}/>
    ),
    link: "iris2D",
  },
];
//Gegenstaende levels
const gstInitModalContent = "";
const gstLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Gegenstände", 1),
    initModalContent: gstInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel1D initModalTitle={title} initModalContent={content} dataset={gegenstaendeDataset}/>
    ),
    link: "gst1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Gegenstände", 2),
    initModalContent: gstInitModalContent,
    getLevelComponent: (title, content) => (
      <RealDataLevel2D initModalTitle={title} initModalContent={content} dataset={gegenstaendeDataset}/>
    ),
    link: "gst2D",
  },
];
//    LEVEL SECTIONS
const getRealeDatensätzeSectionName = (s: string) =>
  "Reale Datensätze: Klassifiziere den " + s + "-Datensatz!";
const levelSections: ILevelSection[] = [
  {
    sectionName:
      "Lass den Roboter (die künstliche Intelligenz) deine Daten klassifizieren!",
    levels: levelRoboter,
  },
  {
    sectionName: "Klassifiziere selber vom Robotor generierte Daten!",
    levels: levelUser,
  },
  {
    sectionName: getRealeDatensätzeSectionName("Schierling"),
    levels: schierlingLevels,
  },
  {
    sectionName: getRealeDatensätzeSectionName("Weizen"),
    levels: weizenLevels,
  },
  {
    sectionName: getRealeDatensätzeSectionName("Weinsorten"),
    levels: weinsortenLevels,
  },
  {
    sectionName: getRealeDatensätzeSectionName("Iris"),
    levels: irisLevels,
  },
  {
    sectionName: getRealeDatensätzeSectionName("Gegenstände"),
    levels: gstLevels,
  },
];
//Getter functions
export const getAllLevelSections = (): ILevelSection[] => {
  return levelSections;
};

export const getAllLevelRoutes = (): JSX.Element[] => {
  const emptyRouteArray: JSX.Element[] = [];
  return emptyRouteArray.concat(
    ...levelSections.map((levelSection) =>
      levelSection.levels.map((level) => generateRouteFromLevel(level))
    )
  );
};
