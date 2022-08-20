import { IDataPoint } from "../Data";

const Table = ({
  class_name,
  points,
  change_cl_data,
}: {
  class_name: string;
  points: IDataPoint[];
  change_cl_data: (key: number, new_point: IDataPoint) => void;
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
          {points.map(([x, y], key) => (
            <tr key={class_name + "-" + key}>
              <td>
                <input
                  type="number"
                  value={x}
                  onChange={(event) =>
                    change_cl_data(key, [parseFloat(event.target.value), y])
                  }
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  value={y}
                  onChange={(event) =>
                    change_cl_data(key, [x, parseFloat(event.target.value)])
                  }
                ></input>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
