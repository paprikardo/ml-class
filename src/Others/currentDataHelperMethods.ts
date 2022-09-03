import { IData, IDataPoint } from "../Data";
import { randomPoint, rand_0_10_point } from "./Random";

export type setCurrentDataType = React.Dispatch<React.SetStateAction<IData>>;

export const addRandomPoint = (
  setCurrentData: setCurrentDataType,
  means: IDataPoint[],
  variance: number = 2
) => {
  means.forEach((cl_mean, i) => {
    addPoint(setCurrentData, i, randomPoint(cl_mean, variance));
  });
};
//adds a point to the Data.data array (i.e. the cl'th class/group)
export const addPoint = (
  setCurrentData: setCurrentDataType,
  cl: number,
  new_point: IDataPoint
): void => {
  setCurrentData((prev) => {
    const newPrev = { ...prev };
    newPrev.data = [...prev.data];
    newPrev.data[cl] = { ...prev.data[cl] };
    newPrev.data[cl].points = [...prev.data[cl].points, new_point]; //adding new point
    return newPrev; //return same object with new reference so rerender triggers
  });
};
//changes a point with the key "key" in the Data.data dictionary with key "id" to "new_point"
export const changePoint = (
  setCurrentData: setCurrentDataType,
  cl: number,
  key: number,
  new_point: IDataPoint
): void => {
  setCurrentData((prev) => {
    prev.data[cl].points[key] = new_point;
    const newPrev = { ...prev };
    return newPrev;
  });
};
//sets the selected attributes (selected to being displayed in the plot) to xAxisAttrib and yAxisAttrib
export const setSelectedAttrib = (
  setCurrentData: setCurrentDataType,
  xAxisAttrib: number,
  yAxisAttrib?: number
) => {
  setCurrentData((prev) => {
    const newPrev = { ...prev };
    if (
      Array.isArray(newPrev.selected_attrib) &&
      typeof yAxisAttrib !== "undefined"
    ) {
      newPrev.selected_attrib = [xAxisAttrib, yAxisAttrib];
    } else if (
      typeof newPrev.selected_attrib == "number" &&
      typeof yAxisAttrib == "undefined"
    ) {
      newPrev.selected_attrib = xAxisAttrib;
    } else {
      console.log(
        "Error: Inconsistency in selected Attrib. Called setSelected Attrib with wrong args"
      );
    }
    return newPrev;
  });
};
//sets the selected classes (selected to the classification) to class1 and class2
export const setSelectedClasses = (
  setCurrentData: setCurrentDataType,
  class1: number,
  class2: number
) => {
  setCurrentData((prev) => {
    const newPrev = { ...prev };
    newPrev.selected_class = [class1, class2];
    return newPrev;
  });
};
export const changeNewPoint = (
  setCurrentData: setCurrentDataType,
  new_point: IDataPoint
): void => {
  setCurrentData((prev) => {
    prev.newPoint = new_point;
    const newPrev = { ...prev };
    return newPrev;
  });
};
//set the currentData to a single point per class each. The points are randomly sampled following a mean.
//The points also have a minimum distance in each dimension
export const setDataSinglePoint = (
  setCurrentData: setCurrentDataType,
  means: IDataPoint[]
) => {
  setCurrentData((prev): IData => {
    const randomPointsMinDistance = getRandomPointsWithMinDistance(means);
    return {
      data: prev.data.map((cl, cl_index) => {
        return {
          className: cl.className,
          points: [randomPointsMinDistance[cl_index]],
        };
      }),
      selected_attrib: prev.selected_attrib,
      selected_class: prev.selected_class,
      newPoint: prev.newPoint,
      attrib: prev.attrib,
    };
  });
};
const getRandomPointsWithMinDistance = (means: IDataPoint[]): IDataPoint[] => {
  const minDistanceInEachDimension = 1;
  const isTooClose = (x: IDataPoint, y: IDataPoint) =>
    x
      .map((el, i) => Math.abs(el - y[i]))
      .some((el) => el < minDistanceInEachDimension);
  const newPoints = means.map((m) => randomPoint(m));
  console.log(newPoints);
  for (var i = 0; i < newPoints.length; i++) {
    for (var j = i+1; j < newPoints.length; j++) {
      if (isTooClose(newPoints[i], newPoints[j])) {
        return getRandomPointsWithMinDistance(means);
      }
    }
  }
  return newPoints;
};
//generates "numSamples" new points for both classes from a random variance and mean
export const newRandomData = (
  setCurrentData: setCurrentDataType,
  currentData: IData
) => {
  const dimensions = currentData.attrib.length;
  const numClasses = currentData.data.length;
  const numSamples = 5;
  const variance = 2;
  const means: IDataPoint[] = [];
  for (var i = 0; i < currentData.data.length; i++) {
    means.push(rand_0_10_point(dimensions));
  }
  const cls_points: IDataPoint[][] = [];
  for (i = 0; i < numClasses; i++) {
    cls_points.push([]);
  }
  cls_points.forEach((cl_points, index) => {
    for (var i = 0; i < numSamples; i++) {
      cl_points.push(randomPoint(means[index], variance));
    }
  });
  setCurrentData((prev) => {
    const newData: IData = { ...prev };
    cls_points.forEach((cl_points, i) => {
      newData.data[i].points = cl_points;
    });
    return newData;
  });
};
