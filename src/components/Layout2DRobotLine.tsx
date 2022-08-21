import { IData, IDataPoint } from "../Data";
import Table from "./Table";
import MyPlot from "./MyPlot";

function Layout2DRobotLine({
  currentData,
  changeNewPoint,
  addPoint,
}: {
  currentData: IData;
  changeNewPoint: (new_point: IDataPoint) => void;
  addPoint: (cl: number, new_point: IDataPoint) => void;
}): JSX.Element {
  return (
    <div>
      <MyPlot plot_data={currentData} addPoint={addPoint}></MyPlot>
      <Table
        class_name="Neuer zu klassifizierender Punkt"
        attribs={currentData.attrib}
        points={[currentData.newPoint]}
        change_cl_data={(k, new_point) => changeNewPoint(new_point)}
      ></Table>
    </div>
  );
}

export default Layout2DRobotLine;
