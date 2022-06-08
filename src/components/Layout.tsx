import { useState } from "react";
import { IData, IDataPoint } from "../Data";
import { SimpleGrid } from "@mantine/core";
import TableWrapper from "./TableWrapper";
import PlotWrapper from "./PlotWrapper";
import Table from "./Table";
// const defaultDataClose: IData = {
//   data: [
//     {
//       id: "Kerbel",
//       data: [
//         { x: 1.286, y: 0.21 },
//         { x: 2.548, y: 0.98 },
//         { x: 1.456, y: 0.428 },
//         { x: 1.101, y: 0.581 },
//         { x: 1.821, y: 1.935 },
//         { x: -0.749, y: 0.183 },
//         { x: -0.323, y: 2.893 },
//         { x: -0.633, y: 1.92 },
//         { x: 1.682, y: 1.274 },
//         { x: 3.043, y: -0.469 },
//         { x: 0.07, y: 1.938 },
//         { x: 2.213, y: 0.79 },
//         { x: -0.677, y: 0.182 },
//         { x: 3.248, y: 2.651 },
//         { x: 0.432, y: 0.367 },
//         { x: 0.242, y: 0.272 },
//         { x: 0.996, y: 0.572 },
//         { x: -0.63, y: 1.036 },
//         { x: 0.379, y: -0.206 },
//         { x: 2.024, y: 1.097 },
//         { x: 1.97, y: 2.369 },
//       ],
//     },
//     {
//       id: "Brennessel",
//       data: [
//         { x: 3.769, y: 3.248 },
//         { x: 5.186, y: 4.205 },
//         { x: 2.041, y: 3.964 },
//         { x: 3.587, y: 3.342 },
//         { x: 6.053, y: 5.168 },
//         { x: 4.707, y: 4.47 },
//         { x: 4.343, y: 3.908 },
//         { x: 3.477, y: 3.369 },
//         { x: 4.857, y: 2.465 },
//         { x: 3.527, y: 2.068 },
//         { x: 3.516, y: 2.563 },
//         { x: 4.812, y: 5.194 },
//         { x: 4.292, y: 3.412 },
//         { x: 4.698, y: 5.537 },
//         { x: 5.167, y: 4.252 },
//         { x: 3.131, y: 4.842 },
//         { x: 3.065, y: 4.783 },
//         { x: 4.804, y: 4.733 },
//         { x: 3.576, y: 4.541 },
//         { x: 3.377, y: 5.346 },
//         { x: 3.612, y: 3.89 },
//         { x: 5.402, y: 2.34 },
//         { x: 3.454, y: 5.768 },
//       ],
//     },
//   ],
//   line: () => 0,
// };

const defaultDataSpread: IData = {
  data: [
    {
      id: "Kerbel",
      data: [
        { x: 1.366, y: 1.692 },
        { x: 2.948, y: 2.745 },
        { x: 2.444, y: 2.061 },
        { x: 1.189, y: 0.893 },
        { x: 1.757, y: 4.041 },
      ],
    },
    {
      id: "Brennessel",
      data: [
        { x: 9.696, y: 8.865 },
        { x: 11.248, y: 10.695 },
        { x: 8.989, y: 11.032 },
        { x: 10.626, y: 9.749 },
        { x: 10.767, y: 9.857 },
      ],
    },
  ],
  line: () => 0,
};

// const compute_line = (data_data:IDataGroup[]):IData => {
//   const data = {data: data_data,
//     line: [
//     { x: 2, y: 4 },
//     { x: 3, y: 7 },
//   ]};
//   return data;
// }

function Layout(): JSX.Element {
  const [currentData, setCurrentData] = useState(defaultDataSpread);
  // // fetch result from backend
  // useEffect(() => {
  //   fetch("/api/line")
  //     .then((res) => res.json())
  //     .then((data:IData) => setCurrentData(data));
  // });
  const addPoint = (xVal: number, yVal: number, id: string): void => {
    setCurrentData((prev) => {
      const newPrev = { ...prev };
      const newPrevData = [...prev.data];
      const group = newPrevData.find((elem) => elem.id === id);
      if (group === undefined) {
        console.log("UNDEFINED ERROR");
      } else {
        const i = newPrevData.indexOf(group);
        const newGroup = { ...group };
        const newGroupData = [...newGroup.data, { x: xVal, y: yVal }];
        newPrev.data = newPrevData;
        newPrev.data[i] = newGroup;
        newPrev.data[i].data = newGroupData;
      }
      return newPrev; //return same object with new reference so rerender triggers
    });
  };
  const changePoint = (
    id: string,
    key: number,
    new_point: IDataPoint
  ): void => {
    setCurrentData((prev) => {
      const cl = prev.data.find((obj) => {
        return obj["id"] === id;
      });
      if (cl === undefined) {
        console.log("UNDEFINED ERROR");
      } else {
        cl.data[key] = new_point;
      }
      return { data: prev.data, line: prev.line };
    });
  };
  return (
    <SimpleGrid style={{ height: "100vh" }} cols={2} spacing="xs">
      <TableWrapper
        plot_data={currentData}
        change_data={changePoint}
      ></TableWrapper>
      <PlotWrapper plot_data={currentData} addPoint={addPoint}></PlotWrapper>
      <div>
        <div>
          <h3>New Point to classify</h3>
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
                  <input
                    type="number"
                    value={2}
                    onChange={(event) => 0}
                  ></input>
                </td>
                <td>
                  <input
                    type="number"
                    value={3}
                    onChange={(event) => 0}
                  ></input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{width: "50%", height:"50%", margin:"auto"}}> Roboter Gesicht sagt das Ergebnis der Klassifizierung</div>
    </SimpleGrid>
  );
}

export default Layout;
