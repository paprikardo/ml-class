import {CLASS_A, CLASS_B, IData,IDataPoint} from "../Data";
import Table from "./Table";

interface TableWrapperProps {
  plot_data: IData;
  change_data:(id: string, key: number, new_point:IDataPoint) => void;
  new_random_data:() => void
}

const TableWrapper = ({ plot_data, change_data,new_random_data }: TableWrapperProps) => {
  return (
    <div className ="TableWrapper">
      <button onClick={new_random_data}>Generiere neue Daten</button>
      <div>Tabelle mit Daten</div>  
      <div ><Table class_name={CLASS_A} data={plot_data.data[CLASS_A]} change_id_data={(key:number,new_point:IDataPoint) => change_data(CLASS_A,key,new_point)}></Table></div>
      <Table class_name={CLASS_B} data={plot_data.data[CLASS_B]} change_id_data={(key:number,new_point:IDataPoint) => change_data(CLASS_B,key,new_point)}></Table>
    </div>
  );
};
export default TableWrapper;
