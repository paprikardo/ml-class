export function rand_0_10() {
  return Math.random() * 10;
}
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