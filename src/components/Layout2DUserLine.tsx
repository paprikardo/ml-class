import { IData, IDataPoint } from "../Data";

import RobotWrapper from "./RobotWrapper";
import NewPointTable from "./NewPointTable";
import MyPlot from "./MyPlot";
import { useEffect, useRef, useState } from "react";
import { rand_0_10 } from "../Random";
function Layout2DUserLine({
  currentData,
  setDataSinglePoint,
  onNextGameRound,
  setSelectedAttrib,
}: {
  currentData: IData;
  setDataSinglePoint: (means: IDataPoint[]) => void;
  onNextGameRound: () => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
}): JSX.Element {
  const [gameState, setGameState] = useState("init");
  const [userLineState, setUserLineState] = useState({
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  });
  const resetUserLine = () => {
    setUserLineState({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    });
  };
  const [messageState, setMessageState] = useState("");

  const [selClassA, selClassB] = currentData.selected_class;
  const enableUserDraw = true;
  const [hideSplitLine, setHideSplitLine] = useState(true);
  const plotRef = useRef();
  //initialize game state
  useEffect(() => {
    setHideSplitLine(false);
  }, []);
  //game state logic
  const waitTime = 2000;
  useEffect(() => {
    if (gameState == "init") {
      setHideSplitLine(true);
      setMessageState(
        "Zeichne jetzt einen Klassifikator, der die Daten möglichst gut voneinander trennt "
      );
    }
    if (gameState == "line drawn") {
      setHideSplitLine(false);
      const res = Math.round(computeScore());
      if (res == 100) {
        setMessageState(
          "Du hast die Daten perfekt aufgeteilt. Sehr gut! Die Daten sind wohl linear separierbar"
        );
      } else {
        setMessageState(
          "Du hast " + res + " Prozent richtig klassifiziert. Sind die Daten noch linear separierbar?"
        );
      }
      //reset user line and change state after waiting
      const interval = setInterval(() => {
        resetUserLine();
        setGameState("init");
        onNextGameRound();
        clearInterval(interval);
      }, waitTime);
    }
  }, [gameState]);

  const computeScore = () => {
    const pointsA = currentData.data[selClassA].points;
    const pointsB = currentData.data[selClassB].points;
    const mUserLine =
      (userLineState.y2 - userLineState.y1) /
      (userLineState.x2 - userLineState.x1);
    const cUserLine = userLineState.y1 - mUserLine * userLineState.x1;
    const pAonSide = pointsA
      .map(([x, y]) => {
        return isOnOneSideOfLine(mUserLine, cUserLine, x, y);
      })
      .filter(Boolean).length;
    const pBonSide = pointsB
      .map(([x, y]) => {
        return isOnOneSideOfLine(mUserLine, cUserLine, x, y);
      })
      .filter(Boolean).length;
    const percentage =
      (pAonSide + (pointsB.length - pBonSide)) /
      (pointsA.length + pointsB.length);
    if (percentage < 0.5) {
      return (1 - percentage) * 100; //convert to %
    }
    return percentage * 100; //convert to %
  };
  const isOnOneSideOfLine = (
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

  const onMouseUpPlotHandler = () => {
    const minLengthForUserline = 3;
    if (enableUserDraw) {
      //if line is long enough to not be a mistake change state
      if (
        Math.abs(userLineState.x1 - userLineState.x2) +
          Math.abs(userLineState.y1 - userLineState.y2) >
        3
      ) {
        setGameState("line drawn");
      } else {
        setMessageState(
          "Dein gezeichneter Linien-Klassifikator ist zu kurz. Versuche es erneut."
        );
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
    <div>
      <MyPlot
        ref={plotRef}
        plot_data={currentData}
        addPoint={() => {
          return 0;
        }}
        hideSplitLine={hideSplitLine}
        userLineState={userLineState}
        onMouseUpPlotHandler={onMouseUpPlotHandler}
        onMouseDownPlotHandler={onMouseDownPlotHandler}
        onMouseMovePlotHandler={onMouseMovePlotHandler}
        enableUserDraw={enableUserDraw}
        setSelectedAttrib={setSelectedAttrib}
      ></MyPlot>
      <RobotWrapper message={<>{messageState}p</>}></RobotWrapper>
    </div>
  );
}

export default Layout2DUserLine;
