import { useEffect, useState } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { IData, IDataPoint, weizen2Dataset } from "../Data";
import InitModal from "../components/InitModal";

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
      <Layout1DUser
        currentData={currentData}
        setCurrentData={setCurrentData}
      ></Layout1DUser>
    </div>
  );
};
