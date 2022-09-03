import { useState } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { weizen2Dataset } from "../Data";
import InitModal from "../components/InitModal";
import Layout2DUserLine from "../components/Layout2DUserLine";

export default ({
  initModalTitle,
  initModalContent,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
}): JSX.Element => {
  const dataset = { ...weizen2Dataset };
  dataset.selected_attrib = 0;
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
