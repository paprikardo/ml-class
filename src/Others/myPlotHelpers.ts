import { IDataPoint } from "./Data";

const getAllPointsX = (
  selectedClassPoints: [IDataPoint[], IDataPoint[]] //extract all x values
) =>
  selectedClassPoints
    .map((clp) => clp.map((p) => p[0]))
    .toString()
    .split(",")
    .map(Number); //extract x coords and flatten array
const getAllPointsY = (
  selectedClassPoints: [IDataPoint[], IDataPoint[]] //extract all y values
) =>
  selectedClassPoints
    .map((clp) => clp.map((p) => p[1]))
    .toString()
    .split(",")
    .map(Number); //extract x coords and flatten array
//args: selectedClassPoints (use selectDimSelectClassData(currentData);)
//returns [xmin,xmax,ymin,ymax]
export const getMinMax = (
  selectedClassPoints: [IDataPoint[], IDataPoint[]]
): [number, number, number, number] => {
  const xmin = Math.min(...getAllPointsX(selectedClassPoints));
  var xmax = Math.max(...getAllPointsX(selectedClassPoints));
  const ymin = Math.min(...getAllPointsY(selectedClassPoints));
  var ymax = Math.max(...getAllPointsY(selectedClassPoints));
  if (xmin === xmax && xmin === 0) {
    //data is empty, set xmax to some value so plot does not collapse
    xmax = 15;
    ymax = 15;
  }
  return [xmin, xmax, ymin, ymax];
};
//Plot Scaling
const afterScalingIntervall = 15;
//if v=vmin it is mapped to itself. All other values are mapped proportionally to its distance such that vmax is mapped to vmin + afterScalingMaxIntervall
const scale = (v: number, vmin: number, vmax: number) => {
  if (vmin === vmax) {
    return v;
  }
  return vmin + (afterScalingIntervall * (v - vmin)) / (vmax - vmin);
};
//inverse
const scaleInv = (v: number, vmin: number, vmax: number) => {
  if (vmin === vmax) {
    return v;
  }
  return vmin + ((v - vmin) * (vmax - vmin)) / afterScalingIntervall;
};
//params: Min and Max values for x and y
//return [scaleX,scaleXInv,scaleY,scaleYInv]
export const getScale = (
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number
) => {
  return [
    (x: number) => scale(x, xmin, xmax), //scaleX
    (x: number) => scaleInv(x, xmin, xmax),//scaleXInv
    (y: number) => scale(y, ymin, ymax),//scaleY
    (y: number) => scaleInv(y, ymin, ymax),//scaleYInv
  ];
};
