import { useEffect, useState } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { IData, IDataPoint, schierlingDataset } from "../Data";
import InitModal from "../components/InitModal";
import Layout2DUserLine from "../components/Layout2DUserLine";
import { setCurrentDataType } from "../Others/currentDataHelperMethods";

export default ({
  initModalTitle,
  initModalContent,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
}): JSX.Element => {
  const dataset = schierlingDataset;
  const [currentData, setCurrentData] = useState(dataset);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout2DUserLine
        currentData={currentData}
        setCurrentData={setCurrentData}
        onNextGameRound={() => 0}
      ></Layout2DUserLine>
    </div>
  );
};
