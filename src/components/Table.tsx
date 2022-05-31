import { IDataGroup, IDataPoint } from "../Data";

const Table = ({
  id_data,
  change_id_data,
}: {
  id_data: IDataGroup;
  change_id_data: (key: number, new_point: IDataPoint) => void;
}) => {
  const class_name = id_data["id"];
  const data = id_data["data"];
  return (
    <div>
      <h3>{class_name}</h3>
      <table style={{margin:"auto"}}>
        <thead>
          <tr>
            <th>Grösse</th>
            <th>Länge</th>
          </tr>
        </thead>
        <tbody>
          {id_data["data"].map(({ x, y }, key) => (
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
