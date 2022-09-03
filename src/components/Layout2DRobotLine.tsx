import { IData, IDataPoint } from "../Data";
import Table from "./Table";
import MyPlot from "./MyPlot";
import RobotWrapper from "./RobotWrapper";
import { Kbd } from "@mantine/core";

function Layout2DRobotLine({
  currentData,
  changeNewPoint,
  addPoint,
  setSelectedAttrib,
}: {
  currentData: IData;
  changeNewPoint: (new_point: IDataPoint) => void;
  addPoint: (cl: number, new_point: IDataPoint) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
}): JSX.Element {
  const robotMessage = (
    <>
      Benutze <Kbd>Maus-L</Kbd> oder <Kbd>shift</Kbd> + <Kbd>Maus-L</Kbd> um
      neue Punkte hinzuzufügen. Ich werde versuchen die Punkte zu separieren.
      Schaffst du es, dass ich sie nicht mehr separieren kann?";
    </>
  );
  return (
    <div>
      <MyPlot
        currentData={currentData}
        addPoint={addPoint}
        setSelectedAttrib={setSelectedAttrib}
      ></MyPlot>
      {/* <Table
        class_name="Neuer zu klassifizierender Punkt"
        attribs={currentData.attrib}
        points={[currentData.newPoint]}
        change_cl_data={(k, new_point) => changeNewPoint(new_point)}
      ></Table> */}
      <RobotWrapper message={robotMessage}></RobotWrapper>
    </div>
  );
}

export default Layout2DRobotLine;
