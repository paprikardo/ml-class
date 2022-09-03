import { useState } from "react";
import { weinsortenDataset } from "../Data";
import InitModal from "../components/InitModal";
import Layout2DUserLine from "../components/Layout2DUserLine";

export default ({
  initModalTitle,
  initModalContent,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
}): JSX.Element => {
  const dataset = { ...weinsortenDataset };
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
