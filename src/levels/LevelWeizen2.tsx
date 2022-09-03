import { useEffect, useState } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { IData, IDataPoint, weizen2Dataset1D } from "../Data";
import InitModal from "../components/InitModal";

export default ({
  initModalTitle,
  initModalContent,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
}): JSX.Element => {
  const dataset = weizen2Dataset1D;
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
