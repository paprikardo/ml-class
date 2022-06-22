import { CLASS_NEW_POINT, IData, IDataPoint } from "../Data";
import { SimpleGrid } from "@mantine/core";
import TableWrapper from "./TableWrapper";
import RobotWrapper from "./RobotWrapper";
import NewPointTable from "./NewPointTable";
import MyPlot from "./MyPlot";

function Layout2DRobotLine({
  currentData,
  changePoint,
  addPoint,
  new_random_data,
}: {
  currentData: IData;
  changePoint: (id: string, key: number, new_point: IDataPoint) => void;
  addPoint: (xVal: number, yVal: number, id: string) => void;
  new_random_data: () => void;
}): JSX.Element {
  return (
    <SimpleGrid cols={2} spacing="xs">
      <TableWrapper
        plot_data={currentData}
        change_data={changePoint}
        new_random_data={new_random_data}
      ></TableWrapper>
      <MyPlot plot_data={currentData} addPoint={addPoint}></MyPlot>
      <NewPointTable
        plot_data={currentData.data[CLASS_NEW_POINT]}
        change_data={changePoint}
      ></NewPointTable>
      <RobotWrapper class_result="result"></RobotWrapper>
    </SimpleGrid>
  );
}

export default Layout2DRobotLine;
