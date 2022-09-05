import { IData, IDataPoint } from "../../Data";

import RobotWrapper from "../RobotWrapper";
import NewPointTable from "../NewPointTable";
import MyPlot from "../EssentialComponents/MyPlot";
import { useState } from "react";
import { setCurrentDataType } from "../../Others/currentDataHelperMethods";
import GridLayout from "../EssentialComponents/GridLayout";
import { useGameLogic } from "./useGameLogic";
import { getMinMax, getScale } from "../../Others/myPlotHelpers";
import {
  selectDimSelectClassData,
  selectDimSelectClassDataScaled,
} from "../../Others/selectData";
export type IUserLineState = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};
function Layout2DUserClass({
  currentData,
  setCurrentData,
  onNextGameRound,
}: {
  currentData: IData;
  setCurrentData: setCurrentDataType;
  onNextGameRound: (perfectlySeperatedByUser: boolean) => void;
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
  const [hideRobotClassifier, wrongClassifiedPoints, messageState] =
    useGameLogic(
      currentData,
      gameState,
      setGameState,
      userLineState,
      resetUserClassifier,
      onNextGameRound
    );
  const enableUserDraw = true;

  const onMouseUpPlotHandler = () => {
    const minLengthForUserline = 3;
    if (enableUserDraw) {
      //if line is long enough to not be a mistake change state
      const [scaleX, scaleXInv, scaleY, scaleYInv] = getScale(
        ...getMinMax(selectDimSelectClassData(currentData))
      );
      if (
        Math.abs(scaleX(userLineState.x1) - scaleX(userLineState.x2)) +
          Math.abs(scaleY(userLineState.y1) - scaleY(userLineState.y2)) >
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

  return (
    <GridLayout currentData={currentData} setCurrentData={setCurrentData}>
      <MyPlot
        currentData={currentData}
        setCurrentData={setCurrentData}
        hideSplitLine={hideRobotClassifier}
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

export default Layout2DUserClass;
