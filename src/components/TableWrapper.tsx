import { colors, IData, IDataPoint } from "../Data";
import Table from "./Table";

interface TableWrapperProps {
  plot_data: IData;
  change_data: (id: number, key: number, new_point: IDataPoint) => void;
  new_random_data: () => void;
  import_new_data: React.ChangeEventHandler<HTMLInputElement>;
  set_iris_data: () => void;
}

const TableWrapper = ({
  plot_data,
  change_data,
  new_random_data,
  import_new_data,
  set_iris_data,
}: TableWrapperProps) => {
  console.log("Table:", plot_data.data);
  return (
    <div className="TableWrapper">
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
        ></Table>
      ))}
    </div>
  );
};
export default TableWrapper;
