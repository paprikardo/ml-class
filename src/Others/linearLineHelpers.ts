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

