import React, { useEffect, useState } from "react";
import { IUserLineState } from "../components/Layout2DUserLine";
import { IData, IDataPoint } from "../Data";
import {
  computePercentAndWrongPoints1D,
  computePercentAndWrongPoints2D,
} from "./computeScore";

const waitTime = 2000;
export const useGameLogic = (
  currentData: IData,
  gameState: string,
  setGameState: React.Dispatch<React.SetStateAction<string>>,
  userClassifier: number | IUserLineState,
  resetUserClassifier: () => void,
  onNextGameRound?: () => void
): [boolean, IDataPoint[], string] => {
  const is1D = typeof userClassifier == "number"; //if true is 1D if not it is 2D
  //inititialize states
  const wrongClassPointsInit: IDataPoint[] = [];
  const [wrongClassifiedPoints, setWrongClassifiedPoints] =
    useState(wrongClassPointsInit);
  const [messageState, setMessageState] = useState("");
  const [hideUserClassifier, setHideUserClassifier] = useState(true);

  //initialization
  useEffect(() => {
    setHideUserClassifier(false);
  }, []);
  //updata game state
  useEffect(() => {
    if (gameState == "init") {
      setHideUserClassifier(true);
      setMessageState(
        is1D
          ? "Klicke und bestimme einen Punkt-Klassifikator, der die Daten möglichst gut voneinander trennt"
          : "Zeichne jetzt einen Klassifikator, der die Daten möglichst gut voneinander trennt"
      );
    }
    if (gameState == "line drawn") {
      setHideUserClassifier(false);
      const { percent, wrongPoints } = is1D
        ? computePercentAndWrongPoints1D(currentData, userClassifier)
        : computePercentAndWrongPoints2D(currentData, userClassifier);
      setWrongClassifiedPoints(wrongPoints);
      const res = Math.round(percent);
      if (res == 100) {
        setMessageState(
          "Du hast die Daten perfekt aufgeteilt. Sehr gut! Die Daten sind wohl separierbar!"
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
        resetUserClassifier();
        typeof onNextGameRound == "function" && onNextGameRound(); //if onNextGameRound is a function execute it
        setWrongClassifiedPoints([]); //reset the wrong classified points
        setGameState("init");
        clearInterval(interval);
      }, waitTime);
    }
  }, [gameState]);
  return [hideUserClassifier, wrongClassifiedPoints, messageState];
};
