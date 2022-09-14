import Layout1DUserClass from "./layouts/Layout1DUserClass";
import { dummy2C3D1A, dummy2C2D1A } from "../../Others/Data";
import InitModal from "../smallerComponents/InitModal";
import { useLevelUserClassGame } from "./useLevelUserClassGame";

const LevelUserClassGame1D = ({
  dimensions,
  initModalTitle,
  initModalContent,
}: {
  dimensions: number; //dimensions of the points displayed in this 1D game level
  initModalTitle: string;
  initModalContent: JSX.Element;
}): JSX.Element => {
  const dataset = dimensions === 2 ? dummy2C2D1A : dummy2C3D1A;
  const [currentData, setCurrentData, elements, onNextGameRound] =
    useLevelUserClassGame(dimensions, dataset);
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

export default LevelUserClassGame1D;
