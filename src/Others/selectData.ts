import { IData, IDataClass, IDataPoint } from "./Data";

//return data points of the selected classes where the points only contain the selected dimensions/attributes
export const selectDimSelectClassData = (
  currentData: IData
): [IDataPoint[], IDataPoint[]] => {
  const [c0, c1] = currentData.selected_class; //indices of the selected classes
  if (Array.isArray(currentData.selected_attrib)) {
    //if 2D axis case
    const [a1, a2] = currentData.selected_attrib; //indices of the selected attributes/dimensions/features
    return [
      currentData.data[c0].points.map((p) => [p[a1], p[a2]]),
      currentData.data[c1].points.map((p) => [p[a1], p[a2]]),
    ];
  } else {
    const attrib = currentData.selected_attrib;
    return [
      currentData.data[c0].points.map((p) => [p[attrib]]),
      currentData.data[c1].points.map((p) => [p[attrib]]),
    ];
  }
};
//return data points of the selected classes
export const selectClassData = (currentData: IData) => {
  const [c0, c1] = currentData.selected_class;
  return [currentData.data[c0].points, currentData.data[c1].points];
};
//result of selectDimSelectClassData but scaled to the SVG points
export const selectDimSelectClassDataScaled = (
  currentData: IData,
  scaleX: (x: number) => number,
  scaleY: (y: number) => number
): [IDataPoint[], IDataPoint[]] => {
  const [s1, s2] = selectDimSelectClassData(currentData);
  if (Array.isArray(currentData.selected_attrib)) {
    //if 2D
    const f = (x: IDataPoint[]) => x.map((p) => [scaleX(p[0]), scaleY(p[1])]);
    return [f(s1), f(s2)];
  } else {
    //if 1D
    const f = (x: IDataPoint[]) => x.map((p) => [scaleX(p[0])]);
    return [f(s1), f(s2)];
  }
};
