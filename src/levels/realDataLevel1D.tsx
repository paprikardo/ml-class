import { useState } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import InitModal from "../components/InitModal";
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
  const dataset1D = { ...dataset };
  dataset.selected_attrib = 0;
  const [currentData, setCurrentData] = useState(dataset1D);
  return (
    <div>
      <InitModal title={initModalTitle}>{initModalContent}</InitModal>
      <Layout1DUser
        currentData={currentData}
        setCurrentData={setCurrentData}
      ></Layout1DUser>
    </div>
  );
};
