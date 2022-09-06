import { Button, Stack, Text } from "@mantine/core";
import InitModal from "../smallerComponents/InitModal";
import Layout2DRobotLine from "../Layout2DRobotLine";
import { dummy2C2D, dummy2C3D } from "../../Others/Data";
import { useEffect, useState } from "react";
import { newMeans } from "../../Others/newMeans";
import { setDataSinglePoint } from "../../Others/currentDataHelperMethods";
import EndModal from "../smallerComponents/EndModal";
import BackToLevelSelectionButton from "../smallerComponents/BackToLevelSelectionButton";
import { isSeperable } from "../../Others/seperable";
export default ({
  initModalTitle,
  initModalContent,
  dimensions,
}: {
  initModalTitle: string;
  initModalContent: JSX.Element;
  dimensions: number;
}) => {
  const dataset = dimensions == 2 ? dummy2C2D : dummy2C3D;
  const [currentData, setCurrentData] = useState(dataset);
  const [gameAround, setGameAround] = useState(false); //if true the user wants to stay in the level and should not get the prompt all the time
  //EndModal
  const stayButton = (
    <Button
      onClick={() => {
        setGameAround(true);
        setLoseModalOpen(false);
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
  const [loseModalOpen, setLoseModalOpen] = useState(false);
  const endModalLose = (
    <EndModal
      opened={loseModalOpen}
      onClose={() => setLoseModalOpen(false)}
      title={"Daten sind nicht separierbar!"}
      key="endModalLose"
    >
      <Text>
        Die Daten sind nicht mehr linear separierbar! Die Klassifikatoren des
        Roboters können nicht mehr perfekt sein.
      </Text>
      {optionButtons}
    </EndModal>
  );
  if (!isSeperable(currentData) && !gameAround) {
    setLoseModalOpen(true);
    setGameAround(true);
  }
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      {endModalLose}
      <Layout2DRobotLine
        currentData={currentData}
        setCurrentData={setCurrentData}
      ></Layout2DRobotLine>
    </div>
  );
};
