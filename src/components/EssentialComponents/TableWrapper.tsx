import { colors, IData, IDataPoint } from "../../Data";
import Table from "./Table";
import "../../App.css";
import { Card, Stack } from "@mantine/core";
import {
  changePoint,
  setCurrentDataType,
  setSelectedClasses,
} from "../../Others/currentDataHelperMethods";

interface TableWrapperProps {
  currentData: IData;
  setCurrentData: setCurrentDataType;
}

const TableWrapper = ({ currentData, setCurrentData }: TableWrapperProps) => {
  const onClickTable = (clIndex: number) => {
    const selectedClasses = currentData.selected_class;
    if (!selectedClasses.includes(clIndex)) {
      setSelectedClasses(setCurrentData, clIndex, selectedClasses[0]); //set selected class "rotating around"
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
              changePoint(setCurrentData,index, key, new_point)
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
