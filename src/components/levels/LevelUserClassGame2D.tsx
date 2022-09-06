import { useEffect, useState } from "react";
import Layout2DUserClass from "../UserClassifier/Layout2DUserClass";
import { dummy2C3D, dummy2C2D, IData, IDataPoint } from "../../Others/Data";
import InitModal from "../smallerComponents/InitModal";
import { rand_0_10 } from "../../Others/Random";
import { newMeans } from "../../Others/newMeans";
import {
  addRandomPoint,
  setDataSinglePoint,
} from "../../Others/currentDataHelperMethods";
import { useLevelUserClassGame } from "./useLevelUserClassGame";

export default ({
  initModalTitle,
  initModalContent,
  dimensions,
}: {
  initModalTitle: string;
  initModalContent: JSX.Element;
  dimensions: number;
}): JSX.Element => {
  const dataset = dimensions == 2 ? dummy2C2D : dummy2C3D;
  const [currentData, setCurrentData, elements, onNextGameRound] =
    useLevelUserClassGame(dimensions, dataset);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      {elements}
      <Layout2DUserClass
        currentData={currentData}
        setCurrentData={setCurrentData}
        onNextGameRound={onNextGameRound}
      ></Layout2DUserClass>
    </div>
  );
};
