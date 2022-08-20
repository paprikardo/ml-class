import { IData, IDataPoint } from "../Data";
import Table from "./Table";

interface TableWrapperProps {
  plot_data: IData;
  change_data: (id: number, key: number, new_point: IDataPoint) => void;
  new_random_data: () => void;
  import_new_data: React.ChangeEventHandler<HTMLInputElement>;
}

const TableWrapper = ({
  plot_data,
  change_data,
  new_random_data,
  import_new_data
}: TableWrapperProps) => {
  return (
    <div className="TableWrapper">
      <button onClick={new_random_data}>Generiere neue Daten</button>
      <input type="file" name="file" accept=".csv" onChange={import_new_data}></input>
      <div>Tabelle mit Daten</div>
      {plot_data.data.map((cl, index) => (
        <Table
          key={"cl" + index}
          class_name={cl.className}
          points={cl.points}
          change_cl_data={(key: number, new_point: IDataPoint) =>
            change_data(index, key, new_point)
          }
        ></Table>
      ))}
    </div>
  );
};
export default TableWrapper;
