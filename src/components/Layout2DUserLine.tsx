import { IData, IDataPoint } from "../Data";

import RobotWrapper from "./RobotWrapper";
import NewPointTable from "./NewPointTable";
import MyPlot from "./MyPlot";
import { useEffect, useRef, useState } from "react";
import { rand_0_10 } from "../Others/Random";
import { setCurrentDataType } from "../Others/currentDataHelperMethods";
import LevelLayout from "./GridLayout";
import { Grid } from "@mantine/core";
import GridLayout from "./GridLayout";
import { isLinearSeperable } from "../Others/classifier";
import { selectDimSelectClassData } from "../Others/selectData";
import { computePercentAndWrongPoints2D } from "../Others/computeScore";
import { useGameLogic } from "../Others/UserLineGameLogic";
export type IUserLineState = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};
function Layout2DUserLine({
  currentData,
  setCurrentData,
  onNextGameRound,
}: {
  currentData: IData;
  setCurrentData: setCurrentDataType;
  onNextGameRound: () => void;
}): JSX.Element {
  const [gameState, setGameState] = useState("init");
  const [userLineState, setUserLineState]: [
    IUserLineState,
    React.Dispatch<React.SetStateAction<IUserLineState>>
  ] = useState({
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  });
  //helper method
  const resetUserClassifier = () => {
    setUserLineState({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    });
  };
  //game state logic
  const [hideUserClassifier, wrongClassifiedPoints, messageState] =
    useGameLogic(
      currentData,
      gameState,
      setGameState,
      userLineState,
      resetUserClassifier,
      onNextGameRound
    );
  const enableUserDraw = true;
  const [hideSplitLine, setHideSplitLine] = useState(true);

      
  //TODO
  const onMouseUpPlotHandler = () => {
    const minLengthForUserline = 3;
    if (enableUserDraw) {
      //if line is long enough to not be a mistake change state
      if (
        Math.abs(userLineState.x1 - userLineState.x2) +
          Math.abs(userLineState.y1 - userLineState.y2) >
        2
      ) {
        setGameState("line drawn");
      } else {
        // setMessageState(
        //   "Dein gezeichneter Linien-Klassifikator ist zu kurz. Versuche es erneut."
        // );
      }
    }
  };
  const onMouseMovePlotHandler = (
    mouseHold: boolean,
    cursorpt: DOMPoint | undefined
  ) => {
    if (enableUserDraw && mouseHold) {
      //setting the second point of the line if mouse was not released (if mouseHold)
      setUserLineState(
        (prev: { x1: number; x2: number; y1: number; y2: number }) => {
          const nx2 = cursorpt!.x;
          const ny2 = cursorpt!.y;
          return { ...prev, x2: nx2, y2: ny2 };
        }
      );
    }
  };

  const onMouseDownPlotHandler = (cursorpt: DOMPoint | undefined) => {
    if (enableUserDraw) {
      //setting the first point of the line, ALSO the second to the same to avoid weird behaviour
      setUserLineState(
        (prev: { x1: number; x2: number; y1: number; y2: number }) => {
          return {
            x1: cursorpt!.x,
            y1: cursorpt!.y,
            x2: cursorpt!.x,
            y2: cursorpt!.y,
          }; //-y since y coordinate was flipped
        }
      );
    }
  };
  //Is linearly seperable
  isLinearSeperable(...selectDimSelectClassData(currentData));

  return (
    <GridLayout currentData={currentData} setCurrentData={setCurrentData}>
      <MyPlot
        currentData={currentData}
        setCurrentData={setCurrentData}
        hideSplitLine={hideSplitLine}
        userLineState={userLineState}
        onMouseUpPlotHandler={onMouseUpPlotHandler}
        onMouseDownPlotHandler={onMouseDownPlotHandler}
        onMouseMovePlotHandler={onMouseMovePlotHandler}
        enableUserDraw={enableUserDraw}
        wrongClassifiedPoints={wrongClassifiedPoints}
      ></MyPlot>
      <RobotWrapper message={<>{messageState}</>}></RobotWrapper>
    </GridLayout>
  );
}

export default Layout2DUserLine;
