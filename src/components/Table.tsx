import { IDataPoint } from "../Data";
import '../App.css'
const Table = ({
  class_name,
  attribs,
  points,
  change_cl_data,
  color,
  highlighted,
  onClickHandler
}: {
  class_name: string;
  points: IDataPoint[];
  attribs: string[];
  change_cl_data: (key: number, new_point: IDataPoint) => void;
  color?:string,
  highlighted?:boolean,
  onClickHandler?:()=>void
}) => {
  const highlightedClassName = highlighted?" highlighted":""
  console.log(color,"Centred Table"+highlightedClassName)
  return (
    <div className="Centred Table" style={{backgroundColor:color}} onClick={onClickHandler}>
      <h3><p>{class_name}</p></h3>
      <table className={"Centred Table "+highlightedClassName}>
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
