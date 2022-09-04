import { IUserLineState } from "../components/UserClassifier/Layout2DUserClass";
import { IData } from "../Data";
import { isOnLeftSideOfLine } from "./linearLineHelpers";
import { selectDimSelectClassData } from "./selectData";

//compute the percent of correctly classified points by a user point classificator (1D) in percent and returns the wrong classified points
export const computePercentAndWrongPoints1D = (
  currentData: IData,
  userPointX: number
) => {
  const [pointsA, pointsB] = selectDimSelectClassData(currentData);
  if (!Array.isArray(currentData.selected_attrib)) {
    //points on left Side
    const pAonSide = pointsA.filter((point) => point[0] < userPointX);
    const pBonSide = pointsB.filter((point) => point[0] < userPointX);
    //percentage of points where A is left and B is right
    const percentage =
      (pAonSide.length + (pointsB.length - pBonSide.length)) /
      (pointsA.length + pointsB.length);
    if (percentage < 0.5) {
      //swap sides
      const wrongClassA = pAonSide;
      const wrongClassB = pointsB.filter((point) => !pBonSide.includes(point));
      return {
        percent: (1 - percentage) * 100, //convert to %
        wrongPoints: wrongClassA.concat(wrongClassB),
      };
    }
    const wrongClassA = pointsA.filter((point) => !pAonSide.includes(point));
    const wrongClassB = pBonSide;
    return {
      percent: percentage * 100, //convert to %
      wrongPoints: wrongClassA.concat(wrongClassB),
    };
  } else {
    console.log("ERROR: selAttrib should be 1D");
    return { percent: -1, wrongPoints: [] };
  }
};

export const computePercentAndWrongPoints2D = (
  currentData: IData,
  userLineState: IUserLineState
) => {
  const [pointsA, pointsB] = selectDimSelectClassData(currentData);
  const mUserLine =
    (userLineState.y2 - userLineState.y1) /
    (userLineState.x2 - userLineState.x1);
  const cUserLine = userLineState.y1 - mUserLine * userLineState.x1;
  const pAonSide = pointsA.filter(([x, y]) =>
    isOnLeftSideOfLine(mUserLine, cUserLine, x, y)
  );
  const pBonSide = pointsB.filter(([x, y]) =>
    isOnLeftSideOfLine(mUserLine, cUserLine, x, y)
  );
  const percentage =
    (pAonSide.length + (pointsB.length - pBonSide.length)) /
    (pointsA.length + pointsB.length);
  if (percentage < 0.5) {
    //set wrong classified points
    const wrongClassA = pAonSide;
    const wrongClassB = pointsB.filter((point) => !pBonSide.includes(point));
    //return result
    return {
      percent: (1 - percentage) * 100,
      wrongPoints: wrongClassA.concat(wrongClassB),
    }; //convert to %
  }
  //set wrong classified points
  const wrongClassA = pointsA.filter((point) => !pAonSide.includes(point));
  const wrongClassB = pBonSide;
  //return result
  return {
    percent: percentage * 100,
    wrongPoints: wrongClassA.concat(wrongClassB),
  }; //convert to %
};
