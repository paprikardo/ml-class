import { IData, IDataPoint } from "./Data";
import { svmSeperatedPerfect } from "./classifier";
import { selectClassData } from "./selectData";

//Computes if two classes are seperable in 1D or 2D depending on data regarding all attributes
//If classes are seperable in any attribute/(s) it returns true, otherwise false
//uses convex hull algorithm
export const isSeperable = (currentData: IData) => {
  var res = false;
  const [c1, c2] = selectClassData(currentData);
  if (c1.length === 0 || c2.length === 0) {
    return true;
  }
  //check for all attributes
  const numAttrib = currentData.attrib.length;
  if (Array.isArray(currentData.selected_attrib)) {
    //2D case
    for (var i = 0; i < numAttrib; i++) {
      for (var j = i + 1; j < numAttrib; j++) {
        const mapToAttribs = (c: IDataPoint[]) => c.map((p) => [p[i], p[j]]);
        if (isSeperable2D(mapToAttribs(c1), mapToAttribs(c2))) {
          res = true;
        }
      }
    }
  } else {
    for (var k = 0; k < numAttrib; k++) {
      const mapToAttrib = (c: IDataPoint[]) => c.map((p) => [p[k]]);
      if (isSeperable1D(mapToAttrib(c1), mapToAttrib(c2))) {
        res = true;
      }
    }
  }
  return res;
};
//c1,c2: array of two dimensional points
//returns if the two are linearly seperable
//NOTE: This function computes the wrong result with a very small probability due to the unreliable svm performance
//Increase "numberTries" to be more accurate but less performant
const isSeperable2D = (c1: IDataPoint[], c2: IDataPoint[]) => {
  const numberTries = 5;
  var result = false;
  //compute svm numberTries times and check if perfectly separated ones
  for (var i = 0; i < numberTries; i++) {
    if (svmSeperatedPerfect(c1, c2)) {
      result = true;
    }
  }
  return result;
};
//c1,c2: array of one dimensional points
//returns if the two are seperable
const isSeperable1D = (c1: IDataPoint[], c2: IDataPoint[]) => {
  //1D case: check if biggest in smaller class is smaller than smallest in bigger class
  const t1 = c1.map((p) => p[0]).sort((a, b) => a - b); //sorted arrays
  const t2 = c2.map((p) => p[0]).sort((a, b) => a - b); //sorted arrays
  const smallerClass = t1[0] < t2[0] ? t1 : t2;
  const biggerClass = t1[0] < t2[0] ? t2 : t1;
  return smallerClass[smallerClass.length - 1] < biggerClass[0];
};