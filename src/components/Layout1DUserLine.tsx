import { IData, IDataPoint } from "../Data";

import RobotWrapper from "./RobotWrapper";
import MyPlot from "./MyPlot";
import { useEffect, useRef, useState } from "react";
import { rand_0_10 } from "../Random";
const Layout1DUser = ({
  currentData,
  setDataSinglePoint,
  addRandomPoint,
  setSelectedAttrib,
}: {
  currentData: IData;
  changePoint: (cl: number, key: number, new_point: IDataPoint) => void;
  addPoint: (cl: number, new_point: IDataPoint) => void;
  setDataSinglePoint: (means: IDataPoint[]) => void;
  addRandomPoint: (means: IDataPoint[], variance?: number) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
}): JSX.Element => {
  const [gameState, setGameState] = useState("init");
  const [userPointXState, setUserPointXState] = useState(0);
  const resetUserLine = () => {
    setUserPointXState(0);
  };
  const [messageState, setMessageState] = useState("");
  const dimensions = currentData.attrib.length;
  const numClasses = currentData.data.length;
  const meansInit: IDataPoint[] = [];
  for (var c = 0; c < numClasses; c++) {
    const classMean = [];
    for (var i = 0; i < dimensions; i++) {
      classMean.push(rand_0_10());
    }
    meansInit.push(classMean);
  }
  const [classMeans] = useState(meansInit);
  const [selClassA, selClassB] = currentData.selected_class;
  const enableUserDraw = true;
  const [hideSplitPoint, setHideSplitPoint] = useState(true);
  //initialize game state
  useEffect(() => {
    setHideSplitPoint(false);
    setDataSinglePoint(classMeans);
  }, []);
  //game state logic
  const waitTime = 2000;
  useEffect(() => {
    if (gameState == "init") {
      setHideSplitPoint(true);
      setMessageState(
        "Zeichne jetzt einen Klassifikator, der die Daten möglichst gut voneinander trennt "
      );
      console.log(
        "Zeichne jetzt einen Klassifikator, der die Daten möglichst gut voneinander trennt "
      );
    }
    if (gameState == "line drawn") {
      setHideSplitPoint(false);
      const res = Math.round(computeScore());
      setMessageState(
        "Du hast " + res + " Prozent richtig klassifiziert. Sehr gut!"
      );
      console.log(
        "Du hast " + res + " Prozent richtig klassifiziert. Sehr gut!"
      );
      //reset user line and change state after waiting
      const interval = setInterval(() => {
        resetUserLine();
        setGameState("init");
        clearInterval(interval);
      }, waitTime);
    }
  }, [gameState]);
  console.log(currentData);
  const computeScore = () => {
    const pointsA = currentData.data[selClassA].points;
    const pointsB = currentData.data[selClassB].points;
    var percentage = -5; //random value, should never be used
    if (!Array.isArray(currentData.selected_attrib)) {
      const selAttrib = currentData.selected_attrib;
      const pAonSide = pointsA.filter(
        (point) => point[selAttrib] < userPointXState
      ).length;
      const pBonSide = pointsB.filter(
        (point) => point[selAttrib] < userPointXState
      ).length;
      percentage =
        (pAonSide + (pointsB.length - pBonSide)) /
        (pointsA.length + pointsB.length);
    } else {
      console.log("ERROR: selAttrib should be 1D");
    }
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
    <div>
      <MyPlot
        plot_data={currentData}
        addPoint={() => {
          return 0;
        }}
        previewUserPoint={hideSplitPoint} //"hidden" is identical to "just in preview"
        userPointXState={userPointXState} //
        onMouseUpPlotHandler={onMouseUpPlotHandler}
        onMouseMovePlotHandler={onMouseMovePlotHandler}
        enableUserDraw={enableUserDraw}
        setSelectedAttrib={setSelectedAttrib}
      ></MyPlot>
      <RobotWrapper class_result={messageState}></RobotWrapper>
    </div>
  );
};

export default Layout1DUser;