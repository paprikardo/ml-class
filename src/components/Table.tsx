import { IDataPoint } from "../Data";

const Table = ({
  class_name,
  data,
  change_id_data,
}: {
  class_name: string
  data: IDataPoint[];
  change_id_data: (key: number, new_point: IDataPoint) => void;
}) => {
  return (
    <div>
      <h3>{class_name}</h3>
      <table className="Centred Table">
        <thead>
          <tr>
            <th>Grösse</th>
            <th>Länge</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ x, y }, key) => (
            <tr key={class_name + "-" + key}>
              <td>
                <input type="number" value={x} onChange={(event) => change_id_data(key,{x:parseFloat(event.target.value),y:y})}></input>
              </td>
              <td>
                <input type="number" value={y} onChange={(event) => change_id_data(key,{x:x,y:parseFloat(event.target.value)})}></input>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
