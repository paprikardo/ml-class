import { IDataPoint } from "../Data";

const Table = ({
  class_name,
  attribs,
  points,
  change_cl_data,
}: {
  class_name: string;
  points: IDataPoint[];
  attribs: string[];
  change_cl_data: (key: number, new_point: IDataPoint) => void;
}) => {
  return (
    <div>
      <h3>{class_name}</h3>
      <table className="Centred Table">
        <thead>
          <tr>
            {attribs.map((s) => (
              <th key={s}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points.map((point, key) => (
            <tr key={class_name + "-" + key}>
              {point.map((x, point_index) => (
                <td key={"td"+point_index}>
                  <input
                    type="number"
                    value={x}
                    onChange={(event) => {
                      var newPoint = point;
                      newPoint[point_index] = parseFloat(event.target.value);
                      change_cl_data(key, newPoint);
                    }}
                  ></input>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
