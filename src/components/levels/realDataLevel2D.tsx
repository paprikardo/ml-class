import { useState } from "react";
import InitModal from "../smallerComponents/InitModal";
import Layout2DUserLine from "../UserClassifier/Layout2DUserClass";
import { IData } from "../../Data";
import { useRealDataLevel } from "./useRealDataLevel";

export default ({
  initModalTitle,
  initModalContent,
  dataset,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
  dataset: IData;
}): JSX.Element => {
  const [currentData, setCurrentData,elements,onNextGameRound] = useRealDataLevel(dataset);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      {elements}
      <Layout2DUserLine
        currentData={currentData}
        setCurrentData={setCurrentData}
        onNextGameRound={onNextGameRound}
      ></Layout2DUserLine>
    </div>
  );
};
