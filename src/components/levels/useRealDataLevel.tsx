import { Button, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IData } from "../../Others/Data";
import { setCurrentDataType } from "../../Others/currentDataHelperMethods";
import { isSeperable } from "../../Others/seperable";
import BackToLevelSelectionButton from "../smallerComponents/BackToLevelSelectionButton";
import EndModal from "../smallerComponents/EndModal";
export const useRealDataLevel = (
  dataset: IData
): [
  IData,
  setCurrentDataType,
  JSX.Element[],
  (perfectlySeperatedByUser: boolean) => void
] => {
  //managing states
  const [currentData, setCurrentData] = useState(dataset);
  const [numTries, setNumTries] = useState(0);
  const [gameAround, setGameAround] = useState(false); //if true the user wants to stay in the level and should not get the prompt all the time
  const [winModalOpen, setWinModalOpen] = useState(false);
  const [loseModalOpen, setLoseModalOpen] = useState(false);
  //EndModal
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
      {stayButton}
      <BackToLevelSelectionButton></BackToLevelSelectionButton>
    </Stack>
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
          Gut gemacht! Du hast das Datenset bei{" "}
          {Array.isArray(currentData.selected_attrib)
            ? 'den Attributen "' +
              currentData.attrib[currentData.selected_attrib[0]] +
              '" und "' +
              currentData.attrib[currentData.selected_attrib[1]] +
              '"'
            : 'dem Attribut "' +
              currentData.attrib[currentData.selected_attrib] +
              '"'}{" "}
          perfekt separieren können!
        </Text>
        {optionButtons}
      </Stack>
    </EndModal>
  );
  const endModalLose = (
    <EndModal
      opened={loseModalOpen}
      onClose={() => setLoseModalOpen(false)}
      title={"Daten sind nicht separierbar"}
      key="endModalLose"
    >
      <Text>
        Die Daten sind, wie du vermutlich schon bemerkt hast, nicht separierbar.
        Es kann in vielen Szenarien trotzdem Sinn machen einen möglichst guten
        Klassifikator zu bestimmen. Möchtest du weiter herumprobieren, oder zu
        einem anderen Level wechseln?
      </Text>
      {optionButtons}
    </EndModal>
  );
  //On Next Game Round, Same method as for the 2D case
  const maxNumTries = 5;
  const onNextGameRound = (perfectlySeperatedByUser: boolean) => {
    const seperable = isSeperable(currentData);
    if (seperable) {
      if (!gameAround && perfectlySeperatedByUser) {
        setWinModalOpen(true);
      }
    } else {
      setNumTries((t) => t + 1);
    }
    if (!gameAround && numTries >= maxNumTries) {
      setLoseModalOpen(true);
    }
  };
  return [
    currentData,
    setCurrentData,
    [endModalWin, endModalLose],
    onNextGameRound,
  ];
};
