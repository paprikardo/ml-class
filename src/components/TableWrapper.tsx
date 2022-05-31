import {IData,IDataPoint} from "../Data";
import Table from "./Table";

interface TableWrapperProps {
  plot_data: IData;
  change_data:(id: string, key: number, new_point:IDataPoint) => void;
}

const TableWrapper = ({ plot_data, change_data }: TableWrapperProps) => {
  return (
    <div>
      <div>TABLE</div>  
      <Table id_data={plot_data["data"][0]} change_id_data={(key:number,new_point:IDataPoint) => change_data(plot_data["data"][0]["id"],key,new_point)}></Table>
      <Table id_data={plot_data["data"][1]} change_id_data={(key:number,new_point:IDataPoint) => change_data(plot_data["data"][1]["id"],key,new_point)}></Table>
    </div>
  );
};
export default TableWrapper;
