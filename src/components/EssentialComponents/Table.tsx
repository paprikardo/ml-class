import { IDataPoint } from "../../Data";
import "../../App.css";
import { Card, Text } from "@mantine/core";
const Table = ({
  class_name,
  attribs,
  points,
  change_cl_data,
  color,
  highlighted,
  onClickHandler,
}: {
  class_name: string;
  points: IDataPoint[];
  attribs: string[];
  change_cl_data: (key: number, new_point: IDataPoint) => void;
  color?: string;
  highlighted?: boolean;
  onClickHandler?: () => void;
}) => {
  const highlightedClassName = highlighted ? " highlighted" : "";
  return (
    <Card
      className={highlightedClassName}
      style={{ backgroundColor: color }}
      onClick={onClickHandler}
    >
      <Text align="center" size="lg" weight={500} underline>
        Datenpunkte für {class_name}
      </Text>
      <table className={"Centred Table"}>
        <thead>
          <tr>
            {attribs.map((s) => (
              <th key={s}>
                <Text align="center">{s}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points.map((point, key) => (
            <tr key={class_name + "-" + key}>
              {point.map((x, point_index) => (
                <td key={"td" + point_index}>
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
    </Card>
  );
};

export default Table;
