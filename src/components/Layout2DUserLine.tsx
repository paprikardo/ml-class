import { IData, IDataPoint } from "../Data";

import RobotWrapper from "./RobotWrapper";
import NewPointTable from "./NewPointTable";
import MyPlot from "./MyPlot";
import { useEffect, useRef, useState } from "react";
import { rand_0_10 } from "../Random";
function Layout2DUserLine({
  currentData,
  setDataSinglePoint,
  addRandomPoint,
  setSelectedAttrib
}: {
  currentData: IData;
  changePoint: (cl: number, key: number, new_point: IDataPoint) => void;
  addPoint: (cl: number, new_point: IDataPoint) => void;
  setDataSinglePoint: (means:IDataPoint[]) => void;
  addRandomPoint: (means: IDataPoint[], variance?: number) => void;
  setSelectedAttrib:(xAxisAttrib: number, yAxisAttrib: number) => void
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

  const [mean_CLASS_A] = useState([rand_0_10(), rand_0_10()]);
  const [mean_CLASS_B] = useState([rand_0_10(), rand_0_10()]);
  const [selClassA,selClassB] = currentData.selected_class
  const enableUserDraw = true;
  const [hideSplitLine, setHideSplitLine] = useState(true);
  const plotRef = useRef();
  //initialize game state
  useEffect(() => {
    setHideSplitLine(false);
    setDataSinglePoint([mean_CLASS_A,mean_CLASS_B])
  }, []);
  //game state logic
  const waitTime = 1000;
  useEffect(() => {
    if (gameState == "init") {
      setHideSplitLine(true);
      console.log(
        "Zeichne jetzt einen Klassifikator, der die Daten möglichst gut voneinander trennt "
      );
    }
    if (gameState == "line drawn") {
      setHideSplitLine(false);
      const res = computeScore();
      console.log(
        "Du hast " + res + " Prozent richtig klassifiziert. Sehr gut!"
      );
      //reset user line and change state after waiting
      const interval = setInterval(() => {
        resetUserLine();
        setGameState("init");
        addRandomPoint([mean_CLASS_A, mean_CLASS_B]);
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
    if (enableUserDraw) {
      //if line is long enough to not be a mistake change state
      if (
        Math.abs(userLineState.x1 - userLineState.x2) +
          Math.abs(userLineState.y1 - userLineState.y2) >
        3
      ) {
        setGameState("line drawn");
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
          const ny2 = -cursorpt!.y; //-y since y coordinate was flipped
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
            y1: -cursorpt!.y,
            x2: cursorpt!.x,
            y2: -cursorpt!.y,
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
    </div>
  );
}

export default Layout2DUserLine;
