import Layout1DUserClass from "./layouts/Layout1DUserClass";
import InitModal from "../smallerComponents/InitModal";
import { IData } from "../../Others/Data";
import { useRealDataLevel } from "./useRealDataLevel";

const RealDataLevel1D = ({
  initModalTitle,
  initModalContent,
  dataset,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
  dataset: IData;
}): JSX.Element => {
  const dataset1D = { ...dataset };
  dataset1D.selected_attrib = 0;
  const [currentData, setCurrentData, elements, onNextGameRound] =
    useRealDataLevel(dataset1D);
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

export default RealDataLevel1D;
