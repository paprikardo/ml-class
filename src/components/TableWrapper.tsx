import { colors, IData, IDataPoint } from "../Data";
import Table from "./Table";
import "../App.css";
import { Card, Stack } from "@mantine/core";

interface TableWrapperProps {
  currentData: IData;
  change_data: (id: number, key: number, new_point: IDataPoint) => void;
  new_random_data: () => void;
  set_iris_data: () => void;
  setSelectedClasses: (class1: number, class2: number) => void;
  selectedClasses: [number, number];
}

const TableWrapper = ({
  currentData,
  change_data,
  new_random_data,
  set_iris_data,
  setSelectedClasses,
  selectedClasses,
}: TableWrapperProps) => {
  const onClickTable = (clIndex: number) => {
    if (typeof setSelectedClasses !== "undefined") {
      if (!selectedClasses.includes(clIndex)) {
        setSelectedClasses(clIndex, selectedClasses[0]); //set selected class "rotating around"
      }
    }
  };
  return (
    <Card className="TableWrapper">
      <Stack>
      {currentData.data.map((cl, index) => (
        <Table
          key={"cl" + index}
          class_name={cl.className}
          points={cl.points}
          attribs={currentData.attrib}
          change_cl_data={(key: number, new_point: IDataPoint) =>
            change_data(index, key, new_point)
          }
          color={colors[index]}
          highlighted={currentData.selected_class.includes(index)}
          onClickHandler={() => onClickTable(index)}
        ></Table>
      ))}
      </Stack>
    </Card>
  );
};
export default TableWrapper;
