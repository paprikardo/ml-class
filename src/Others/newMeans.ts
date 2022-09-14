import { IDataPoint } from "./Data";
import { rand_0_10 } from "./random";

//computes new means for each class that have a minimum MSE of minMeanDistance
const minMeanDistance = 5;
export const newMeans = (numClasses:number,dimensions:number): IDataPoint[] => {
  const means: IDataPoint[] = [];
  for (var c = 0; c < numClasses; c++) {
    var classMean: IDataPoint = [];
    while (
      classMean.length === 0 ||
      means
        .map(
          (
            otherClassMean //map to array of distances to mean
          ) =>
            classMean
              .map((x, i) => Math.abs(x - otherClassMean[i]))
              .reduce((partialSum, a) => partialSum + a, 0)
        )
        .some((x) => x < minMeanDistance) //resample if some distance is smaller than minMeanDistance
    ) {
      classMean = [];
      for (var i = 0; i < dimensions; i++) {
        classMean.push(rand_0_10());
      }
    }
    means.push(classMean);
  }
  return means;
};