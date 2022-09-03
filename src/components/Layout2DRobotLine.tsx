import { IData, IDataPoint } from "../Data";
import Table from "./Table";
import MyPlot from "./MyPlot";
import RobotWrapper from "./RobotWrapper";
import { Kbd } from "@mantine/core";
import { setCurrentDataType } from "../Others/currentDataHelperMethods";
import GridLayout from "./GridLayout";

function Layout2DRobotLine({
  currentData,
  setCurrentData
}: {
  currentData: IData;
  setCurrentData:setCurrentDataType
}): JSX.Element {
  const robotMessage = (
    <>
      Benutze <Kbd>Maus-L</Kbd> oder <Kbd>shift</Kbd> + <Kbd>Maus-L</Kbd> um
      neue Punkte hinzuzufügen. Ich werde versuchen die Punkte zu separieren.
      Schaffst du es, dass ich sie nicht mehr separieren kann?";
    </>
  );
  return (
    <GridLayout currentData={currentData} setCurrentData={setCurrentData}>
      <MyPlot
        currentData={currentData}
        setCurrentData={setCurrentData}
      ></MyPlot>
      <RobotWrapper message={robotMessage}></RobotWrapper>
    </GridLayout>
  );
}

export default Layout2DRobotLine;
