import { IData, IDataPoint } from "../Data";

import RobotWrapper from "./RobotWrapper";
import MyPlot from "./MyPlot";
import { useEffect, useRef, useState } from "react";
import { rand_0_10 } from "../Others/Random";
import { setCurrentDataType, setDataSinglePoint } from "../Others/currentDataHelperMethods";
import GridLayout from "./GridLayout";
const Layout1DUser = ({
  currentData,
  setCurrentData,
  onNextGameRound
}: {
  currentData: IData;
  setCurrentData: setCurrentDataType;
  onNextGameRound?: () => void;
}): JSX.Element => {
  const [gameState, setGameState] = useState("init");
  const [userPointXState, setUserPointXState] = useState(0);
  const wrongClassPointsInit: IDataPoint[] = [];
  const [wrongClassifiedPoints, setWrongClassifiedPoints]: [
    IDataPoint[],
    (x: IDataPoint[]) => void
  ] = useState(wrongClassPointsInit);
  const resetUserLine = () => {
    setUserPointXState(0);
  };
  const [messageState, setMessageState] = useState("");
  const [selClassA, selClassB] = currentData.selected_class;
  
  const [hideSplitPoint, setHideSplitPoint] = useState(true);
  //initialize game state
  useEffect(() => {
    setHideSplitPoint(false);
  }, []);
  //game state logic
  const waitTime = 2000;
  useEffect(() => {
    if (gameState == "init") {
      setHideSplitPoint(true);
      setMessageState(
        "Klicke und bestimme einen Punkt-Klassifikator, der die Daten möglichst gut voneinander trennt "
      );
    }
    if (gameState == "line drawn") {
      setHideSplitPoint(false);
      const res = Math.round(computeScore());
      if (res == 100) {
        setMessageState(
          "Du hast die Daten perfekt aufgeteilt. Sehr gut! Die Daten sind wohl separierbar"
        );
      } else {
        setMessageState(
          "Du hast " +
            res +
            " Prozent richtig klassifiziert. Sind die Daten noch separierbar?"
        );
      }
      //reset user line and change state after waiting
      const interval = setInterval(() => {
        resetUserLine();
        typeof onNextGameRound == "function" && onNextGameRound(); //if onNextGameRound is a function execute it
        setWrongClassifiedPoints([]); //reset the wrong classified points
        setGameState("init");
        clearInterval(interval);
      }, waitTime);
    }
  }, [gameState]);
  //compute the score of the user point classificator in percent
  const computeScore = () => {
    const pointsA = currentData.data[selClassA].points;
    const pointsB = currentData.data[selClassB].points;
    if (!Array.isArray(currentData.selected_attrib)) {
      const selAttrib = currentData.selected_attrib;
      //points on left Side
      const pAonSide = pointsA.filter(
        (point) => point[selAttrib] < userPointXState
      );
      const pBonSide = pointsB.filter(
        (point) => point[selAttrib] < userPointXState
      );
      //percentage of points where A is left and B is right
      const percentage =
        (pAonSide.length + (pointsB.length - pBonSide.length)) /
        (pointsA.length + pointsB.length);
      if (percentage < 0.5) {
        //swap sides
        const wrongClassA = pAonSide;
        const wrongClassB = pointsB.filter(
          (point) => !pBonSide.includes(point)
        );
        setWrongClassifiedPoints(wrongClassA.concat(wrongClassB));
        return (1 - percentage) * 100; //convert to %
      }
      const wrongClassA = pointsA.filter((point) => !pAonSide.includes(point));
      const wrongClassB = pBonSide;
      setWrongClassifiedPoints(wrongClassA.concat(wrongClassB));
      return percentage * 100; //convert to %
    } else {
      console.log("ERROR: selAttrib should be 1D");
      return -1;
    }
  };
  //Mouse plot handlers
  const onMouseUpPlotHandler = () => {
    setGameState("line drawn"); // set "line drawn" state (should be point drawn) when the click is done
  };
  const onMouseMovePlotHandler = (
    mouseHold: boolean,
    cursorpt: DOMPoint | undefined
  ) => {
    if (hideSplitPoint) {
      // only move the point when the point is "hidden", so in preview state
      setUserPointXState(cursorpt!.x);
    }
  };
  return (
    <GridLayout currentData={currentData} setCurrentData={setCurrentData}>
      <MyPlot
        currentData={currentData}
        setCurrentData={setCurrentData}
        previewUserPoint={hideSplitPoint} //"hidden" is identical to "just in preview"
        userPointXState={userPointXState} //
        onMouseUpPlotHandler={onMouseUpPlotHandler}
        onMouseMovePlotHandler={onMouseMovePlotHandler}
        enableUserDraw={true}
        isOneDimensional={true}
        wrongClassifiedPoints={wrongClassifiedPoints}
      ></MyPlot>
      <RobotWrapper message={<>{messageState}</>}></RobotWrapper>
    </GridLayout>
  );
};

export default Layout1DUser;
