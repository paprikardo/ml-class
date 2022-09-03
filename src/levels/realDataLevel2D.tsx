import { useState } from "react";
import InitModal from "../components/InitModal";
import Layout2DUserLine from "../components/Layout2DUserLine";
import { IData } from "../Data";

export default ({
  initModalTitle,
  initModalContent,
  dataset,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
  dataset: IData;
}): JSX.Element => {
  const [currentData, setCurrentData] = useState(dataset);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout2DUserLine
        currentData={currentData}
        setCurrentData={setCurrentData}
        onNextGameRound={() => null}
      ></Layout2DUserLine>
    </div>
  );
};
