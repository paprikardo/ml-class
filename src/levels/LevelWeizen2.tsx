import { useEffect } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { IData, IDataPoint, weizen2Dataset1D } from "../Data";
import InitModal from "../components/InitModal";

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
    setCurrentData(weizen2Dataset1D);
  }, []);

  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout1DUser
        currentData={currentData}
        setDataSinglePoint={setDataSinglePoint}
        setSelectedAttrib={setSelectedAttrib}
      ></Layout1DUser>
    </div>
  );
};
