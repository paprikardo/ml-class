import { IDataPoint } from "../Data";

interface NewPointTableProps {
  plot_data: IDataPoint[];
  change_data:(cl: number, key: number, new_point:IDataPoint) => void;
}

const NewPointTable = ({plot_data, change_data}:NewPointTableProps) => {
  return (
    <div>
      <div>
        <h3></h3>
        <table style={{ margin: "auto" }}>
          <thead>
            <tr>
              <th>Grösse</th>
              <th>Länge</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="number" value={2} onChange={(event) => 0}></input>
              </td>
              <td>
                <input type="number" value={3} onChange={(event) => 0}></input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewPointTable;
