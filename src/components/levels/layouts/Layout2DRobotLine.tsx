import { IData } from "../../../Others/Data";
import MyPlot from "../../EssentialComponents/MyPlot";
import RobotWrapper from "../../smallerComponents/RobotWrapper";
import { Kbd } from "@mantine/core";
import { setCurrentDataType } from "../../../Others/currentDataHelperMethods";
import GridLayout from "../../EssentialComponents/GridLayout";

function Layout2DRobotLine({
  currentData,
  setCurrentData
}: {
  currentData: IData;
  setCurrentData:setCurrentDataType
}): JSX.Element {
  const robotMessage = (
    <>
      Klicke mit oder ohne <Kbd>Shift</Kbd> gedrückt zu halten, um
      neue Punkte hinzuzufügen. Ich werde versuchen die Punkte zu separieren.
      Schaffst du es, dass ich sie nicht mehr separieren kann?
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
