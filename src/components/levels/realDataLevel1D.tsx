import { useState } from "react";
import Layout1DUserClass from "../UserClassifier/Layout1DUserClass";
import InitModal from "../smallerComponents/InitModal";
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
  const dataset1D = { ...dataset };
  dataset.selected_attrib = 0;
  const [currentData, setCurrentData,elements,onNextGameRound] = useRealDataLevel(dataset);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      {elements}
      <Layout1DUserClass
        currentData={currentData}
        setCurrentData={setCurrentData}
        onNextGameRound={onNextGameRound}
      ></Layout1DUserClass>
    </div>
  );
};
