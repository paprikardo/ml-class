import { SimpleGrid } from "@mantine/core";
import { IData } from "../Data";
import { setCurrentDataType } from "../Others/currentDataHelperMethods";
import TableWrapper from "./TableWrapper";

export default ({
  currentData,
  setCurrentData,
}: {
  currentData: IData;
  setCurrentData: setCurrentDataType;
}) => {
  return (
    <SimpleGrid cols={2} spacing="xs">
      <TableWrapper
        currentData={currentData}
        setCurrentData={setCurrentData}
      ></TableWrapper>
    </SimpleGrid>
  );
};
