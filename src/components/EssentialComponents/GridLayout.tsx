import { SimpleGrid } from "@mantine/core";
import { IData } from "../../Others/Data";
import { setCurrentDataType } from "../../Others/currentDataHelperMethods";
import TableWrapper from "./TableWrapper";

export default ({
  currentData,
  setCurrentData,
  children,
}: {
  currentData: IData;
  setCurrentData: setCurrentDataType;
  children: React.ReactNode;
}) => {
  return (
    <SimpleGrid cols={2} spacing="xs">
      <TableWrapper currentData={currentData} setCurrentData={setCurrentData} />
      {children}
    </SimpleGrid>
  );
};
