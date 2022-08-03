import {IData, IDataPoint } from "../Data";
import RobotWrapper from "./RobotWrapper";
import NewPointTable from "./NewPointTable";
import MyPlot from "./MyPlot";

function Layout2DRobotLine({
  currentData,
  changePoint,
  addPoint,
}: {
  currentData: IData;
  changePoint: (cl: number, key: number, new_point: IDataPoint) => void
  addPoint: (cl: number, new_point: IDataPoint) => void
}): JSX.Element {
  return (
    <div>
      <MyPlot plot_data={currentData} addPoint={addPoint}></MyPlot>
      <NewPointTable
        plot_data={[currentData.newPoint]}
        change_data={changePoint}
      ></NewPointTable>
      <RobotWrapper class_result="result"></RobotWrapper>
    </div>
  );
}

export default Layout2DRobotLine;
