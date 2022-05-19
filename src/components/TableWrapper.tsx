import { IDataGroup } from "../Data";
//import Table from "./Table";

interface TableWrapperProps {
  data: IDataGroup[];
  setData:React.Dispatch<React.SetStateAction<IDataGroup[]>>;
}

const TableWrapper = ({ data, setData }: TableWrapperProps) => {
  return (
    <div>
      {/* <Table data={dataKerbel} setData={setDataKerbel}></Table>
      <Table data={dataKerbel} setData={setDataKerbel}></Table>
      <Table data={dataBrennessel} setData={setDataBrennessel}></Table> */}
    </div>
  );
};
export default TableWrapper;
