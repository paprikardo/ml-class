import { useEffect, useState } from "react";
import Layout1DUser from "../components/Layout1DUserLine";
import { IData, IDataPoint, schierlingDataset } from "../Data";
import InitModal from "../components/InitModal";
import { setCurrentDataType } from "../Others/currentDataHelperMethods";

export default ({
  initModalTitle,
  initModalContent,
}: {
  initModalTitle: string;
  initModalContent: React.ReactNode;
}): JSX.Element => {
  const schierlingDataset1D = {...schierlingDataset}
  schierlingDataset1D.selected_attrib = 0
  const [currentData,setCurrentData] = useState(schierlingDataset1D);
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
