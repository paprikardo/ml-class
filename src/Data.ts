export const NEW_POINT="NEW_POINT"


interface IData2DPoint {
  x: number;
  y: number;
}

export const colors = ["#E64848", "#89CFFD", "#FFE9AE", "#CFE8A9","gray"]; //LIMITATION: ALLOW MAXIMUM OF 4 DIFFERENT CLASSES

export type IDataPoint = number[];

export interface IDataClass {
  className: string;
  points: IDataPoint[];
}

export interface IData {
  data: IDataClass[];
  attrib: string[];
  selected_attrib: [number, number];
  selected_class: [number, number];
  newPoint: IDataPoint;
}

export const default2DDataSpread: IData = {
  data: [
    {
      className: "Pflanze A",
      points: [
        [1.366, 1.692],
        [2.948, 2.745],
        [2.444, 2.061],
        [1.189, 0.893],
        [1.757, 4.041],
      ],
    },
    {
      className: "Pflanze B",
      points: [
        [9.696, 8.865],
        [11.248, 10.695],
        [8.989, 11.032],
        [10.626, 9.749],
        [10.767, 9.857],
      ],
    },
  ],
  attrib: ["Grösse", "Länge"],
  newPoint: [10, 10],
  selected_attrib: [0, 1],
  selected_class: [0, 1],
};

export const irisDataset: IData = {
  data: [
    {
      className: "L. barnumiae",
      points: [
        [6, 7, 50],
        [6, 7.2, 35],
        [6.1, 7.4, 40],
        [6.3, 8, 42],
        [6.5, 7.6, 55],
        [6.2, 7.8, 60],
        [6.3, 7, 37],
      ],
    },
    {
      className: "L. gatasii",
      points: [
        [8,8,9],
        [9,8,8]
      ],
    },
    {
      className: "L. grant-duffii",
      points: [
        [2,2,2],
        [3,3,3]
      ],
    },
  ],
  attrib: ["Spatha","Blütenblätter","Stängel"],
  newPoint: [10, 10,10],
  selected_attrib: [0, 1],
  selected_class: [0, 1],
};

const empty2DData: IData = {
  data: [
    {
      className: "Pflanze A",
      points: [],
    },
    {
      className: "Pflanze B",
      points: [],
    },
  ],
  attrib: ["Grösse", "Länge"],
  newPoint: [0, 0],
  selected_attrib: [0, 1],
  selected_class: [0, 1],
};

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
