import LevelUserClassGame2D from "./LevelUserClassGame2D";
import LevelUserClassGame1D from "./LevelUserClassGame1D";
import LevelRobotClassGame2D from "./LevelRobotClassGame2D";
import { Link, Route } from "react-router-dom";
import { Button, Grid, Kbd, Text, Title } from "@mantine/core";
import RealDataLevel1D from "./RealDataLevel1D";
import {
  gegenstaendeDataset,
  irisDataset,
  ki67positiveZellen,
  schierlingDataset,
  weinsortenDataset,
  weizen2Dataset,
} from "../../Others/Data";
import RealDataLevel2D from "./RealDataLevel2D";
//Interfaces
interface ILevel {
  initModalTitle: string;
  initModalContent: JSX.Element;
  getLevelComponent: (title: string, content: JSX.Element) => JSX.Element;
  link: string;
}
interface ILevelSection {
  sectionHeader: JSX.Element;
  levels: ILevel[];
}

//    RANDOM DATA
//Robot classsification levels
const robotKlassModalContent = (dim: number) => (
  <>
    <Text>
      Der Roboter wird versuchen die {dim} dimensionalen Punkte zu
      klassifizieren. Du kannst bei ihm beobachten, wie er den Klassifikator
      bestimmt.
    </Text>
    <Text weight={700} align="center">
      <Kbd>Klicke</Kbd> mit deiner Maus um einen neuen Punkt zu Klasse 1
      hinzuzufügen. Drücke zusätzlich <Kbd>Shift</Kbd> um einen neuen Punkt zu
      Klasse 2 hinzuzufügen.
    </Text>
  </>
);
const levelRoboter: ILevel[] = [
  {
    initModalTitle: "Roboter Linien-Klassifizieren in 2D",
    initModalContent: robotKlassModalContent(2),
    getLevelComponent: (title, content) => (
      <LevelRobotClassGame2D
        initModalTitle={title}
        initModalContent={content}
        dimensions={2}
      ></LevelRobotClassGame2D>
    ),
    link: "robot-klassifizieren-2D",
  },
  {
    initModalTitle: "Roboter Linien-Klassifizieren in 3D",
    initModalContent: robotKlassModalContent(3),
    getLevelComponent: (title, content) => (
      <LevelRobotClassGame2D
        initModalTitle={title}
        initModalContent={content}
        dimensions={3}
      ></LevelRobotClassGame2D>
    ),
    link: "robot-klassifizieren-3D",
  },
];
//User and real data helpers
//returns the basic Task Description ("Use the mouse to classify in 2D/1D"...) for the bottom of the initModal Content for dimension d
const getTaskRealDataAndUserInitModalContent = (isLinienClass: boolean) =>
  !isLinienClass ? (
    <Text weight={700} align="center">
      Klicke mit der Maus um einen Klassifikator zu bestimmen
    </Text>
  ) : (
    <Text weight={700} align="center">
      Klicke und ziehe mit der Maus um einen Klassifikator zu zeichnen
    </Text>
  );
const getRealDataAndUserInitModalContent = (
  element: JSX.Element,
  isLinienClass: boolean
) => (
  <>
    {element}
    {getTaskRealDataAndUserInitModalContent(isLinienClass)}
  </>
);
//User classification levels
//args: dim = dimension of points, isLinienClass: is a line classifier i.e. plot is in 2D
const userClassModalContent = (dim: number, isLinienClass: boolean) =>
  getRealDataAndUserInitModalContent(
    <Text>
      Versuche die {dim} dimensionalen Punktewolken der beiden Klassen zu
      separieren. Dein Score erhöht sich jedes mal, wenn du die Daten perfekt
      separierst!
    </Text>,
    isLinienClass
  );
const levelUser: ILevel[] = [
  {
    initModalTitle: "Punkt-Klassifizieren in 2D",
    initModalContent: userClassModalContent(2, false),
    getLevelComponent: (title, content) => (
      <LevelUserClassGame1D
        dimensions={2}
        initModalTitle={title}
        initModalContent={content}
      ></LevelUserClassGame1D>
    ),
    link: "punkt-klassifizieren-2D",
  },
  {
    initModalTitle: "Punkt-Klassifizieren in 3D",
    initModalContent: userClassModalContent(3, false),
    getLevelComponent: (title, content) => (
      <LevelUserClassGame1D
        initModalTitle={title}
        initModalContent={content}
        dimensions={3}
      ></LevelUserClassGame1D>
    ),
    link: "punkt-klassifizieren-3D",
  },
  {
    initModalTitle: "Linien-Klassifizieren in 2D",
    initModalContent: userClassModalContent(2, true),
    getLevelComponent: (title, content) => (
      <LevelUserClassGame2D
        initModalTitle={title}
        initModalContent={content}
        dimensions={2}
      ></LevelUserClassGame2D>
    ),
    link: "linien-klassifizieren-2D",
  },
  {
    initModalTitle: "Linien-Klassifizieren in 3D",
    initModalContent: userClassModalContent(3, true),
    getLevelComponent: (title, content) => (
      <LevelUserClassGame2D
        initModalTitle={title}
        initModalContent={content}
        dimensions={3}
      ></LevelUserClassGame2D>
    ),
    link: "linien-klassifizieren-3D",
  },
];
//    REAL DATA
const getRealeDatensätzeInitModalTitle = (s: string, isLinienClass: boolean) => !isLinienClass?
  "Punkt-Klassifikator":"Linien-Klassifikator";
  //"Punkt-Klassifikator für die "+s + "-Daten":"Linien-Klassifikator für die "+s + "-Daten";
//Weizen levels
const weizenInitModalContent = (isLinienClass: boolean) =>
  getRealDataAndUserInitModalContent(
    <Text>
      Von zwei Weizenarten wurden von je 70 Körnern die Breite, Länge und Fläche
      vermessen. Finde das Attribut mit der sich die beiden Klassen perfekt
      linear separieren lassen.
    </Text>,
    isLinienClass
  );
const weizenLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weizen", false),
    initModalContent: weizenInitModalContent(false),
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={weizen2Dataset}
      />
    ),
    link: "weizen-1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weizen", true),
    initModalContent: weizenInitModalContent(true),
    getLevelComponent: (title, content) => (
      <RealDataLevel2D
        initModalTitle={title}
        initModalContent={content}
        dataset={weizen2Dataset}
      />
    ),
    link: "weizen-2D",
  },
];
//Schierling levels
const schierlingInitModalContent = (isLinienClass: boolean) =>
  getRealDataAndUserInitModalContent(
    <Text>
      Der griechische Philosoph Sokrates wurde im Athen des Jahres 399 v. Chr.
      zum Tode verurteilt und mit dem Schierlingsbecher hingerichtet. Mit diesem
      Becher wurde dem Verurteilten ein Getränk verabreicht, das aus einer
      Pflanze, dem giftigen Gefleckten Schierling, hergestellt wurde. Der
      Schierling ist für Laien leicht zu verwechseln mit anderen häufig
      vorkommenden Pflanzen, etwa der Hundspetersilie, die ebenfalls giftig ist,
      oder dem Wiesen­Kerbel, der ungiftig ist und zum Würzen von Salaten und
      Wildkräutersuppen verwendet wird. Alle drei Pflanzen haben ähnliche
      Blätter, blühen in weissen Dolden und bilden längliche Früchte. Versuche
      die 3 Pflanzenarten zu klassifizieren.
    </Text>,
    isLinienClass
  );
const schierlingLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Schierling", false),
    initModalContent: schierlingInitModalContent(false),
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={schierlingDataset}
      />
    ),
    link: "schierling-1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Schierling", true),
    initModalContent: schierlingInitModalContent(true),
    getLevelComponent: (title, content) => (
      <RealDataLevel2D
        initModalTitle={title}
        initModalContent={content}
        dataset={schierlingDataset}
      />
    ),
    link: "schierling-2D",
  },
];
//Weinsorten levels
const weinsortenInitModalContent = (isLinienClass: boolean) =>
  getRealDataAndUserInitModalContent(
    <Text>
      Die folgenden Datenpunkte sind von Weinen aus zwei verschiedenen
      Anbaugebieten. Es werden die drei Attribute Ascheanteil, Phenolgehalt und
      Farbintensität betrachtet. {}
    </Text>,
    isLinienClass
  );
const weinsortenLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weinsorten", false),
    initModalContent: weinsortenInitModalContent(false),
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={weinsortenDataset}
      />
    ),
    link: "weinsorten-1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Weinsorten", true),
    initModalContent: weinsortenInitModalContent(true),
    getLevelComponent: (title, content) => (
      <RealDataLevel2D
        initModalTitle={title}
        initModalContent={content}
        dataset={weinsortenDataset}
      />
    ),
    link: "weinsorten-2D",
  },
];
//Iris levels
const irisInitModalContent = (isLinienClass: boolean) =>
  getRealDataAndUserInitModalContent(
    <>
      <Text>
        {" "}
        Die Schwertlilie (Iris) ist eine Pflanzengattung, deren Arten wegen
        ihrer schönen und auffälligen Blüten als Zierpflanzen geschätzt werden.
        Die Datensätze der Schwertlilie werden in Kursen für Maschinelles Lernen
        sehr gerne als Beispiel-Datensätze verwendet. Im folgenden Level
        betrachten wir so einen Datensatz.
      </Text>
      <Text>
        Es sind die Stängel-, Blüttenblätter- und Spathalängen (in cm) von drei
        Schwertlilien-Arten (I. barnumiae, I. gatesii und I. grant-duffii)
        aufgelistet. Als Spatha bezeichnet man in der Botanik eine besondere
        Form von Hochblättern. Wir wollen die Daten separieren.
      </Text>
    </>,
    isLinienClass
  );
const irisLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Iris", false),
    initModalContent: irisInitModalContent(false),
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={irisDataset}
      />
    ),
    link: "iris-1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Iris", true),
    initModalContent: irisInitModalContent(true),
    getLevelComponent: (title, content) => (
      <RealDataLevel2D
        initModalTitle={title}
        initModalContent={content}
        dataset={irisDataset}
      />
    ),
    link: "iris-2D",
  },
];
//Gegenstaende levels
const gstInitModalContent = (isLinienClass: boolean) =>
  getRealDataAndUserInitModalContent(
    <>
      <Text>
        In dem folgenden Level sind Volumen und Masse von verschiedenen
        Gegenständen angegeben. Die Klasse, der sie angehören, bestimmt, ob der
        Gegenstand im Wasser schwimmt oder sinkt.
      </Text>
      <Text>Wir wollen die Daten wieder separieren.</Text>
    </>,
    isLinienClass
  );
const gstLevels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Gegenstände", false),
    initModalContent: gstInitModalContent(false),
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={gegenstaendeDataset}
      />
    ),
    link: "gst-1D",
  },
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Gegenstände", true),
    initModalContent: gstInitModalContent(true),
    getLevelComponent: (title, content) => (
      <RealDataLevel2D
        initModalTitle={title}
        initModalContent={content}
        dataset={gegenstaendeDataset}
      />
    ),
    link: "gst-2D",
  },
];
//Ki67 levels
const ki67InitModalContent = (isLinienClass:boolean) =>
  getRealDataAndUserInitModalContent(
    <>
      <Text>
        Bei der Bestimmung von Brustkrebs werden Proliferationsmarker (= Marker
        für Zellteilung) in die Evaluierung miteinbezogen. Ein
        Proliferationsmarker für Brustkrebs ist der Marker Ki-67, ein Protein,
        das sich in teilenden Zellen an der Oberfläche der Chromosomen anlagert
        und somit gut zu detektieren ist.
      </Text>
      <Text>
        Das Gewebe, welches man bei PatientInnen entnimmt, wird untersucht und
        der Prozentanteil an Zellen, die Ki-67 aufweisen, bestimmt. In der
        folgenden Tabelle wurden die Ki-67 Prozentwerte von 15 PatientInnen
        ermittelt. Die zugehörige Klasse gibt an, ob der Datenpunkt eher negativ
        oder eher positiv in die Prognose einfliesst.
      </Text>
      <Text>Wir wollen die Daten wieder separieren.</Text>
    </>,
    isLinienClass
  );
const ki67Levels: ILevel[] = [
  {
    initModalTitle: getRealeDatensätzeInitModalTitle("Ki67", false),
    initModalContent: ki67InitModalContent(false),
    getLevelComponent: (title, content) => (
      <RealDataLevel1D
        initModalTitle={title}
        initModalContent={content}
        dataset={ki67positiveZellen}
      />
    ),
    link: "ki67-1D",
  },
];
//    LEVEL SECTIONS
const getRealeDatensätzeSectionName = (s: string) => (
  <div key={s}>
    <Title order={4} style={{color:"#1967ab"}}>
      Reale Datensätze:
    </Title>
    <Title order={5}>Klassifiziere den {s}-Datensatz!</Title>
  </div>
);
const levelSections: ILevelSection[] = [
  {
    sectionHeader: (
      <Title order={4} key="sectionHeader-robotClass">
        Lass den Roboter (die künstliche Intelligenz) deine Daten
        klassifizieren!
      </Title>
    ),
    levels: levelRoboter,
  },
  {
    sectionHeader: (
      <Title order={4} key="sectionHeader-userClass">
        Klassifiziere Daten, die zufällig generiert werden!
      </Title>
    ),
    levels: levelUser,
  },
  {
    sectionHeader: getRealeDatensätzeSectionName("Schierling"),
    levels: schierlingLevels,
  },
  {
    sectionHeader: getRealeDatensätzeSectionName("Weizen"),
    levels: weizenLevels,
  },
  {
    sectionHeader: getRealeDatensätzeSectionName("Weinsorten"),
    levels: weinsortenLevels,
  },
  {
    sectionHeader: getRealeDatensätzeSectionName("Iris"),
    levels: irisLevels,
  },
  {
    sectionHeader: getRealeDatensätzeSectionName("Gegenstände"),
    levels: gstLevels,
  },
  { sectionHeader: getRealeDatensätzeSectionName("Ki67"), levels: ki67Levels },
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

//Helper methods
export const generateButtonFromLevel = (level: ILevel) => (
  <Link to={"/ml-class/level/" + level.link} key={level.link + "-link"}>
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
