import InitModal from "../smallerComponents/InitModal";
import Layout2DUserLine from "./layouts/Layout2DUserClass";
import { IData } from "../../Others/Data";
import { useRealDataLevel } from "./useRealDataLevel";
const RealDataLevel2D = ({
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
export default RealDataLevel2D
