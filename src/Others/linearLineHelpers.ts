export const isOnLeftSideOfLine = (
  m: number, //m Steigung
  c: number, //c yAchensabschnitt
  x: number,
  y: number //x y , punkt
): boolean => {
  //point on line fullfills y = mx+c, we check if y > mx+c and invert result if smaller 50% because which side is for which class does not matter
  if (y > m * x + c) {
    return true;
  }
  return false;
};
//returns true if pclass is on the leftSide of the Line defined by p1 and p2
export const isOnLeftSideOfLine2Points = (
  p1: number[] | object,
  p2: [number, number] | object,
  pclass: [number, number] | object
): boolean => {
  if (Array.isArray(p1)) {
    const x = p1[0];
  }
  return true;
};
