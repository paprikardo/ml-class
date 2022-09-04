import hull from "hull.js";
import { IData, IDataPoint } from "../Data";
import { svmSeperatedPerfect } from "./classifier";
import { isOnLeftSideOfLine2Points } from "./linearLineHelpers";
import { selectDimSelectClassData } from "./selectData";

//Computes if two classes are seperable in 1D or 2D depending on data
//uses convex hull algorithm
export const isSeperable = (currentData: IData) => {
  const [c1, c2] = selectDimSelectClassData(currentData);
  if(c1.length==0 || c2.length==0){
    return true;
  }
  if (Array.isArray(currentData.selected_attrib)) {
    //2D case: run svm numberTries times and check if it fails all the time
    const numberTries = 3;
    var result = false;
    for (var i = 0; i < numberTries; i++) {
      if (svmSeperatedPerfect(c1, c2)) {
        result = true;
      }
    }
    return result;
  } else {
    //1D case: check if biggest in smaller class is smaller than smallest in bigger class
    const t1 = c1.map((p) => p[0]).sort((a, b) => a - b); //sorted arrays
    const t2 = c2.map((p) => p[0]).sort((a, b) => a - b); //sorted arrays
    const smallerClass = t1[0] < t2[0] ? t1 : t2;
    const biggerClass = t1[0] < t2[0] ? t2 : t1;
    console.log("sep:", smallerClass[smallerClass.length - 1] < biggerClass[0]);
    return smallerClass[smallerClass.length - 1] < biggerClass[0];
  }
};
// const classesSeperable2D = (c1: IDataPoint[], c2: IDataPoint[]): boolean => {
//   console.log(hull(c1, Infinity));
//   const hull1 = hull(c1, 100);
//   const hull2 = hull(c1, 100);
//   if (hull1.every((el) => el instanceof Array)) {
//     hull1.map((el) => isInsideHull(el, hull2));
//   }

//   return true;
// };

// const isInsideHull = (
//   point: IDataPoint | object,
//   hull: IDataPoint[] | object[]
// ) => {
//   //if "is on TODO side" for all lines defined by going around the hull
//   if(hull.length<3){
//     return true
//   }
//   var result = true;
//   for (var i = 1; i < hull.length; i++) {
//     if (!isOnLeftSideOfLine2Points(hull[i - 1], hull[i], point)) {
//       result = false;
//     }
//   }
//   return result;
// };
