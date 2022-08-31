import { useEffect } from "react";
import Layout1DUser from "./Layout1DUserLine";
import { IData, IDataPoint, weizen2Dataset1D } from "../Data";
import InitModal from "./InitModal";

export default ({
  currentData,
  setDataSinglePoint,
  setSelectedAttrib,
  setCurrentData,
}: {
  currentData: IData;
  setDataSinglePoint: (means: IDataPoint[]) => void;
  setSelectedAttrib: (xAxisAttrib: number, yAxisAttrib?: number) => void;
  setCurrentData: React.Dispatch<React.SetStateAction<IData>>;
}): JSX.Element => {
  useEffect(() => {setCurrentData(weizen2Dataset1D)}, []);
  
  return (
    <div>
      <InitModal title="irgendwas">Die Aufgabe ist das Weizen...</InitModal>
      <Layout1DUser
        currentData={currentData}
        setDataSinglePoint={setDataSinglePoint}
        setSelectedAttrib={setSelectedAttrib}
      ></Layout1DUser>
    </div>
  );
};
