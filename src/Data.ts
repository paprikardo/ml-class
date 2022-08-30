export const NEW_POINT = "NEW_POINT";

interface IData2DPoint {
  x: number;
  y: number;
}

export const colors = ["#E64848", "#89CFFD", "#FFE9AE", "#CFE8A9", "gray"]; //LIMITATION: ALLOW MAXIMUM OF 4 DIFFERENT CLASSES

export type IDataPoint = number[];

export interface IDataClass {
  className: string;
  points: IDataPoint[];
}

export interface IData {
  data: IDataClass[];
  attrib: string[];
  selected_attrib: [number, number] | number; //if both axis are shown (the "2D" case we have two selected attributes), otherwise we have one
  selected_class: [number, number]; //same for the selected classes
  newPoint: IDataPoint;
}
export const ki67positiveZellen: IData = {
  data: [
    {
      className: "Prognose eher negativ",
      points: [[3], [5], [0], [8], [6], [2], [7]],
    },
    {
      className: "Prognose eher positiv",
      points: [[30], [55], [67], [50], [90], [87], [71], [66]],
    },
  ],
  attrib: ["Anteil Ki-67 positiver Zellen"],
  newPoint: [10, 10],
  selected_attrib: 0,
  selected_class: [0, 1],
};
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
        [10.0, 6.0, 7.0],
        [11.5, 6.0, 7.2],
        [12.0, 6.1, 7.4],
        [13.5, 6.3, 8.0],
        [13.0, 6.5, 7.6],
        [12.0, 6.2, 7.8],
        [13.0, 6.3, 7.0],
        [10.0, 6.1, 7.5],
        [11.0, 6.0, 7.3],
        [11.0, 6.5, 7.1],
        [14.0, 6.3, 8.0],
        [13.5, 6.4, 7.9],
        [14.0, 6.4, 7.3],
        [12.5, 6.2, 7.2],
        [10.0, 6.2, 7.9],
      ],
    },
    {
      className: "L. gatasii",
      points: [
        [50.0, 10.3, 8.2],
        [35.0, 11.0, 8.4],
        [40.0, 11.4, 9.0],
        [42.0, 11.8, 9.2],
        [55.0, 10.5, 9.4],
        [60.0, 12.0, 10.2],
        [37.0, 12.2, 10.0],
        [39.0, 12.5, 11.0],
        [44.0, 12.1, 10.5],
        [57.0, 11.2, 10.1],
        [49.0, 10.1, 9.6],
        [36.0, 12.5, 9.3],
        [43.0, 10.0, 9.0],
        [55.0, 10.4, 8.5],
        [58.0, 12.3, 8.0],
      ],
    },
    {
      className: "L. grant-duffii",
      points: [
        [15.0, 17.5, 7.8],
        [28.0, 18.0, 7.9],
        [30.0, 14.0, 8.0],
        [24.0, 13.0, 8.1],
        [22.0, 11.0, 8.2],
        [30.0, 16.0, 7.8],
        [35.0, 17.0, 7.9],
        [18.0, 15.0, 7.9],
        [19.0, 11.0, 8.0],
        [21.0, 12.0, 8.1],
        [20.0, 10.0, 8.1],
        [32.0, 15.5, 8.2],
        [34.0, 13.0, 7.8],
        [28.0, 13.5, 8.0],
        [27.0, 14.0, 8.0],
      ],
    },
  ],
  attrib: ["Stängel", "Spatha", "Blütenblätter"],
  newPoint: [10, 10, 10],
  selected_attrib: [0, 1],
  selected_class: [0, 1],
};
