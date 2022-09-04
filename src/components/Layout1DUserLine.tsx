import { IData, IDataPoint } from "../Data";

import RobotWrapper from "./RobotWrapper";
import MyPlot from "./MyPlot";
import { useEffect, useRef, useState } from "react";
import { rand_0_10 } from "../Others/Random";
import {
  setCurrentDataType,
  setDataSinglePoint,
} from "../Others/currentDataHelperMethods";
import GridLayout from "./GridLayout";
import { computePercentAndWrongPoints1D } from "../Others/computeScore";
import { useGameLogic } from "../Others/UserLineGameLogic";
const Layout1DUser = ({
  currentData,
  setCurrentData,
  onNextGameRound,
}: {
  currentData: IData;
  setCurrentData: setCurrentDataType;
  onNextGameRound?: () => void;
}): JSX.Element => {
  const [gameState, setGameState] = useState("init");
  const [userPointXState, setUserPointXState] = useState(0);
  //helper method
  const resetUserClassifier = () => {
    setUserPointXState(0);
  };
  //game state logic
  const [hideUserClassifier, wrongClassifiedPoints, messageState] =
    useGameLogic(
      currentData,
      gameState,
      setGameState,
      userPointXState,
      resetUserClassifier,
      onNextGameRound
    );

  //Mouse plot handlers
  const onMouseUpPlotHandler = () => {
    setGameState("line drawn"); // set "line drawn" state (should be point drawn) when the click is done
  };
  const onMouseMovePlotHandler = (
    mouseHold: boolean,
    cursorpt: DOMPoint | undefined
  ) => {
    if (hideUserClassifier) {
      // only move the point when the point is "hidden", so in preview state
      setUserPointXState(cursorpt!.x);
    }
  };
  return (
    <GridLayout currentData={currentData} setCurrentData={setCurrentData}>
      <MyPlot
        currentData={currentData}
        setCurrentData={setCurrentData}
        previewUserPoint={hideUserClassifier} //"hidden" is identical to "just in preview"
        userPointXState={userPointXState} //
        onMouseUpPlotHandler={onMouseUpPlotHandler}
        onMouseMovePlotHandler={onMouseMovePlotHandler}
        enableUserDraw={true}
        isOneDimensional={true}
        wrongClassifiedPoints={wrongClassifiedPoints}
      ></MyPlot>
      <RobotWrapper message={<div>{messageState}</div>}></RobotWrapper>
    </GridLayout>
  );
};

export default Layout1DUser;
