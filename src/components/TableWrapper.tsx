import { colors, IData, IDataPoint } from "../Data";
import Table from "./Table";
import "../App.css";
import { Card, Stack } from "@mantine/core";

interface TableWrapperProps {
  plot_data: IData;
  change_data: (id: number, key: number, new_point: IDataPoint) => void;
  new_random_data: () => void;
  set_iris_data: () => void;
  setSelectedClasses: (class1: number, class2: number) => void;
  selectedClasses: [number, number];
}

const TableWrapper = ({
  plot_data,
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
      {plot_data.data.map((cl, index) => (
        <Table
          key={"cl" + index}
          class_name={cl.className}
          points={cl.points}
          attribs={plot_data.attrib}
          change_cl_data={(key: number, new_point: IDataPoint) =>
            change_data(index, key, new_point)
          }
          color={colors[index]}
          highlighted={plot_data.selected_class.includes(index)}
          onClickHandler={() => onClickTable(index)}
        ></Table>
      ))}
      </Stack>
    </Card>
  );
};
export default TableWrapper;
