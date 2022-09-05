import hull from "hull.js";
import { IData, IDataPoint } from "../Data";
import { selectDimSelectClassData } from "./selectData";
//This class implements the used classifiers

//SVM method "svm"
const svmjs = require("svm");
//c1 and c2 are the arrays of 2D or 1D data points, i.e. the selection to 2 features/1 feature has to happen before calling this function, use getSelectedData() for the selection
//returns the SVM weights AND if the SVM seperated the points perfectly
const computeSVM = (c1: IDataPoint[], c2: IDataPoint[]) => {
  if (![1, 2].includes(c1[0].length) || ![1, 2].includes(c2[0].length)) {
    console.log(
      "ERROR: Calles SVM with wrong input dimensions. Maybe you have not selected the 2 or 1 distincitive features"
    );
  }
  const data = [...c1, ...c2];
  const labels: [number][] = [
    ...new Array(c1.length).fill(-1),
    ...new Array(c2.length).fill(1),
  ];
  const svm = new svmjs.SVM();
  //const trainstats
  svm.train(data, labels, { kernel: "linear", C: Number.MAX_SAFE_INTEGER }); // C is a parameter to SVM, we pick 2^32
  const c1Margins: number[] = svm.margins(c1);
  const c2Margins: number[] = svm.margins(c2);
  var seperatedData = true;
  if (c1Margins.some((x) => x > 0) || c2Margins.some((x) => x < 0)) {
    seperatedData = false;
  }
  const w = svm.getWeights();
  return { weights: w, seperatedData: seperatedData };
};

//helper
export const svmSeperatedPerfect = (c1: IDataPoint[], c2: IDataPoint[]) => {
  if (c1.length === 0 || c2.length === 0) {
    return true;
  }
  return computeSVM(c1, c2).seperatedData;
};

//Heuristical method point classifier, "heu"
//We define a "smallerClass" that has a smaller minimal point and a "biggerClass" that has a bigger minimal point.
//We then iterate through the points in the smaller class (descending) and the ones in the bigger class (ascending)
//If the points do overlap (not linearly seperable), we continue until they do not
//then we return the mean of the two points
//If the points do overlap, we do the same
const computePointHeu = (c1: IDataPoint[], c2: IDataPoint[]) => {
  const t1 = c1.map((p) => p[0]).sort((a, b) => a - b); //sorted arrays
  const t2 = c2.map((p) => p[0]).sort((a, b) => a - b); //sorted arrays
  const smallerClass = [...(t1[0] < t2[0] ? t1 : t2)].reverse(); //reverse the elements so that biggest first
  const biggerClass = t1[0] < t2[0] ? t2 : t1;
  for (var i = 0; i < t1.length; i++) {
    if (smallerClass[i] > biggerClass[i]) {
      //console.log("NONSEP");
    } else {
      return aritMean(biggerClass[i], smallerClass[i]);
    }
  }
  console.log("ERROR: This should never happen. Concept of algorithm is wrong");
  return -1;
};

//Helper methods
const aritMean = (m1: number, m2: number) => {
  return (m1 + m2) / 2;
};
const getDiffLineGeneratorFromWeights = (w: { w: number[]; b: number }) => {
  if (w.w.length != 2) {
    console.log(
      "ERROR: tried to compute Line Generator with dimensions: " + w.w.length
    );
  }
  return (
    x: number // X*w +b = x0*w0+x1*w1 + b = pred = 0,  so therefore
  ) => (x * w["w"][0] + w["b"]) / -w["w"][1]; // "y" = x1 = -(x0*w0+b)/w1
};
const getDiffPointFromWeights = (w: { w: number[]; b: number }) => {
  if (w.w.length != 1) {
    console.log(
      "ERROR: tried to compute Diff Point with dimensions: " + w.w.length
    );
  }
  return -w.b / w.w[0]; // X*w +b = x0*w0 + b = pred = 0,  so therefore x0 = -b/w0
};

//Computes the point classifier that tries to seperate the points in c1 and c2 and returns its x-coordinate.
//params: c1 and c2 are expected to be arrays of 1D points
// Use selectDimSelectClassDataScaled before calling this
//        alg says what kind of algorithm it uses for the computation. "heu" or "svm"
export const getDiffPoint = (
  c1: IDataPoint[],
  c2: IDataPoint[],
  alg: string = "heu"
): number => {
  if (!(c1[0].length == 1 && c1[0].length == 1)) {
    //input must be array of 1-dimensional points
    console.log(
      "ERROR: Called with wrong input dimensions: " +
        c1[0].length +
        ". Maybe you have not selected the distincitive feature"
    );
  }
  if (alg == "svm") {
    const weights = computeSVM(c1, c2).weights;
    return getDiffPointFromWeights(weights);
  } else {
    return computePointHeu(c1, c2);
  }
};
//Computes the line classifier that tries to seperate the points in c1 and c2 and returns its generator function.
// the generator function takes an arbitrary x-value and returns the corresponding y value for the function
// Use selectDimSelectClassDataScaled before calling this
//params: c1 and c2 are expected to be arrays of 2D points
//        alg says what kind of algorithm it uses for the computation. "heu" or "svm"
export const getDiffLineGenerator = (
  c1: IDataPoint[],
  c2: IDataPoint[],
  alg: string = "svm"
): ((x: number) => number) => {
  if (c1.length === 0 || c2.length === 0) {
    return () => 0;
  }
  if (!(c1[0].length == 2 && c1[0].length == 2)) {
    //input must be array of 2-dimensional points
    console.log(
      "ERROR: Called with wrong input dimensions: " +
        c1[0].length +
        ". Maybe you have not selected the 2 distincitive features"
    );
  }
  if (alg == "svm") {
    const weights = computeSVM(c1, c2);
    return getDiffLineGeneratorFromWeights(weights.weights);
  } else {
    return () => 0;
  }
};
