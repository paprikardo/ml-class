import Layout1DUserClass from "../UserClassifier/Layout1DUserClass";
import { dummy2C3D1A, dummy2C2D1A } from "../../Data";
import InitModal from "../smallerComponents/InitModal";
import { useLevelUserClassGame } from "./useLevelUserClassGame";

export default ({
  dimensions,
  initModalTitle,
  initModalContent,
}: {
  dimensions: number; //dimensions of the points displayed in this 1D game level
  initModalTitle: string;
  initModalContent: string;
}): JSX.Element => {
  const dataset = dimensions == 2 ? dummy2C2D1A : dummy2C3D1A;
  const [currentData, setCurrentData,elements,onNextGameRound] = useLevelUserClassGame(dimensions, dataset);
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
