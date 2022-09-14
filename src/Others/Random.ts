import { IDataPoint } from "./Data";

export function rand_0_10() {
  return Math.random() * 10;
}
// a dim-dimensional random point with values between zero and 10
export function rand_0_10_point(dim: number):IDataPoint {
  const p = [];
  for (var i = 0; i < dim; i++) {
    p.push(rand_0_10());
  }
  return p;
}
//return a random number with given mean and variance
export function randn_bm(mean: number, variance: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num * Math.sqrt(variance) + mean; // Translate to 0 -> 1
  if (num > 10 || num < 0) return randn_bm(mean, variance); // resample between 0 and 1
  return parseFloat(num.toFixed(4));
}

export function randomPoint(cl_mean: IDataPoint, variance:number=2): IDataPoint {
  return cl_mean.map((x) => randn_bm(x, variance));
}
