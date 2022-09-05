import { Button, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IData } from "../../Data";
import {
  addRandomPoint,
  setCurrentDataType,
  setDataSinglePoint,
} from "../../Others/currentDataHelperMethods";
import { newMeans } from "../../Others/newMeans";
import { isSeperable } from "../../Others/seperable";
import BackToLevelSelectionButton from "../smallerComponents/BackToLevelSelectionButton";
import EndModal from "../smallerComponents/EndModal";
import GameScore from "../smallerComponents/GameScore";

export const useLevelUserClassGame = (
  dimensions: number,
  dataset: IData
): [
  IData,
  setCurrentDataType,
  JSX.Element[],
  (perfectlySeperatedByUser: boolean) => void
] => {
  //managing states
  const [currentData, setCurrentData] = useState(dataset);
  const numClasses = dataset.data.length;
  const [classMeans, setClassMeans] = useState(
    newMeans(numClasses, dimensions)
  );
  const [gameAround, setGameAround] = useState(false); //if true the user wants to stay in the level and should not get the prompt all the time
  //game score
  const [gameScore, setGameScore] = useState(0);
  const maxGameScore = 20;
  //initialize dataset to single point
  useEffect(() => {
    setDataSinglePoint(setCurrentData, classMeans);
  }, []);
  //EndModal
  const navigate = useNavigate();
  const retryButton = (
    <Button
      onClick={() => {
        navigate(0); //refresh page
      }}
    >
      Nochmal versuchen
    </Button>
  );
  const stayButton = (
    <Button
      onClick={() => {
        setGameAround(true);
        setLoseModalOpen(false);
        setWinModalOpen(false);
      }}
    >
      Bleibe hier
    </Button>
  );
  const optionButtons = (
    <Stack align="center">
      {retryButton}
      {stayButton}
      <BackToLevelSelectionButton></BackToLevelSelectionButton>
    </Stack>
  );
  const [winModalOpen, setWinModalOpen] = useState(false);
  const [loseModalOpen, setLoseModalOpen] = useState(false);
  const endModalLose = (
    <EndModal
      opened={loseModalOpen}
      onClose={() => setLoseModalOpen(false)}
      title={"Daten sind nicht separierbar"}
      key="endModalLose"
    >
      <Text>
        Die Daten sind nicht mehr separierbar. Es kann in vielen Szenarien
        trotzdem Sinn machen einen möglichst guten Klassifikator zu bestimmen.
        Möchtest du weiter herumprobieren und versuchen einen zu finden, das
        Level neu starten, oder zu einem anderen Level wechseln?
      </Text>
      {optionButtons}
    </EndModal>
  );
  const endModalWin = (
    <EndModal
      opened={winModalOpen}
      onClose={() => setWinModalOpen(false)}
      title={"Daten erfolgreich separiert!"}
      key="endModalWin"
    >
      <Stack align="center">
        <Text align="center">
          Gut gemacht! Du hast {maxGameScore} von {maxGameScore} mal richtig
          klassifiziert!"
        </Text>
        {optionButtons}
      </Stack>
    </EndModal>
  );
  //On Next Game Round, Same method as for the 2D case
  const onNextGameRound = (perfectlySeperatedByUser: boolean) => {
    const seperable = isSeperable(currentData);
    if (!seperable && !gameAround) {
      setLoseModalOpen(true);
    }
    if (perfectlySeperatedByUser) {
      setGameScore((s) => s + 1);
    }
    addRandomPoint(setCurrentData, classMeans);
    if (
      gameScore >= maxGameScore - 1 &&
      perfectlySeperatedByUser &&
      !gameAround
    ) {
      setWinModalOpen(true);
    }
  };
  return [
    currentData,
    setCurrentData,
    [
      <GameScore
        gameScore={gameScore}
        maxGameScore={maxGameScore}
        key={gameScore}
      />,
      endModalWin,
      endModalLose,
    ],
    onNextGameRound,
  ];
};
