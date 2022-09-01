import { useEffect } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { IData, IDataPoint, schierlingDataset } from "../Data";
import InitModal from "../components/InitModal";
import Layout2DUserLine from "../components/Layout2DUserLine";

export default ({
  currentData,
  setDataSinglePoint,
  setSelectedAttrib,
  setCurrentData,
  initModalTitle,
  initModalContent,
}: {
  currentData: IData;
  setDataSinglePoint: (means: IDataPoint[]) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
  setCurrentData: React.Dispatch<React.SetStateAction<IData>>;
  initModalTitle: string;
  initModalContent: React.ReactNode;
}): JSX.Element => {
  useEffect(() => {
    setCurrentData(schierlingDataset);
  }, []);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout2DUserLine
        currentData={currentData}
        setDataSinglePoint={setDataSinglePoint}
        setSelectedAttrib={setSelectedAttrib}
        onNextGameRound={() => 0}
      ></Layout2DUserLine>
    </div>
  );
};
